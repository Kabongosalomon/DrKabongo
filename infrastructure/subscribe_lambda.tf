# =============================================================================
# Optional Newsletter Subscribe Lambda (`POST /api/subscribe`)
# =============================================================================
# Replaces Next.js `app/api/subscribe/route.ts` with a zero-dependency Node.js 20
# Lambda Function URL routed behind CloudFront `/api/subscribe` so `KIT_API_KEY`
# stays server-side without Vercel.

data "archive_file" "subscribe_lambda" {
  count       = var.enable_subscribe_api ? 1 : 0
  type        = "zip"
  source_dir  = "${path.module}/lambda/subscribe"
  output_path = "${path.module}/.build/subscribe-lambda.zip"
}

resource "aws_iam_role" "subscribe_lambda" {
  count = var.enable_subscribe_api ? 1 : 0
  name  = "${local.name_prefix}-subscribe-lambda-role"

  assume_role_policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Action = "sts:AssumeRole"
        Effect = "Allow"
        Principal = {
          Service = "lambda.amazonaws.com"
        }
      }
    ]
  })

  tags = local.common_tags
}

resource "aws_iam_role_policy_attachment" "subscribe_lambda_logs" {
  count      = var.enable_subscribe_api ? 1 : 0
  role       = aws_iam_role.subscribe_lambda[0].name
  policy_arn = "arn:aws:iam::aws:policy/service-role/AWSLambdaBasicExecutionRole"
}

resource "aws_lambda_function" "subscribe" {
  count            = var.enable_subscribe_api ? 1 : 0
  function_name    = "${local.name_prefix}-subscribe"
  role             = aws_iam_role.subscribe_lambda[0].arn
  handler          = "index.handler"
  runtime          = "nodejs20.x"
  filename         = data.archive_file.subscribe_lambda[0].output_path
  source_code_hash = data.archive_file.subscribe_lambda[0].output_base64sha256
  timeout          = 10
  memory_size      = 128

  environment {
    variables = {
      KIT_API_KEY = var.kit_api_key
      KIT_FORM_ID = var.kit_form_id
    }
  }

  tags = local.common_tags
}

resource "aws_lambda_function_url" "subscribe" {
  count              = var.enable_subscribe_api ? 1 : 0
  function_name      = aws_lambda_function.subscribe[0].function_name
  authorization_type = "NONE"
}

locals {
  subscribe_lambda_domain = var.enable_subscribe_api ? replace(replace(aws_lambda_function_url.subscribe[0].function_url, "https://", ""), "/", "") : ""
}
