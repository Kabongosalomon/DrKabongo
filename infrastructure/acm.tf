# =============================================================================
# ACM TLS Certificate (us-east-1 for CloudFront)
# =============================================================================
# Creates a DNS-validated ACM certificate when `var.acm_certificate_arn` is empty.
# After the first `terraform apply`, add the CNAME record(s) printed in
# `acm_dns_validation_records` to your DNS provider, wait for Status = ISSUED,
# then set `enable_custom_domain = true` in `vars/<env>.tfvars` and apply again.

resource "aws_acm_certificate" "frontend" {
  count = var.acm_certificate_arn == "" ? 1 : 0

  domain_name               = local.frontend_domain_name
  subject_alternative_names = var.environment == "prod" ? ["www.${var.domain_name}"] : []
  validation_method         = "DNS"

  tags = merge(local.common_tags, {
    Name = "${local.name_prefix}-frontend-cert"
  })

  lifecycle {
    create_before_destroy = true
  }
}

locals {
  effective_certificate_arn = var.acm_certificate_arn != "" ? var.acm_certificate_arn : aws_acm_certificate.frontend[0].arn
}
