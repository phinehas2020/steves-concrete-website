# Project Status – Concrete Works LLC Website

Last updated: 2026-01-28

## What’s done

### Lead capture + email notifications
- Contact form now posts to `/api/lead` (Vercel serverless).
- Leads are saved in Supabase `leads` table.
- Email notifications are wired (via Resend) but **sender is not set yet**.

### Admin dashboard
- `/admin` route added (protected).
- Magic-link login using Supabase Auth.
- Admin tabs:
  - **Stats** (lead counts, blog counts)
  - **Leads** (view + update status)
  - **Blog** (create/edit Markdown posts)
  - **Admins** (super admins can add admins)

### Blog
- Public blog index at `/blog`
- Single post at `/blog/:slug`
- Markdown rendering with styled `.blog-content` class

### Infrastructure
- Supabase project linked: `dpxbwtmicllheaxvecnu`
- Vercel project linked: `steves-concrete-website`
- Supabase schema + RLS applied
- Super admin seeded: `phinehasmadams@icloud.com`
- Production deploy completed (latest)


## What still needs to be done

### Email sending (Resend)
We do NOT have a verified sender domain yet.  
To enable email notifications:
1) Verify a domain in Resend (add DNS records).
2) Choose a sender email, e.g. `Concrete Works <no-reply@yourdomain.com>`.
3) Set Vercel env vars:
   - `RESEND_API_KEY`
   - `LEADS_EMAIL_FROM`

Current Vercel envs already set:
- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_ANON_KEY`
- `SUPABASE_URL`
- `SUPABASE_SERVICE_ROLE_KEY`
- `LEADS_EMAIL_TO` = `phinehasmadams@icloud.com`
- `LEADS_SITE_NAME` = `Concrete Works LLC`


## How to log in to the admin dashboard
1) Go to: `https://<your-domain>/admin`
2) Enter: `phinehasmadams@icloud.com`
3) Check your inbox and click the magic link.

If login fails:
- Ensure Supabase Auth “Email” provider is enabled.
- Add redirect URL in Supabase Auth settings:  
  `https://<your-domain>/admin`


## Notes / local changes
- Supabase CLI created `supabase/config.toml` and a migration in `supabase/migrations/`.
- Vercel CLI added `.vercel/` (ignored by git).
- There are unrelated local changes in `index.html`, `FAQ.jsx`, `Gallery.jsx`, `Hero.jsx`, `Testimonials.jsx`, `public/og-image.jpg` that weren’t committed.
