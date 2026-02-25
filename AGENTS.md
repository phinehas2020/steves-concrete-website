# Project Status – Concrete Works LLC Website

Last updated: 2026-01-28

## What's done

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
- Ensure Supabase Auth "Email" provider is enabled.
- Add redirect URL in Supabase Auth settings:  
  `https://<your-domain>/admin`


## Branches

### `design-refresh` 
Exploration branch with authentic local feel:
- **Values** → "Our Story + Process" section with Steve's narrative, black clay soil context, 4-phase process breakdown, subtle Waco skyline
- **Gallery** → Real project specs (sqft, mix PSI, completion date), specific locations, brief stories per project
- **Services** → Descriptions mention Central Texas soil/heat challenges, specific neighborhoods
- **Contact** → "What happens next" timeline (4hr response → call → site visit → estimate), emergency repair note
- **Hero** → Reduced animation, heavier/slower motion, mentions "McLennan County" and "black clay soil"
- **Testimonials** → Added project types, stats row at bottom, cleaner cards without bounce
- **FAQ** → Honest answers about cracking (soil movement), realistic warranty language
- **Footer** → "Built on black clay soil" tagline, hours section, local texture element

Compare with `main` to see which direction you prefer.


## Notes / local changes
- Supabase CLI created `supabase/config.toml` and a migration in `supabase/migrations/`.
- Vercel CLI added `.vercel/` (ignored by git).
- There are unrelated local changes in `index.html`, `FAQ.jsx`, `Gallery.jsx`, `Hero.jsx`, `Testimonials.jsx`, `public/og-image.jpg` that weren't committed.


## Cursor Cloud specific instructions

### Services overview

| Service | Command | Notes |
|---|---|---|
| Vite dev server | `npm run dev` | Serves React SPA with HMR on port 5173. This is the main dev entry point. |
| Lint | `npm run lint` | ESLint 9 with flat config. Pre-existing lint errors exist in codebase (unused vars, `process` in API files). |
| Build | `npx vite build` | Use `npx vite build` (Vite only) for quick build checks. `npm run build` also runs prerender script which requires network access to Supabase. |
| Preview | `npm run preview` | Serves production build locally. |

### Key caveats

- **API routes (`/api/*`) are Vercel serverless functions** and do NOT run under `vite dev`. The contact form submission will fail locally — this is expected. To test API routes locally, use `npx vercel dev` (requires Vercel CLI login and linked project).
- **Supabase is a remote service** at `https://db.phinehasadams.com`. The `.env` file has `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` pre-configured. The `SUPABASE_SERVICE_ROLE_KEY` is empty; it is only needed for server-side API routes.
- **`npm run build`** runs `vite build && node scripts/prerender-routes.mjs`. The prerender script fetches data from Supabase to generate static HTML for SEO pages. If you only need to verify the build compiles, use `npx vite build` instead.
- **No automated test suite exists** in this project. Testing is done via lint and manual browser verification.
