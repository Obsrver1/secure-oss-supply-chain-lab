# Security Policy

This repository is a cybersecurity lab and may contain intentionally insecure examples used for testing security controls.

## Secrets

Do not commit:

- AWS credentials
- API keys
- private keys
- access tokens
- .env files
- Terraform variable files containing secrets

Use synthetic or non-sensitive data for demonstrations whenever possible.

## Reporting

If a real credential or other sensitive value is accidentally committed, treat it as compromised and rotate it immediately.
