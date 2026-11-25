terraform {
  required_version = ">= 1.8.0"

  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 5.83"
    }
    random = {
      source  = "hashicorp/random"
      version = "~> 3.6"
    }
    archive = {
      source  = "hashicorp/archive"
      version = "~> 2.7"
    }
  }

  backend "s3" {}
}

provider "aws" {
  region = var.region
}

data "aws_caller_identity" "current" {}

locals {
  account_id  = data.aws_caller_identity.current.account_id
  name_prefix = "${var.environment}-${var.project_name}"

  frontend_domain_name = var.environment == "prod" ? var.domain_name : "${var.environment}.${var.domain_name}"
  frontend_aliases     = var.environment == "prod" ? [var.domain_name, "www.${var.domain_name}"] : [local.frontend_domain_name]

  common_tags = {
    Environment     = var.environment
    Project         = var.project_name
    ManagedBy       = "terraform"
    Owner           = "salomon-kabongo"
    "DrKabongo.com" = ""
  }
}
