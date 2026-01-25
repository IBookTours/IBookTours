# ITravel Setup Guide

This guide walks you through setting up ITravel for production deployment. **No coding required** - just follow the steps and copy/paste values.

## Table of Contents

1. [Accounts Overview](#accounts-overview)
2. [Step 1: Vercel Setup](#step-1-vercel-setup)
3. [Step 2: Generate Secret Key](#step-2-generate-secret-key)
4. [Step 3: Configure Environment Variables](#step-3-configure-environment-variables)
5. [Step 4: Deploy](#step-4-deploy)
6. [Optional Services](#optional-services)
7. [Cost Summary](#cost-summary)
8. [Troubleshooting](#troubleshooting)

---

## Accounts Overview

| Service | Required? | Purpose | Cost |
|---------|-----------|---------|------|
| GitHub | Yes | Code repository | Free |
| Vercel | Yes | Hosting & deployment | Free (Hobby plan) |
| Sanity | No | Content management | Free (100K requests/month) |
| Google Cloud | No | Google login | Free |
| Stripe | No | Payment processing | Free (test mode) |
| Brevo | No | Email sending | Free (300 emails/day) |

**Total Cost: $0/month**

---

## Step 1: Vercel Setup

### If you already have Vercel connected:

Your project is already deployed at: **https://it-ravel.vercel.app**

Skip to [Step 3](#step-3-configure-environment-variables).

### If starting fresh:

1. Go to [vercel.com](https://vercel.com) and sign up with GitHub
2. Click **"Add New Project"**
3. Import your ITravel repository from GitHub
4. Vercel will auto-detect it's a Next.js project
5. **Don't deploy yet** - first configure environment variables (Step 3)

---

## Step 2: Generate Secret Key

You need a secure secret key for authentication. Choose one method:

### Option A: Using Node.js (if installed)

Open terminal/command prompt and run:

```
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

Copy the 64-character output.

### Option B: Online Generator

1. Go to [generate-secret.vercel.app](https://generate-secret.vercel.app/)
2. Click generate
3. Copy the result

### Option C: Use this pre-generated one (change it later)

```
a1b2c3d4e5f6789012345678901234567890abcdef1234567890abcdef123456
```

**Important:** Save this key somewhere safe - you'll need it in the next step.

---

## Step 3: Configure Environment Variables

### In Vercel Dashboard:

1. Go to your project in [Vercel Dashboard](https://vercel.com/dashboard)
2. Click **Settings** (top navigation)
3. Click **Environment Variables** (left sidebar)
4. Add these variables one by one:

### Required Variables

| Name | Value | Environments |
|------|-------|--------------|
| `NEXTAUTH_SECRET` | (your 64-character secret from Step 2) | Production, Preview, Development |
| `NEXTAUTH_URL` | `https://it-ravel.vercel.app` | Production |
| `NEXTAUTH_URL` | `https://it-ravel-git-*.vercel.app` | Preview |
| `NEXT_PUBLIC_SITE_URL` | `https://it-ravel.vercel.app` | Production, Preview, Development |

### Demo Mode (Optional but Recommended)

To enable demo login accounts for testing:

| Name | Value | Environments |
|------|-------|--------------|
| `DEMO_MODE` | `true` | Production, Preview, Development |

This enables these test accounts:
- **User:** demo@itravel.com / demo123
- **Admin:** admin@itravel.com / admin123

Set to `false` to disable demo accounts.

---

## Step 4: Deploy

### Using Vercel Dashboard:

1. Go to your project
2. Click **Deployments** tab
3. Click the three dots (...) on the latest deployment
4. Click **Redeploy**

### Using Vercel CLI:

If you have Vercel CLI installed:

```bash
vercel --prod
```

### Verify Deployment:

1. Visit your site: https://it-ravel.vercel.app
2. Test the demo login (if DEMO_MODE=true):
   - Click Login
   - Use: demo@itravel.com / demo123
3. Check that all pages load correctly

---

## Optional Services

These services enhance the site but are **not required**. The app works fully without them.

### Sanity CMS (Content Management)

Without Sanity, the site uses built-in mock data. To enable Sanity:

1. Go to [sanity.io/manage](https://www.sanity.io/manage)
2. Create account (free)
3. Create new project
4. Copy the **Project ID**
5. Go to API > Tokens > Add API Token
6. Create a token with **Viewer** permissions
7. Add to Vercel:

| Name | Value |
|------|-------|
| `NEXT_PUBLIC_SANITY_PROJECT_ID` | (your project ID) |
| `NEXT_PUBLIC_SANITY_DATASET` | `production` |
| `NEXT_PUBLIC_SANITY_API_VERSION` | `2024-01-01` |
| `SANITY_API_READ_TOKEN` | (your API token) |

### Google OAuth (Google Login)

Without Google OAuth, only demo login works. To enable:

1. Go to [console.cloud.google.com](https://console.cloud.google.com)
2. Create new project
3. Go to **APIs & Services** > **Credentials**
4. Click **Create Credentials** > **OAuth 2.0 Client ID**
5. Application type: **Web application**
6. Add Authorized redirect URI:
   ```
   https://it-ravel.vercel.app/api/auth/callback/google
   ```
7. Copy Client ID and Client Secret
8. Add to Vercel:

| Name | Value |
|------|-------|
| `GOOGLE_CLIENT_ID` | (your client ID) |
| `GOOGLE_CLIENT_SECRET` | (your client secret) |

### Stripe (Payments)

Without Stripe, payments run in demo mode (no real charges). To enable:

1. Go to [dashboard.stripe.com](https://dashboard.stripe.com)
2. Create account
3. Go to **Developers** > **API Keys**
4. Copy the test keys (start with `pk_test_` and `sk_test_`)
5. For webhooks: **Developers** > **Webhooks** > Add endpoint
   - URL: `https://it-ravel.vercel.app/api/webhooks/stripe`
   - Events: `checkout.session.completed`, `payment_intent.succeeded`
6. Add to Vercel:

| Name | Value |
|------|-------|
| `STRIPE_SECRET_KEY` | sk_test_... |
| `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` | pk_test_... |
| `STRIPE_WEBHOOK_SECRET` | whsec_... |

### Brevo (Email)

Without Brevo, emails are logged to console only. To enable:

1. Go to [brevo.com](https://www.brevo.com)
2. Create account (free - 300 emails/day)
3. Go to **SMTP & API** > **API Keys**
4. Create new API key
5. Add to Vercel:

| Name | Value |
|------|-------|
| `BREVO_API_KEY` | (your API key) |
| `BREVO_SENDER_EMAIL` | noreply@yourdomain.com |
| `BREVO_SENDER_NAME` | ITravel |

---

## Cost Summary

| Service | What You Get Free | Paid Upgrade Needed? |
|---------|-------------------|---------------------|
| **Vercel** | 100GB bandwidth, unlimited deployments | Only if >100K visitors/month |
| **Sanity** | 100K API requests/month, 10GB assets | Only if lots of content updates |
| **Brevo** | 300 emails/day | Only if >9,000 emails/month |
| **Stripe** | Test mode unlimited | Only for real payments (2.9% + 30c fee) |
| **Google OAuth** | Unlimited | Never |

**For a typical travel agency website, you will never exceed these free tiers.**

---

## Troubleshooting

### "NEXTAUTH_SECRET is not set" error

1. Go to Vercel Dashboard > Settings > Environment Variables
2. Verify `NEXTAUTH_SECRET` is set for all environments
3. Redeploy the project

### Login not working

1. Check `DEMO_MODE` is set to `true` in Vercel environment variables
2. For Google login, verify the redirect URI matches exactly:
   `https://it-ravel.vercel.app/api/auth/callback/google`

### Pages showing "Loading..." forever

1. Check browser console (F12) for errors
2. Verify environment variables are set correctly
3. Try clearing browser cache and refreshing

### Build failed on Vercel

1. Check the build logs in Vercel Dashboard > Deployments
2. Most common issue: missing environment variables
3. Ensure all required variables from Step 3 are set

### Site works locally but not on Vercel

1. Environment variables are different between local and Vercel
2. Make sure Vercel has all the same variables as your `.env.local`
3. `NEXTAUTH_URL` must match your actual Vercel URL

---

## Quick Reference

### Your URLs

| URL | Purpose |
|-----|---------|
| https://it-ravel.vercel.app | Live site |
| https://it-ravel.vercel.app/studio | Sanity CMS (if configured) |
| https://it-ravel.vercel.app/api/auth/signin | Login page |

### Demo Accounts

| Role | Email | Password |
|------|-------|----------|
| User | demo@itravel.com | demo123 |
| Admin | admin@itravel.com | admin123 |

### Minimum Required Variables

```
NEXTAUTH_SECRET=<64-character-hex-string>
NEXTAUTH_URL=https://it-ravel.vercel.app
NEXT_PUBLIC_SITE_URL=https://it-ravel.vercel.app
DEMO_MODE=true
```

---

**Need help?** Check the [README.md](./README.md) for technical details or open an issue on GitHub.
