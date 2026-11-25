# Migrating `dev.drkabongo.com` & `drkabongo.com` from Vercel to AWS (S3 + CloudFront)

This repository uses the exact same AWS architecture as **DarAkili** (`Salela_Bongo/DarAkili`):
- **Next.js static export (`out/`)** served from a private **S3 bucket** via **CloudFront + Origin Access Control (OAC)**.
- **CloudFront Function (`frontend-router`)** at the edge handling:
  - `www.drkabongo.com` → `308` redirect to `https://drkabongo.com`
  - `next-intl` `as-needed` locale routing (`/` → `/en.html`, `/speaking` → `/en/speaking.html`, `/fr/speaking` → `/fr/speaking.html`, `/en/...` → `308` canonical redirect)
  - Next.js App Router RSC payload routing (`*.txt`, `/__next.*`)
- **CloudFront Response Headers Policy** enforcing HSTS, `X-Content-Type-Options`, `Referrer-Policy`, and automatic `X-Robots-Tag: noindex, nofollow, noarchive` on `dev`.
- **Optional `/api/subscribe` Lambda Function URL** (Node.js 20, zero dependencies) behind CloudFront for Kit.com newsletter sign-ups.
- **Terraform state** stored in the existing S3 bucket `salela-bongo-tf-states` under `drkabongo/{dev,prod}_drkabongo_web.tfstate`.
- **Draft talk gating:** Talks with `draft: true` in `content/talks.ts` (such as `learning-in-the-llm-era`) stay visible locally (`npm run dev`), and are excluded from `dev` and `prod` builds until you flip `draft: false` (or trigger `workflow_dispatch` with `show_draft_talks: true` on `dev`).

---

## Step 1: Authenticate AWS CLI Locally

```bash
aws login
aws sts get-caller-identity
```

Confirm you are in AWS account `519025701026` (`us-east-1`).

---

## Step 2: Bootstrap `dev.drkabongo.com` (S3 + CloudFront + ACM Cert)

```bash
cd infrastructure
terraform init -backend-config="backends/dev.s3.tfbackend" -reconfigure
terraform apply -var-file="vars/dev.tfvars"
```

1. Copy the CNAME record printed in `acm_dns_validation_records` and add it to your DNS provider for `drkabongo.com`.
2. Wait 1–5 minutes until the ACM certificate status in `us-east-1` is **Issued**.
3. Deploy the first static build to `dev` and verify it on the raw `https://<cloudfront-domain>` URL:

```bash
cd ..
./scripts/deploy_frontend.sh dev
```

4. In [infrastructure/vars/dev.tfvars](infrastructure/vars/dev.tfvars), flip:
   ```hcl
   enable_custom_domain = true
   ```
   and re-run:
   ```bash
   cd infrastructure
   terraform apply -var-file="vars/dev.tfvars"
   ```
5. **Cut over `dev.drkabongo.com` DNS:**
   - In your DNS provider, update `dev.drkabongo.com` to a **CNAME** pointing to `frontend_cloudfront_domain_name` (from `terraform output -raw frontend_cloudfront_domain_name`).
   - Verify `https://dev.drkabongo.com`, `https://dev.drkabongo.com/fr/speaking`, and check that `X-Robots-Tag: noindex, nofollow, noarchive` is present in response headers.

---

## Step 3: Bootstrap `drkabongo.com` (Production)

```bash
cd infrastructure
terraform init -backend-config="backends/prod.s3.tfbackend" -reconfigure
terraform apply -var-file="vars/prod.tfvars"
```

1. Add the ACM DNS validation CNAME record(s) printed in `acm_dns_validation_records` for `drkabongo.com` and `www.drkabongo.com`.
2. Wait until the ACM certificate status in `us-east-1` is **Issued**.
3. Deploy the static build to `prod` and smoke-test on `https://<prod-cloudfront-domain>`:

```bash
cd ..
./scripts/deploy_frontend.sh prod
```

4. In [infrastructure/vars/prod.tfvars](infrastructure/vars/prod.tfvars), flip:
   ```hcl
   enable_custom_domain = true
   ```
   and re-run:
   ```bash
   cd infrastructure
   terraform apply -var-file="vars/prod.tfvars"
   ```
5. **Cut over `drkabongo.com` & `www.drkabongo.com` DNS:**
   - Point apex `drkabongo.com` (**ALIAS / ANAME / Route 53 A-Alias**) to `frontend_cloudfront_domain_name`.
   - Point `www.drkabongo.com` (**CNAME**) to `frontend_cloudfront_domain_name`.
   - Verify `https://drkabongo.com`, `https://www.drkabongo.com` (308 → apex), `https://drkabongo.com/speaking`, `https://drkabongo.com/fr/courses`, `https://drkabongo.com/feed.xml`, and `https://drkabongo.com/sitemap.xml`.

---

## Step 4: Enable GitHub Actions Auto-Deploy & Decommission Vercel

1. Ensure the IAM OIDC trust policy on `arn:aws:iam::519025701026:role/github-deployer` allows this repository (`repo:<owner>/<repo>:ref:refs/heads/dev` and `repo:<owner>/<repo>:ref:refs/heads/main`).
2. *(Optional — Newsletter)* If you use Kit.com email sign-ups, set `enable_subscribe_api = true` in `vars/{dev,prod}.tfvars` and add `KIT_API_KEY` + `KIT_FORM_ID` to GitHub repository secrets.
3. Once both `dev.drkabongo.com` and `drkabongo.com` resolve to CloudFront:
   - Remove the custom domains from the Vercel project (or delete the Vercel project completely).
   - If Vercel also hosts your DNS zone, you can either keep DNS records there pointing to CloudFront (just like DarAkili) or transfer DNS to Route 53 / your registrar.
