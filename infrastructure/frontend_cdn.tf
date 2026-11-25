# =============================================================================
# Frontend Static Hosting CDN (S3 + CloudFront) — Mirrors DarAkili Architecture
# =============================================================================
# Serves the Next.js static export (`out/`) from a dedicated private S3 bucket
# behind CloudFront with Origin Access Control (OAC) and a CloudFront Function
# that handles clean URLs, `next-intl` `as-needed` locale routing (`/` -> `/en.html`,
# `/fr/...` -> `/fr/....html`), `www` -> apex canonical redirect, and security headers.

resource "random_string" "bucket_suffix" {
  length  = 8
  special = false
  upper   = false
}

resource "aws_s3_bucket" "frontend" {
  bucket        = "${local.name_prefix}-frontend-${random_string.bucket_suffix.result}"
  force_destroy = false

  tags = merge(local.common_tags, {
    Name = "${local.name_prefix}-frontend"
  })

  lifecycle {
    prevent_destroy = true
  }
}

resource "aws_s3_bucket_versioning" "frontend" {
  bucket = aws_s3_bucket.frontend.id
  versioning_configuration {
    status = "Enabled"
  }
}

resource "aws_s3_bucket_server_side_encryption_configuration" "frontend" {
  bucket = aws_s3_bucket.frontend.id

  rule {
    apply_server_side_encryption_by_default {
      sse_algorithm = "AES256"
    }
  }
}

resource "aws_s3_bucket_public_access_block" "frontend" {
  bucket = aws_s3_bucket.frontend.id

  block_public_acls       = true
  block_public_policy     = true
  ignore_public_acls      = true
  restrict_public_buckets = true
}

resource "aws_s3_bucket_lifecycle_configuration" "frontend" {
  bucket = aws_s3_bucket.frontend.id

  rule {
    id     = "cleanup_noncurrent_frontend_assets"
    status = "Enabled"

    filter {}

    noncurrent_version_expiration {
      noncurrent_days = var.s3_noncurrent_version_retention_days
    }
  }
}

resource "aws_cloudfront_origin_access_control" "frontend" {
  name                              = "${local.name_prefix}-frontend-oac"
  description                       = "OAC for DrKabongo frontend static site bucket"
  origin_access_control_origin_type = "s3"
  signing_behavior                  = "always"
  signing_protocol                  = "sigv4"
}

resource "aws_cloudfront_cache_policy" "frontend_html" {
  name        = "${local.name_prefix}-frontend-cache"
  comment     = "Frontend HTML, RSC payloads, EdTrace JSON traces, and public assets"
  default_ttl = 0
  max_ttl     = 31536000
  min_ttl     = 0

  parameters_in_cache_key_and_forwarded_to_origin {
    enable_accept_encoding_brotli = true
    enable_accept_encoding_gzip   = true

    cookies_config {
      cookie_behavior = "none"
    }

    headers_config {
      header_behavior = "none"
    }

    query_strings_config {
      query_string_behavior = "none"
    }
  }
}

resource "aws_cloudfront_cache_policy" "frontend_immutable" {
  name        = "${local.name_prefix}-frontend-immutable-cache"
  comment     = "Immutable cache for content-hashed /_next/static/* assets"
  default_ttl = 31536000
  max_ttl     = 31536000
  min_ttl     = 86400

  parameters_in_cache_key_and_forwarded_to_origin {
    enable_accept_encoding_brotli = true
    enable_accept_encoding_gzip   = true

    cookies_config {
      cookie_behavior = "none"
    }

    headers_config {
      header_behavior = "none"
    }

    query_strings_config {
      query_string_behavior = "none"
    }
  }
}

resource "aws_cloudfront_response_headers_policy" "frontend" {
  name    = "${local.name_prefix}-frontend-security-headers"
  comment = "Security headers for DrKabongo web frontend (adds X-Robots-Tag noindex on dev)"

  security_headers_config {
    content_type_options {
      override = true
    }

    frame_options {
      frame_option = "SAMEORIGIN"
      override     = true
    }

    referrer_policy {
      referrer_policy = "origin-when-cross-origin"
      override        = true
    }

    strict_transport_security {
      access_control_max_age_sec = 63072000
      include_subdomains         = true
      preload                    = true
      override                   = true
    }
  }

  dynamic "custom_headers_config" {
    for_each = var.environment == "prod" ? [] : [1]
    content {
      items {
        header   = "X-Robots-Tag"
        value    = "noindex, nofollow, noarchive"
        override = true
      }
    }
  }
}

resource "aws_cloudfront_function" "frontend_router" {
  name    = "${local.name_prefix}-frontend-router"
  runtime = "cloudfront-js-2.0"
  comment = "Clean URLs, www redirect, and next-intl as-needed locale routing for drkabongo.com"
  publish = true

  code = <<-EOT
function buildQueryString(qs) {
  if (!qs) return '';
  var parts = [];
  for (var key in qs) {
    if (!Object.prototype.hasOwnProperty.call(qs, key)) continue;
    var entry = qs[key];
    if (entry && entry.multiValue) {
      for (var i = 0; i < entry.multiValue.length; i++) {
        var mv = entry.multiValue[i].value;
        parts.push(encodeURIComponent(key) + (mv ? '=' + encodeURIComponent(mv) : ''));
      }
    } else if (entry && entry.value !== undefined && entry.value !== '') {
      parts.push(encodeURIComponent(key) + '=' + encodeURIComponent(entry.value));
    } else {
      parts.push(encodeURIComponent(key));
    }
  }
  return parts.length > 0 ? '?' + parts.join('&') : '';
}

var NON_DEFAULT_LOCALES = { fr: true, sw: true, ln: true, lua: true };

function prefixWithDefaultLocale(path) {
  if (path === '/' || path === '') return '/en';
  var parts = path.split('/');
  var first = parts[1] || '';
  if (first === 'en' || NON_DEFAULT_LOCALES[first]) {
    return path;
  }
  return '/en' + path;
}

function handler(event) {
  var request = event.request;
  var uri = request.uri || '/';
  var headers = request.headers || {};
  var host = headers.host && headers.host.value ? headers.host.value.toLowerCase() : '';

  if (host === 'www.drkabongo.com') {
    return {
      statusCode: 308,
      statusDescription: 'Permanent Redirect',
      headers: {
        location: { value: 'https://drkabongo.com' + uri + buildQueryString(request.querystring) }
      }
    };
  }

  // Pass through Next.js build assets, EdTrace traces, media, feeds, and metadata files.
  if (
    uri.indexOf('/_next/') === 0 ||
    uri.indexOf('/edtrace/') === 0 ||
    uri.indexOf('/images/') === 0 ||
    uri.indexOf('/covers/') === 0 ||
    uri.indexOf('/videos/') === 0 ||
    uri.indexOf('/archive/') === 0 ||
    uri.indexOf('/.well-known/') === 0 ||
    uri === '/robots.txt' ||
    uri === '/sitemap.xml' ||
    uri === '/feed.xml' ||
    uri === '/favicon.ico'
  ) {
    return request;
  }

  // Canonicalize explicit `/en` or `/en/...` to unprefixed English URLs (`localePrefix: 'as-needed'`),
  // except for Next.js RSC payload requests (`.txt` / `/__next.*`) and OpenGraph images.
  if (
    (uri === '/en' || uri === '/en/' || uri.indexOf('/en/') === 0) &&
    uri.indexOf('/__next.') === -1 &&
    uri.slice(-4) !== '.txt' &&
    uri.indexOf('/opengraph-image') === -1
  ) {
    var stripped = uri.substring(3) || '/';
    return {
      statusCode: 308,
      statusDescription: 'Permanent Redirect',
      headers: {
        location: { value: stripped + buildQueryString(request.querystring) }
      }
    };
  }

  // Next.js App Router RSC segment payloads (`/__next.*` or `*.txt`).
  if (uri === '/index.txt' || uri.indexOf('/__next.') === 0) {
    request.uri = '/en' + uri;
    return request;
  }

  var nextSegIdx = uri.indexOf('/__next.');
  if (nextSegIdx > 0) {
    var segRoutePath = uri.substring(0, nextSegIdx);
    var segSuffix = uri.substring(nextSegIdx);
    request.uri = prefixWithDefaultLocale(segRoutePath) + segSuffix;
    return request;
  }

  // Normalize trailing slash (except root `/`).
  if (uri.length > 1 && uri.charAt(uri.length - 1) === '/') {
    uri = uri.substring(0, uri.length - 1);
  }

  var lastSlash = uri.lastIndexOf('/');
  var lastSegment = uri.substring(lastSlash + 1);
  var dotIdx = lastSegment.lastIndexOf('.');

  if (dotIdx !== -1) {
    var ext = lastSegment.substring(dotIdx).toLowerCase();
    if (ext === '.txt') {
      var txtRoutePath = uri.substring(0, uri.length - 4);
      request.uri = prefixWithDefaultLocale(txtRoutePath) + '.txt';
      return request;
    }
    if (ext === '.html') {
      var htmlRoutePath = uri.substring(0, uri.length - 5);
      if (htmlRoutePath === '/404') {
        return request;
      }
      request.uri = prefixWithDefaultLocale(htmlRoutePath) + '.html';
      return request;
    }
    var staticAssetExts = {
      '.js': true, '.mjs': true, '.css': true, '.map': true,
      '.png': true, '.jpg': true, '.jpeg': true, '.gif': true, '.webp': true, '.svg': true, '.ico': true, '.avif': true,
      '.woff': true, '.woff2': true, '.ttf': true, '.otf': true, '.eot': true,
      '.json': true, '.xml': true, '.webmanifest': true, '.pdf': true,
      '.mp3': true, '.mp4': true, '.wav': true, '.webm': true, '.ogg': true, '.m4a': true,
      '.zip': true, '.wasm': true, '.tar': true
    };
    if (staticAssetExts[ext]) {
      return request;
    }
  }

  // Clean HTML page request: `/` -> `/en.html`, `/speaking` -> `/en/speaking.html`, `/fr/speaking` -> `/fr/speaking.html`.
  request.uri = prefixWithDefaultLocale(uri) + '.html';
  return request;
}
EOT
}

# AWS Managed Policies for optional `/api/subscribe` Lambda origin
data "aws_cloudfront_cache_policy" "caching_disabled" {
  name = "Managed-CachingDisabled"
}

data "aws_cloudfront_origin_request_policy" "all_viewer_except_host" {
  name = "Managed-AllViewerExceptHostHeader"
}

resource "aws_cloudfront_distribution" "frontend" {
  enabled             = true
  is_ipv6_enabled     = true
  http_version        = "http2and3"
  comment             = "${local.name_prefix} web frontend"
  default_root_object = "en.html"
  aliases             = var.enable_custom_domain ? local.frontend_aliases : []
  price_class         = var.cloudfront_price_class

  origin {
    domain_name              = aws_s3_bucket.frontend.bucket_regional_domain_name
    origin_id                = "frontend-s3"
    origin_access_control_id = aws_cloudfront_origin_access_control.frontend.id
  }

  dynamic "origin" {
    for_each = var.enable_subscribe_api ? [1] : []
    content {
      domain_name = local.subscribe_lambda_domain
      origin_id   = "subscribe-lambda"

      custom_origin_config {
        http_port              = 80
        https_port             = 443
        origin_protocol_policy = "https-only"
        origin_ssl_protocols   = ["TLSv1.2"]
      }
    }
  }

  dynamic "ordered_cache_behavior" {
    for_each = var.enable_subscribe_api ? [1] : []
    content {
      path_pattern             = "/api/subscribe"
      target_origin_id         = "subscribe-lambda"
      viewer_protocol_policy   = "redirect-to-https"
      allowed_methods          = ["DELETE", "GET", "HEAD", "OPTIONS", "PATCH", "POST", "PUT"]
      cached_methods           = ["GET", "HEAD"]
      compress                 = true
      cache_policy_id          = data.aws_cloudfront_cache_policy.caching_disabled.id
      origin_request_policy_id = data.aws_cloudfront_origin_request_policy.all_viewer_except_host.id
    }
  }

  ordered_cache_behavior {
    path_pattern               = "/_next/static/*"
    target_origin_id           = "frontend-s3"
    viewer_protocol_policy     = "redirect-to-https"
    allowed_methods            = ["GET", "HEAD", "OPTIONS"]
    cached_methods             = ["GET", "HEAD", "OPTIONS"]
    compress                   = true
    cache_policy_id            = aws_cloudfront_cache_policy.frontend_immutable.id
    response_headers_policy_id = aws_cloudfront_response_headers_policy.frontend.id
  }

  default_cache_behavior {
    target_origin_id           = "frontend-s3"
    viewer_protocol_policy     = "redirect-to-https"
    allowed_methods            = ["GET", "HEAD", "OPTIONS"]
    cached_methods             = ["GET", "HEAD", "OPTIONS"]
    compress                   = true
    cache_policy_id            = aws_cloudfront_cache_policy.frontend_html.id
    response_headers_policy_id = aws_cloudfront_response_headers_policy.frontend.id

    function_association {
      event_type   = "viewer-request"
      function_arn = aws_cloudfront_function.frontend_router.arn
    }
  }

  custom_error_response {
    error_code            = 404
    response_code         = 404
    response_page_path    = "/404.html"
    error_caching_min_ttl = 10
  }

  restrictions {
    geo_restriction {
      restriction_type = "none"
    }
  }

  viewer_certificate {
    cloudfront_default_certificate = var.enable_custom_domain ? false : true
    acm_certificate_arn            = var.enable_custom_domain ? local.effective_certificate_arn : null
    ssl_support_method             = var.enable_custom_domain ? "sni-only" : null
    minimum_protocol_version       = var.enable_custom_domain ? "TLSv1.2_2021" : "TLSv1"
  }

  tags = merge(local.common_tags, {
    Name = local.frontend_domain_name
  })
}

resource "aws_s3_bucket_policy" "frontend" {
  bucket = aws_s3_bucket.frontend.id

  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Sid       = "DenyBucketDeletion"
        Effect    = "Deny"
        Principal = "*"
        Action    = "s3:DeleteBucket"
        Resource  = aws_s3_bucket.frontend.arn
        Condition = {
          StringNotLike = {
            "aws:PrincipalArn" = "arn:aws:iam::*:role/admin-*"
          }
        }
      },
      {
        Sid    = "AllowCloudFrontFrontendRead"
        Effect = "Allow"
        Principal = {
          Service = "cloudfront.amazonaws.com"
        }
        Action = [
          "s3:GetObject",
          "s3:ListBucket"
        ]
        Resource = [
          aws_s3_bucket.frontend.arn,
          "${aws_s3_bucket.frontend.arn}/*"
        ]
        Condition = {
          StringEquals = {
            "AWS:SourceArn" = aws_cloudfront_distribution.frontend.arn
          }
        }
      }
    ]
  })
}
