#!/usr/bin/env bash
# =============================================================================
# deploy-frontend.sh
# Idempotent deploy for the Dinner Ideas frontend stack.
#
# What it does:
#   1. Retrieves the API CloudFront URL from the backend stack
#   2. Builds the React/Vite frontend with the API endpoint
#   3. Deploys/updates the frontend CloudFormation stack (S3 + CloudFront for SPA)
#   4. Syncs built files to the app S3 bucket
#   5. Invalidates the CloudFront cache so new content is served immediately
#
# Prerequisites:
#   - AWS CLI installed and configured
#   - Node.js 24+ installed
#   - Backend stack must be deployed first (provides API Gateway URL)
#
# Usage:
#   ./deploy-frontend.sh
#   STAGE=staging ./deploy-frontend.sh
# =============================================================================

set -euo pipefail

# ---- Configuration ----
BACKEND_STACK_NAME="${BACKEND_STACK_NAME:-dinner-ideas-backend}"
FRONTEND_STACK_NAME="${FRONTEND_STACK_NAME:-dinner-ideas-frontend}"
STAGE="${STAGE:-prod}"
REGION="${AWS_DEFAULT_REGION:-us-west-1}"

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_DIR="$(dirname "$SCRIPT_DIR")"
FRONTEND_DIR="$PROJECT_DIR/dinner-ideas"
CFN_TEMPLATE="$PROJECT_DIR/cloudformation/frontend.yaml"

echo "==============================================="
echo " Deploying Frontend Stack: $FRONTEND_STACK_NAME"
echo " Stage:       $STAGE"
echo " Region:      $REGION"
echo "==============================================="

# ---- Step 1: Retrieve API CloudFront URL from backend stack ----
echo ""
echo "[1/5] Retrieving API CloudFront URL from backend stack ($BACKEND_STACK_NAME)..."
API_CF_URL=$(aws cloudformation describe-stacks \
    --stack-name "$BACKEND_STACK_NAME" \
    --region "$REGION" \
    --query 'Stacks[0].Outputs[?OutputKey==`ApiCloudFrontUrl`].OutputValue' \
    --output text 2>/dev/null || echo "")

if [ -z "$API_CF_URL" ] || [ "$API_CF_URL" = "None" ]; then
    echo "  ERROR: Could not retrieve API CloudFront URL from backend stack '$BACKEND_STACK_NAME'."
    echo "  Make sure the backend stack is deployed first."
    exit 1
fi
echo "  API CloudFront URL: $API_CF_URL"

# ---- Step 2: Build the React frontend ----
echo ""
echo "[2/5] Building React frontend..."
cd "$FRONTEND_DIR"
npm ci
VITE_APP_API_ENDPOINT="$API_CF_URL" npm run build
echo "  Build complete. Output: $FRONTEND_DIR/dist"

# ---- Step 3: Deploy frontend CloudFormation stack (S3 + CloudFront) ----
echo ""
echo "[3/5] Deploying frontend CloudFormation stack..."
cd "$SCRIPT_DIR"
aws cloudformation deploy \
    --template-file "$CFN_TEMPLATE" \
    --stack-name "$FRONTEND_STACK_NAME" \
    --capabilities CAPABILITY_IAM \
    --region "$REGION" \
    --no-fail-on-empty-changeset
echo "  Frontend stack deploy complete."

# ---- Step 4: Retrieve outputs ----
echo ""
echo "[4/5] Retrieving stack outputs..."
APP_BUCKET=$(aws cloudformation describe-stacks \
    --stack-name "$FRONTEND_STACK_NAME" \
    --region "$REGION" \
    --query 'Stacks[0].Outputs[?OutputKey==`AppBucketName`].OutputValue' \
    --output text)

CF_DISTRIBUTION_ID=$(aws cloudformation describe-stacks \
    --stack-name "$FRONTEND_STACK_NAME" \
    --region "$REGION" \
    --query 'Stacks[0].Outputs[?OutputKey==`CloudFrontDistributionId`].OutputValue' \
    --output text)

CF_DOMAIN=$(aws cloudformation describe-stacks \
    --stack-name "$FRONTEND_STACK_NAME" \
    --region "$REGION" \
    --query 'Stacks[0].Outputs[?OutputKey==`CloudFrontDomainName`].OutputValue' \
    --output text)

echo "  App S3 bucket:    $APP_BUCKET"
echo "  CloudFront ID:    $CF_DISTRIBUTION_ID"
echo "  CloudFront domain: $CF_DOMAIN"

# ---- Step 5: Sync built files to S3 + invalidate CloudFront ----
echo ""
echo "[5/5] Syncing files to S3 and invalidating CloudFront cache..."

# Sync built files (delete removed files, no public-read ACL — CloudFront uses OAC)
aws s3 sync "$FRONTEND_DIR/dist" "s3://$APP_BUCKET" \
    --delete \
    --region "$REGION"
echo "  S3 sync complete."

# Invalidate entire CloudFront cache
INVALIDATION_ID=$(aws cloudfront create-invalidation \
    --distribution-id "$CF_DISTRIBUTION_ID" \
    --paths '/*' \
    --query 'Invalidation.Id' \
    --output text)
echo "  CloudFront invalidation created: $INVALIDATION_ID"

echo ""
echo "==============================================="
echo " Frontend stack deployed successfully!"
echo ""
echo " CloudFront URL: https://$CF_DOMAIN"
echo ""
echo " It may take a few minutes for the CloudFront"
echo " invalidation to propagate globally."
echo ""
echo " Check status:"
echo "   aws cloudfront get-invalidation \\"
echo "     --distribution-id $CF_DISTRIBUTION_ID \\"
echo "     --id $INVALIDATION_ID"
echo "==============================================="
