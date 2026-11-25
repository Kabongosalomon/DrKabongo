output "frontend_s3_bucket_name" {
  description = "Private S3 bucket hosting the Next.js static export (`out/`)"
  value       = aws_s3_bucket.frontend.id
}

output "frontend_cloudfront_distribution_id" {
  description = "CloudFront distribution ID for cache invalidation"
  value       = aws_cloudfront_distribution.frontend.id
}

output "frontend_cloudfront_domain_name" {
  description = "CloudFront target domain for DNS CNAME / ALIAS record"
  value       = aws_cloudfront_distribution.frontend.domain_name
}

output "frontend_custom_domains" {
  description = "Configured custom domain aliases on CloudFront"
  value       = var.enable_custom_domain ? local.frontend_aliases : []
}

output "acm_certificate_arn" {
  description = "ACM certificate ARN (us-east-1) for CloudFront TLS"
  value       = local.effective_certificate_arn
}

output "acm_dns_validation_records" {
  description = "Add these CNAME record(s) to your DNS provider so ACM issues the TLS certificate"
  value = var.acm_certificate_arn == "" ? [
    for dvo in aws_acm_certificate.frontend[0].domain_validation_options : {
      domain_name  = dvo.domain_name
      record_name  = dvo.resource_record_name
      record_type  = dvo.resource_record_type
      record_value = dvo.resource_record_value
    }
  ] : []
}

output "subscribe_lambda_url" {
  description = "Lambda Function URL powering POST /api/subscribe (empty if disabled)"
  value       = var.enable_subscribe_api ? aws_lambda_function_url.subscribe[0].function_url : ""
}
