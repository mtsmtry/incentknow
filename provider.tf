provider "aws" {
  region = "ap-northeast-1"
}

terraform {
  required_providers {
    aws = {
      version = "~> 3.20.0"
    }
  }
}

// AWS_ACCESS_KEY_ID=AKIAS4VFXI3L74LJCXOZ AWS_SECRET_ACCESS_KEY=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 terraform init