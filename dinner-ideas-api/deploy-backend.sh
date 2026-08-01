#!/usr/bin/env bash
# =============================================================================
# deploy-backend.sh
# Idempotent deploy for the Dinner Ideas backend stack.
#
# What it does:
#   1. Ensures the deploy artifact S3 bucket exists (private, no public access)
#   2. Builds the .NET Lambda project (linux-arm64, self-contained)
#   3. Packages the Lambda code + CloudFormation template via 'aws cloudformation package'
#   4. Deploys/updates the backend CloudFormation stack (Lambda, API Gateway,
#      DynamoDB, Image S3 bucket, IAM role)
#
# Prerequisites:
#   - AWS CLI installed and configured
#   - .NET 10 SDK installed
#   - JWT_SECRET passed via environment variable or set as a CFN parameter
#
# Usage:
#   JWT_SECRET=your-secret-here ./deploy-backend.sh
#   JWT_SECRET=your-secret-here STAGE=staging ./deploy-backend.sh
# =============================================================================

set -euo pipefail

# ---- Configuration ----
STACK_NAME="${STACK_NAME:-dinner-ideas-backend}"
STAGE="${STAGE:-prod}"
REGION="${AWS_DEFAULT_REGION:-us-west-1}"
JWT_SECRET="${JWT_SECRET:-}"

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_DIR="$(dirname "$SCRIPT_DIR")"
LAMBDA_PROJECT="$SCRIPT_DIR/dinner-ideas-lambda"
CFN_TEMPLATE="$PROJECT_DIR/cloudformation/backend.yaml"
ZIP_FILE="$SCRIPT_DIR/function.zip"
PACKAGED_TEMPLATE="$SCRIPT_DIR/packaged-backend.yaml"

# Derive deploy bucket name from AWS account ID
AWS_ACCOUNT_ID=$(aws sts get-caller-identity --query Account --output text)
DEPLOY_BUCKET="dinner-ideas-deploy-${AWS_ACCOUNT_ID}"

echo "==============================================="
echo " Deploying Backend Stack: $STACK_NAME"
echo " Stage:       $STAGE"
echo " Region:      $REGION"
echo " Deploy S3:   s3://$DEPLOY_BUCKET"
echo "==============================================="

# ---- Step 1: Ensure deploy artifact bucket exists ----
echo ""
echo "[1/5] Ensuring deploy artifact bucket exists..."
if aws s3api head-bucket --bucket "$DEPLOY_BUCKET" 2>/dev/null; then
    echo "  Bucket s3://$DEPLOY_BUCKET already exists."
else
    echo "  Creating deploy artifact bucket s3://$DEPLOY_BUCKET..."
    aws s3 mb "s3://$DEPLOY_BUCKET" --region "$REGION"
    # Block all public access
    aws s3api put-public-access-block \
        --bucket "$DEPLOY_BUCKET" \
        --public-access-block-configuration \
        'BlockPublicAcls=true,IgnorePublicAcls=true,BlockPublicPolicy=true,RestrictPublicBuckets=true'
    # Enforce bucket owner ownership (disable ACLs)
    aws s3api put-bucket-ownership-controls \
        --bucket "$DEPLOY_BUCKET" \
        --ownership-controls 'Rules=[{ObjectOwnership=BucketOwnerEnforced}]'
    echo "  Deploy bucket created and secured."
fi

# ---- Step 2: Build the .NET Lambda project ----
echo ""
echo "[2/5] Building .NET Lambda project..."
# Use the same relative-path approach as the original zip.sh to avoid
# MSBuild project-name ambiguity (three projects share the 'dinner-ideas-lambda' prefix).
cd "$SCRIPT_DIR"
dotnet publish ./dinner-ideas-lambda \
    --runtime linux-arm64 \
    --configuration Release

# .NET publish with --runtime outputs directly to bin/Release/<tfm>/<rid>/
PUBLISH_DIR="$LAMBDA_PROJECT/bin/Release/net10.0/linux-arm64"

# The 'provided.al2023' Lambda runtime looks for a 'bootstrap' executable
# at the zip root.  .NET self-contained publish produces a native binary
# (named after the assembly) but not the bootstrap shim.  Create one that
# simply execs the native binary.
BOOTSTRAP="$PUBLISH_DIR/bootstrap"
if [ ! -f "$BOOTSTRAP" ]; then
    echo '#!/bin/sh' > "$BOOTSTRAP"
    echo 'exec /var/task/dinner-ideas-lambda' >> "$BOOTSTRAP"
    chmod +x "$BOOTSTRAP"
fi

echo "  Build complete."

# ---- Step 3: Create deployment zip ----
echo ""
echo "[3/5] Creating deployment zip..."
cd "$PUBLISH_DIR"
rm -f "$ZIP_FILE"
zip -r "$ZIP_FILE" . > /dev/null
echo "  Zip created: $ZIP_FILE ($(du -h "$ZIP_FILE" | cut -f1))"

# ---- Step 4: Package CloudFormation template ----
echo ""
echo "[4/5] Packaging CloudFormation template..."
cd "$SCRIPT_DIR"
aws cloudformation package \
    --template-file "$CFN_TEMPLATE" \
    --s3-bucket "$DEPLOY_BUCKET" \
    --s3-prefix "lambda-code" \
    --output-template-file "$PACKAGED_TEMPLATE" \
    --region "$REGION"
echo "  Template packaged: $PACKAGED_TEMPLATE"

# ---- Step 5: Deploy CloudFormation stack ----
echo ""
echo "[5/5] Deploying CloudFormation stack..."

JWT_PARAM=""
if [ -n "$JWT_SECRET" ]; then
    JWT_PARAM="JwtSecret=$JWT_SECRET"
else
    # Try to get from existing stack, fall back to SSM
    echo "  WARNING: JWT_SECRET not set. If this is a new stack, provide JWT_SECRET env var."
    echo "  Attempting to reuse existing value from stack..."
fi

aws cloudformation deploy \
    --template-file "$PACKAGED_TEMPLATE" \
    --stack-name "$STACK_NAME" \
    --capabilities CAPABILITY_IAM CAPABILITY_NAMED_IAM \
    --parameter-overrides \
        "StageName=$STAGE" \
        ${JWT_SECRET:+"JwtSecret=$JWT_SECRET"} \
    --region "$REGION" \
    --no-fail-on-empty-changeset

echo ""
echo "==============================================="
echo " Backend stack deployed successfully!"
echo ""
echo " Stack outputs:"
aws cloudformation describe-stacks \
    --stack-name "$STACK_NAME" \
    --region "$REGION" \
    --query 'Stacks[0].Outputs[*].[OutputKey,OutputValue]' \
    --output table
echo "==============================================="
