environment  = "dev"
project_name = "drkabongo"
region       = "us-east-1"
domain_name  = "drkabongo.com"

# Step 1 (Bootstrap): Leave `enable_custom_domain = false` for the first apply so
# Terraform creates the ACM certificate and prints the DNS validation CNAME.
# Step 2 (Cutover): Once the ACM certificate is ISSUED in us-east-1, flip
# `enable_custom_domain = true` (or set `acm_certificate_arn = "arn:..."`) and apply.
enable_custom_domain = false
acm_certificate_arn  = ""

# Optional: Flip to true and supply TF_VAR_kit_api_key + TF_VAR_kit_form_id to
# enable the /api/subscribe newsletter Lambda behind CloudFront.
enable_subscribe_api = false
