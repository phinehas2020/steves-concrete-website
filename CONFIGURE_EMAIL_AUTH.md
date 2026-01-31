# Configure Email Auth for Supabase

The "Unable to send login link" error means your custom Supabase instance doesn't have email sending configured.

## Option 1: Configure SMTP in Supabase Dashboard

1. Go to your Supabase dashboard: `https://db.phinehasadams.com` (or your dashboard URL)
2. Navigate to **Settings** → **Auth** → **SMTP Settings**
3. Configure your SMTP provider:
   - **SMTP Host**: Your SMTP server (e.g., `smtp.gmail.com`, `smtp.sendgrid.net`)
   - **SMTP Port**: Usually `587` (TLS) or `465` (SSL)
   - **SMTP User**: Your SMTP username/email
   - **SMTP Password**: Your SMTP password/API key
   - **Sender Email**: Email address to send from
   - **Sender Name**: Display name (e.g., "Concrete Works")

### Popular SMTP Providers:
- **SendGrid**: Free tier available
- **Mailgun**: Free tier available  
- **AWS SES**: Very cheap
- **Gmail**: Can use App Password (less reliable)
- **Resend**: Modern, developer-friendly (you're already using this for leads!)

## Option 2: Use Resend (Recommended)

Since you're already using Resend for lead emails, use it for Auth too:

1. Get your Resend API key (you should already have this)
2. In Supabase Dashboard → Settings → Auth → SMTP:
   - **SMTP Host**: `smtp.resend.com`
   - **SMTP Port**: `587`
   - **SMTP User**: `resend`
   - **SMTP Password**: Your Resend API key
   - **Sender Email**: Your verified domain email (e.g., `noreply@yourdomain.com`)
   - **Sender Name**: `Concrete Works`

## Option 3: Temporary Workaround - Check Email Logs

If you're running Supabase locally or have email logs enabled:
- Check Supabase logs for the magic link
- Some setups log emails to console/files instead of sending

## After Configuration

1. Test the login again
2. Check your email inbox (and spam folder)
3. The magic link should work now

## Verify Auth Settings

Also check:
- **Settings** → **Auth** → **Providers** → Make sure "Email" is enabled
- **Settings** → **Auth** → **URL Configuration** → Add your site URL to allowed redirect URLs
