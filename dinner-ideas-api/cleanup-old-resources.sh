#!/usr/bin/env bash
# =============================================================================
# cleanup-old-resources.sh
# Deletes the manually-created AWS resources that conflict with the new
# CloudFormation stacks. Run this BEFORE deploy-backend.sh.
#
# ⚠️  WARNING: This destroys the old DynamoDB table and its data.
# =============================================================================
set -euo pipefail

REGION="${AWS_DEFAULT_REGION:-us-west-1}"

echo "==============================================="
echo " Cleaning up old manual AWS resources"
echo " Region: $REGION"
echo "==============================================="

# ---- 1. Delete old Lambda function ----
echo ""
echo "[1/6] Deleting Lambda function dinner-ideas-lambda-api..."
aws lambda delete-function \
    --function-name dinner-ideas-lambda-api \
    --region "$REGION" 2>/dev/null && echo "  Deleted." || echo "  Not found (already deleted)."

# ---- 2. Find and delete old API Gateway ----
echo ""
echo "[2/6] Deleting old API Gateway..."
API_ID=$(aws apigateway get-rest-apis \
    --region "$REGION" \
    --query 'items[?name==`dinner-ideas-api`].id' \
    --output text 2>/dev/null || echo "")
if [ -n "$API_ID" ] && [ "$API_ID" != "None" ]; then
    aws apigateway delete-rest-api --rest-api-id "$API_ID" --region "$REGION"
    echo "  Deleted API Gateway: $API_ID"
else
    echo "  Not found (already deleted)."
fi

# Also check for HTTP API (v2)
echo ""
echo "  Checking for HTTP APIs..."
HTTP_API_ID=$(aws apigatewayv2 get-apis \
    --region "$REGION" \
    --query 'Items[?Name==`dinner-ideas-api`].ApiId' \
    --output text 2>/dev/null || echo "")
if [ -n "$HTTP_API_ID" ] && [ "$HTTP_API_ID" != "None" ]; then
    aws apigatewayv2 delete-api --api-id "$HTTP_API_ID" --region "$REGION"
    echo "  Deleted HTTP API: $HTTP_API_ID"
fi

# ---- 3. Delete old IAM role ----
echo ""
echo "[3/6] Deleting IAM role dinner-ideas-lambda-apigateway-role..."
# Detach managed policies first
POLICIES=$(aws iam list-attached-role-policies \
    --role-name dinner-ideas-lambda-apigateway-role \
    --query 'AttachedPolicies[*].PolicyArn' \
    --output text 2>/dev/null || echo "")
for policy in $POLICIES; do
    if [ -n "$policy" ] && [ "$policy" != "None" ]; then
        aws iam detach-role-policy \
            --role-name dinner-ideas-lambda-apigateway-role \
            --policy-arn "$policy"
        echo "  Detached policy: $policy"
    fi
done

# Delete inline policies
INLINE_POLICIES=$(aws iam list-role-policies \
    --role-name dinner-ideas-lambda-apigateway-role \
    --query 'PolicyNames[*]' \
    --output text 2>/dev/null || echo "")
for policy in $INLINE_POLICIES; do
    if [ -n "$policy" ] && [ "$policy" != "None" ]; then
        aws iam delete-role-policy \
            --role-name dinner-ideas-lambda-apigateway-role \
            --policy-name "$policy"
        echo "  Deleted inline policy: $policy"
    fi
done

aws iam delete-role \
    --role-name dinner-ideas-lambda-apigateway-role 2>/dev/null && echo "  Deleted IAM role." || echo "  Not found (already deleted)."

# ---- 4. Delete old DynamoDB table ----
echo ""
echo "[4/6] Deleting DynamoDB table dinner-ideas-table..."
aws dynamodb delete-table \
    --table-name dinner-ideas-table \
    --region "$REGION" 2>/dev/null && echo "  Deleted (may take a moment)." || echo "  Not found (already deleted)."

# ---- 5. Delete old S3 bucket (frontend) ----
echo ""
echo "[5/6] Deleting S3 bucket shaun-web-app-bucket..."
aws s3 rb s3://shaun-web-app-bucket --force --region "$REGION" 2>/dev/null && echo "  Deleted." || echo "  Not found (already deleted)."

# ---- 6. Delete old CloudFront distribution ----
echo ""
echo "[6/6] Deleting CloudFront distribution E2FB4BIJQ16WX6..."
# First disable it
aws cloudfront get-distribution-config \
    --id E2FB4BIJQ16WX6 \
    --query '{DistributionConfig:DistributionConfig,ETag:ETag}' \
    --output json > /tmp/cf-config.json 2>/dev/null || true

if [ -f /tmp/cf-config.json ] && [ -s /tmp/cf-config.json ]; then
    ETAG=$(python3 -c "import json,sys; d=json.load(open('/tmp/cf-config.json')); print(d['ETag'])" 2>/dev/null || echo "")
    CONFIG=$(python3 -c "import json,sys; d=json.load(open('/tmp/cf-config.json')); c=d['DistributionConfig']; c['Enabled']=False; print(json.dumps(c))" 2>/dev/null || echo "")
    if [ -n "$ETAG" ] && [ -n "$CONFIG" ]; then
        echo "  Disabling distribution..."
        aws cloudfront update-distribution \
            --id E2FB4BIJQ16WX6 \
            --distribution-config "$CONFIG" \
            --if-match "$ETAG" > /dev/null 2>&1 || true
        echo "  Waiting for distribution to disable (this can take 5-10 minutes)..."
        aws cloudfront wait distribution-deployed --id E2FB4BIJQ16WX6 2>/dev/null || true
        # Now delete
        ETAG2=$(aws cloudfront get-distribution --id E2FB4BIJQ16WX6 --query 'ETag' --output text 2>/dev/null || echo "")
        if [ -n "$ETAG2" ]; then
            aws cloudfront delete-distribution --id E2FB4BIJQ16WX6 --if-match "$ETAG2" 2>/dev/null && echo "  Deleted." || echo "  Could not delete (may need to wait longer)."
        fi
    fi
    rm -f /tmp/cf-config.json
else
    echo "  Not found (already deleted)."
fi

echo ""
echo "==============================================="
echo " Cleanup complete!"
echo " You can now run:"
echo "   JWT_SECRET='your-secret' ./deploy-backend.sh"
echo "==============================================="
