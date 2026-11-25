#!/usr/bin/env bash
# =============================================================================
# Deploy Dr. Kabongo Static Frontend to AWS S3 + CloudFront
# =============================================================================
# Mirrors DarAkili's `scripts/deploy_frontend.sh`:
#   1. Builds static Next.js export (`out/`) unless `SKIP_FRONTEND_BUILD=1`.
#   2. Syncs content-hashed `/_next/static/*` with immutable 1-year cache (no --delete).
#   3. Syncs HTML, RSC payloads, EdTrace traces, and public assets with revalidation.
#   4. Sets explicit XML content-types on `feed.xml` and `sitemap.xml`.
#   5. Invalidates the CloudFront distribution (`/*`).
#
# Usage:
#   ./scripts/deploy_frontend.sh [dev|prod]
#
# Optional environment overrides (auto-resolved from Terraform outputs if unset):
#   FRONTEND_S3_BUCKET
#   FRONTEND_CLOUDFRONT_DISTRIBUTION_ID
#   NEXT_PUBLIC_ROOT_DOMAIN
#   NEXT_PUBLIC_APP_ENV
#   NEXT_PUBLIC_SUBSCRIBE_ENABLED
#   SHOW_DRAFT_TALKS=1   (optional, to preview draft talks on dev)

set -euo pipefail

ENVIRONMENT="${1:-dev}"
if [[ "$ENVIRONMENT" != "dev" && "$ENVIRONMENT" != "prod" ]]; then
  echo "Error: environment must be 'dev' or 'prod' (got '$ENVIRONMENT')" >&2
  exit 1
fi

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
INFRA_DIR="$ROOT_DIR/infrastructure"
OUT_DIR="$ROOT_DIR/out"
AWS_REGION="${AWS_REGION:-us-east-1}"

tf_out() {
  local name="$1"
  local val
  if val="$(cd "$INFRA_DIR" && terraform output -raw "$name" 2>/dev/null)"; then
    if [[ "$val" != *"::error::"* ]]; then
      printf '%s' "$val"
      return 0
    fi
  fi
  printf ''
}

FRONTEND_S3_BUCKET="${FRONTEND_S3_BUCKET:-$(tf_out frontend_s3_bucket_name)}"
FRONTEND_CLOUDFRONT_DISTRIBUTION_ID="${FRONTEND_CLOUDFRONT_DISTRIBUTION_ID:-$(tf_out frontend_cloudfront_distribution_id)}"

if [[ -z "$FRONTEND_S3_BUCKET" ]]; then
  echo "Error: FRONTEND_S3_BUCKET could not be resolved from environment or Terraform output 'frontend_s3_bucket_name'." >&2
  exit 1
fi

if [[ -z "$FRONTEND_CLOUDFRONT_DISTRIBUTION_ID" ]]; then
  echo "Error: FRONTEND_CLOUDFRONT_DISTRIBUTION_ID could not be resolved from environment or Terraform output 'frontend_cloudfront_distribution_id'." >&2
  exit 1
fi

export NEXT_PUBLIC_APP_ENV="${NEXT_PUBLIC_APP_ENV:-$ENVIRONMENT}"
if [[ -z "${NEXT_PUBLIC_ROOT_DOMAIN:-}" ]]; then
  if [[ "$ENVIRONMENT" == "prod" ]]; then
    export NEXT_PUBLIC_ROOT_DOMAIN="drkabongo.com"
  else
    export NEXT_PUBLIC_ROOT_DOMAIN="dev.drkabongo.com"
  fi
fi

if [[ -z "${NEXT_PUBLIC_SUBSCRIBE_ENABLED:-}" ]]; then
  SUBSCRIBE_URL="$(tf_out subscribe_lambda_url)"
  if [[ -n "$SUBSCRIBE_URL" ]]; then
    export NEXT_PUBLIC_SUBSCRIBE_ENABLED="true"
  else
    export NEXT_PUBLIC_SUBSCRIBE_ENABLED="false"
  fi
fi

echo "=================================================================="
echo "Deploying Dr. Kabongo Frontend ($ENVIRONMENT)"
echo "  Domain:              $NEXT_PUBLIC_ROOT_DOMAIN"
echo "  App Env:             $NEXT_PUBLIC_APP_ENV"
echo "  Subscribe API:       $NEXT_PUBLIC_SUBSCRIBE_ENABLED"
echo "  Draft Talks:         ${SHOW_DRAFT_TALKS:-0}"
echo "  S3 Bucket:           s3://$FRONTEND_S3_BUCKET"
echo "  CloudFront Dist ID:  $FRONTEND_CLOUDFRONT_DISTRIBUTION_ID"
echo "=================================================================="

if [[ "${SKIP_FRONTEND_BUILD:-0}" != "1" ]]; then
  echo "Building static Next.js export (out/)..."
  (cd "$ROOT_DIR" && npm run build)
fi

if [[ ! -d "$OUT_DIR" ]]; then
  echo "Error: static export directory '$OUT_DIR' does not exist." >&2
  exit 1
fi

echo "1/4 Syncing immutable /_next/static/* bundles (no --delete so open tabs keep working)..."
aws s3 sync "$OUT_DIR/_next/static" "s3://$FRONTEND_S3_BUCKET/_next/static" \
  --region "$AWS_REGION" \
  --cache-control "public, max-age=31536000, immutable" \
  --exclude ".DS_Store" \
  --exclude "*/.DS_Store"

echo "2/4 Syncing HTML, RSC payloads, EdTrace traces, and public assets..."
aws s3 sync "$OUT_DIR" "s3://$FRONTEND_S3_BUCKET" \
  --region "$AWS_REGION" \
  --exclude "_next/static/*" \
  --exclude "feed.xml" \
  --exclude "sitemap.xml" \
  --exclude ".DS_Store" \
  --exclude "*/.DS_Store" \
  --cache-control "public, max-age=0, must-revalidate" \
  --delete

echo "3/4 Uploading RSS feed & sitemap with explicit XML Content-Type..."
if [[ -f "$OUT_DIR/feed.xml" ]]; then
  aws s3 cp "$OUT_DIR/feed.xml" "s3://$FRONTEND_S3_BUCKET/feed.xml" \
    --region "$AWS_REGION" \
    --content-type "application/rss+xml; charset=utf-8" \
    --cache-control "public, max-age=300, must-revalidate"
fi

if [[ -f "$OUT_DIR/sitemap.xml" ]]; then
  aws s3 cp "$OUT_DIR/sitemap.xml" "s3://$FRONTEND_S3_BUCKET/sitemap.xml" \
    --region "$AWS_REGION" \
    --content-type "application/xml; charset=utf-8" \
    --cache-control "public, max-age=300, must-revalidate"
fi

echo "4/4 Creating CloudFront cache invalidation..."
INVALIDATION_ID="$(
  aws cloudfront create-invalidation \
    --distribution-id "$FRONTEND_CLOUDFRONT_DISTRIBUTION_ID" \
    --paths "/*" \
    --query 'Invalidation.Id' \
    --output text
)"
echo "Frontend deployed and CloudFront invalidation created ($INVALIDATION_ID)"
