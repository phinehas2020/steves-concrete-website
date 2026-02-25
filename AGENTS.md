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
|---------|---------|-------|
| Vite dev server (frontend) | `npm run dev` | Serves the React SPA on port 5173. Does **not** proxy `/api/*` routes. |
| Full-stack local dev | `npx vercel dev` | Runs Vite + Vercel serverless functions together (needed to test contact form, blog API, sitemap, etc.). Requires Vercel CLI auth. |

### Lint / Build / Test

- **Lint:** `npm run lint` — ESLint 9 flat config. Pre-existing lint errors exist (unused vars, `no-undef` for `process` in serverless `api/` files because ESLint is configured for browser globals only). These are not regressions.
- **Build:** `npm run build` — Vite build + pre-render script. Produces `dist/`.
- **Test:** No automated test suite exists in this repo.

### Caveats

- The `.env` file ships with `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` already set, pointing to the remote Supabase instance at `https://db.phinehasadams.com`. Public data (blog posts, jobs, gallery) loads from Supabase on the client side.
- The `/api/*` serverless functions (lead capture, blog CMS, sitemap) only work under `vercel dev` or in production. Running plain `npm run dev` will cause form submissions to fail with a network error — this is expected.
- Admin dashboard (`/admin`) uses Supabase magic-link auth. Testing admin flows locally requires a valid Supabase Auth configuration and a working email inbox for the magic link.


## Cursor Cloud specific instructions

### Overview
This is a React 19 + Vite 7 + Tailwind CSS 4 website for a concrete contractor. The backend is hosted Supabase (database, auth, storage) and Vercel serverless functions (API routes under `api/`). There are no automated tests in this repo.

### Running the app
- **Frontend only:** `npm run dev` starts Vite on port 5173. This serves the React SPA but API routes (`/api/*`) will not work.
- **Full-stack locally:** Use `npx vercel dev` to run both Vite and serverless functions together. Requires Vercel CLI login and project link (`.vercel/` directory).
- The `.env` file already has `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` configured for the remote Supabase instance. The frontend reads data (blog posts, jobs, gallery) directly from Supabase, so most public pages work with just `npm run dev`.

### Lint / Build
- `npm run lint` — runs ESLint. There are ~52 pre-existing lint errors (unused imports, `no-undef` for `process`/`Buffer` in `api/` serverless files, React hooks warnings). These are known and not regressions.
- `npm run build` — Vite build followed by `node scripts/prerender-routes.mjs` for static pre-rendering.

### Key caveats
- The ESLint config only sets `globals.browser`, so `api/` files (Node.js serverless) report `process` and `Buffer` as undefined. This is a known config gap, not a real error.
- Contact form submission requires the `/api/lead` Vercel serverless route. It will fail when running with `npm run dev` alone (Vite-only mode). Use `npx vercel dev` for full-stack testing.
- Admin dashboard login (`/admin`) uses Supabase magic-link auth. Testing admin flows requires access to the `phinehasmadams@icloud.com` email inbox.
