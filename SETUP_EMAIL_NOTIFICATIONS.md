# Setup Email Notifications for Quote Requests

The website is already configured to send emails when someone requests a quote. You just need to set up your Resend API key.

## Step 1: Get Your Resend API Key

1. Go to https://resend.com
2. Sign in or create an account
3. Go to **API Keys** in the dashboard
4. Create a new API key (or use an existing one)
5. Copy the API key

## Step 2: Set Up Vercel Environment Variables

Add these to Vercel:

```bash
# Required
RESEND_API_KEY=re_xxxxxxxxxxxxx  # Your Resend API key

# Optional (if you have a verified domain)
LEADS_EMAIL_FROM=Concrete Works <noreply@yourdomain.com>

# Already set (should be Steve's email)
LEADS_EMAIL_TO=phinehasmadams@icloud.com
LEADS_SITE_NAME=Concrete Works LLC
```

### Via Vercel CLI:

```bash
cd "/Users/phinehasadams/Steves website"

# Add Resend API key
echo "re_YOUR_API_KEY_HERE" | vercel env add RESEND_API_KEY production

# Optional: Add sender email (if you have a verified domain)
echo "Concrete Works <noreply@yourdomain.com>" | vercel env add LEADS_EMAIL_FROM production
```

### Via Vercel Dashboard:

1. Go to Vercel Dashboard → Your Project → Settings → Environment Variables
2. Add:
   - `RESEND_API_KEY` = Your Resend API key
   - `LEADS_EMAIL_FROM` = Your verified sender email (optional - will use Resend default if not set)

## Step 3: Verify Domain (Optional but Recommended)

For better deliverability:

1. In Resend dashboard, go to **Domains**
2. Add your domain (e.g., `yourdomain.com`)
3. Add the DNS records Resend provides to your domain
4. Wait for verification
5. Set `LEADS_EMAIL_FROM` to use your verified domain

## Step 4: Test

1. Submit a test quote request on your website
2. Check Steve's email (`phinehasmadams@icloud.com`)
3. You should receive an email with the lead details

## Current Setup

- ✅ Email sending code is implemented
- ✅ Leads are saved to Supabase
- ✅ Email template is ready (HTML + text)
- ⚠️ Need to add `RESEND_API_KEY` to Vercel
- ⚠️ Optional: Add `LEADS_EMAIL_FROM` if you have a verified domain

Once you add the `RESEND_API_KEY`, emails will start sending automatically!
