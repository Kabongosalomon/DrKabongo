variable "environment" {
  description = "Deployment environment (dev or prod)"
  type        = string

  validation {
    condition     = contains(["dev", "prod"], var.environment)
    error_message = "environment must be either 'dev' or 'prod'."
  }
}

variable "project_name" {
  description = "Project identifier used for AWS resource naming"
  type        = string
  default     = "drkabongo"
}

variable "region" {
  description = "AWS region (must be us-east-1 for CloudFront ACM certificates)"
  type        = string
  default     = "us-east-1"
}

variable "domain_name" {
  description = "Apex domain name"
  type        = string
  default     = "drkabongo.com"
}

variable "acm_certificate_arn" {
  description = "Optional pre-provisioned & ISSUED ACM certificate ARN in us-east-1 covering the environment's domain(s). If empty, Terraform creates a DNS-validated ACM certificate."
  type        = string
  default     = ""
}

variable "enable_custom_domain" {
  description = "Attach custom domain aliases and ACM certificate to CloudFront. Keep false during initial bootstrap until ACM DNS validation is ISSUED, or set true once acm_certificate_arn is issued."
  type        = bool
  default     = false
}

variable "cloudfront_price_class" {
  description = "CloudFront price class"
  type        = string
  default     = "PriceClass_100"
}

variable "s3_noncurrent_version_retention_days" {
  description = "Days to retain noncurrent S3 object versions in the frontend bucket"
  type        = number
  default     = 30
}

variable "enable_subscribe_api" {
  description = "Deploy the lightweight Lambda Function URL behind /api/subscribe for Kit.com newsletter sign-ups"
  type        = bool
  default     = false
}

variable "kit_api_key" {
  description = "Kit.com v4 API key (passed via TF_VAR_kit_api_key when enable_subscribe_api = true)"
  type        = string
  default     = ""
  sensitive   = true
}

variable "kit_form_id" {
  description = "Kit.com double opt-in form ID (passed via TF_VAR_kit_form_id when enable_subscribe_api = true)"
  type        = string
  default     = ""
}
