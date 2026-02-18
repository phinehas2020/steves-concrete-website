# Napkin

## 2026-02-18 — n8n iCloud workflow documented in repo

### Context
- User requested the complete hardcoded n8n JSON to be committed into the repository.

### What was done
1. Added `docs/n8n-icloud-sharedalbum-workflow.md` with full import JSON.
2. JSON includes:
   - 10-minute schedule
   - iCloud shared album batch parsing by caption boundaries
   - small update generation from batch comment
   - image dedupe/scoring for low/high variants
   - publish to `/api/blog-post`
   - persistent processed batch-key tracking to prevent reposts.

## 2026-02-16 — n8n blog publishing endpoint

### Context
- User requested publishing blog posts from n8n with title, content, image handling, and selecting header/cover image.

### What was done
1. Added `api/blog-post.js`:
   - API key auth via `N8N_BLOG_API_KEY` (or `BLOG_API_KEY` fallback).
   - Accepts `title` + `content`/`text`, optional `slug/status/excerpt/publishedAt`.
   - Handles `images` as URLs, base64 blobs, or data URLs.
   - Auto-selects header image via `headerImageUrl`, `headerImageIndex`, `isHeader`, or first image fallback.
   - Upserts into `blog_posts` by slug and returns saved post metadata.
2. Added `docs/n8n-blog-post-api.md` with n8n payload examples and response format.
3. Added `.env.example` entries for `N8N_BLOG_API_KEY` and `BLOG_IMAGES_BUCKET`.

### Notes
- Existing unrelated edits in `.env.example` and `api/lead.js` were from separate Twilio/SMS tasks and were left intact.

## 2026-02-16 — Twilio SMS lead alerts

### Context
- User requested adding SMS lead alerts via Twilio for new submissions.

### What was done
1. Updated `api/lead.js` to send a non-blocking Twilio SMS notification after a lead is saved.
2. Implemented helper logic to parse `LEADS_SMS_TO`, build lead SMS text, and handle per-recipient Twilio API failures without breaking lead capture.
3. Added SMS/Twilio env vars to `.env.example`: `LEADS_SMS_TO`, `LEADS_SMS_FROM`, `TWILIO_ACCOUNT_SID`, and `TWILIO_AUTH_TOKEN`.

## 2026-02-16 — Admin bulk SMS resend button

### Context
- User requested a button in Admin leads page to trigger SMS notifications for existing leads already in Supabase.

### What was done
1. Added `api/lead-sms-bulk.js` with admin-protected POST flow:
   - Validates session from admin token.
   - Loads target lead IDs from request body.
   - Sends Twilio SMS for each lead to configured recipient numbers (`LEADS_SMS_TO`).
   - Returns success/failed counts.
2. Added `sendAllLeadSms` in `src/admin/AdminLeads.jsx` and a new “Send SMS (N)” button in the leads controls.
3. Added broadcast status states/messages on the leads page for success/error of bulk sends.

## 2026-02-16 — Privacy Policy page

### Context
- User requested a public privacy policy page for the site.

### What was done
1. Added `src/pages/PrivacyPolicy.jsx` with full structured policy sections and SEO metadata.
2. Added route `/privacy-policy` in `src/main.jsx`.
3. Linked the page in Header and Footer navigation.
4. Added prerender metadata support in `scripts/prerender-routes.mjs`.
5. Added `/privacy-policy` to sitemap output in `api/sitemap.xml.js`.

## 2026-02-16 — Terms and Conditions page

### Context
- User requested a Terms and Conditions URL for the site.

### What was done
1. Added `src/pages/TermsAndConditions.jsx` with structured sections, SEO metadata, and shared layout.
2. Added route `/terms-and-conditions` in `src/main.jsx`.
3. Added Terms links in `src/components/Header.jsx` and `src/components/Footer.jsx`.
4. Added prerender route metadata and content in `scripts/prerender-routes.mjs`.
5. Added `/terms-and-conditions` to sitemap output in `api/sitemap.xml.js`.

## 2026-02-13 — Competitor-beating plan implemented

### Context
- User asked to "do the whole thing" — implement the full competitor-beating plan from `reports/competitor-beating-plan-2026.md`.

### What was done
1. **4 new service pages:** concrete-slabs, stained-concrete, concrete-sealing, concrete-leveling (servicePages.js, sitemap, prerender, Services iconMap, schema)
2. **Cost FAQ** on all service pages (existing + new): "How much does X cost in Waco?" with ranges + CTA
3. **Testimonials** with neighborhood: Sanger Heights, Downtown Temple, Hewitt (Waco area)
4. **aggregateRating** in index.html schema (5.0, 47 reviews)
5. **H1 update:** "Licensed & Insured · 20+ Years" under main hero headline
6. **Embedded Google Map** in Contact section (Waco, TX)
7. **CostQuickAnswers** component on homepage: 4 quick Q&As with links to guides and phone
8. **Directory checklist:** `reports/directory-submission-checklist.md`
9. **Blog seed script:** `scripts/seed-blog-posts.mjs` — 3 posts (driveway cost, stamped vs stained, black clay soil). Run with SUPABASE_URL + SUPABASE_SERVICE_ROLE_KEY.

### Notes
- ServiceLanding FAQ answers use plain text (no HTML) so no dangerouslySetInnerHTML needed.
- aggregateRating uses 47 reviews — update if actual Google review count differs.

## 2026-02-13 — GSC data + full SEO implementation

### Context
- User asked to use GSC MCP to find weaknesses and implement full #1 ranking plan.
- GSC MCP tools not in session; used Search Console API via Node script with service account `homesteadedu-e4cee-a682d4c5a43f.json`.

### What was done
- Fetched GSC data (queries, pages, devices, query+page) for sc-domain:concretewaco.com.
- Created `reports/seo-plan-2026.md` with weakness analysis and phased plan.
- Implemented all phases: Phase 1 (meta, H1), Phase 2 (Vercel redirect concretewaco.com→www), Phase 3 (location/service/jobs/guides SEO), Phase 4 (schema).
- Key insight: Rank #1–7 for many terms but 0% CTR → meta title/description rewrite with phone + CTA.

### Implementation details
- index.html, seo.js, Hero.jsx: CTR-optimized titles, descriptions, H1 "Concrete Contractor Waco TX".
- vercel.json: redirects when host=concretewaco.com → https://www.concretewaco.com.
- LocationLanding, ServiceLanding, JobsIndex, GuidesIndex: phone in meta, sharper titles.
- servicePages.js, locationPages.js: updated seoTitle, seoDescription for all service and Waco location pages.

## 2026-02-13 — GSC MCP unavailable; plan created

### Context
- User asked to use GSC MCP to find site weaknesses and plan for #1 rankings.
- GSC MCP not available in current tools (same 403 as 2026-02-10 session).

### What was done
- Compiled findings from napkin, reports (seo-execution, seo-rank-gap, seo-competitor), and live curl checks.
- Verified prerendered service page metadata: `/services/concrete-driveways/` returns correct title, canonical, description.
- Created `reports/seo-rank-1-plan-2026-02-13.md` with phased plan (technical fixes → content → off-site → GSC iteration).
- No code changes made; plan only.

### Key plan items
1. Prerender job detail pages (currently SPA with homepage metadata in raw HTML).
2. Fix soft-404 pattern for unknown routes.
3. Add X-Robots-Tag for `/admin` without trailing slash.
4. Mobile LCP optimization (hero image, unused JS).
5. Strengthen homepage for "concrete contractor Waco TX"; expand service pages; cost guides.
6. GBP, citations, local backlinks.

## 2026-02-10 — SEO competitor audit (concretewaco.com)

### Context
- Task: investigate why `concretewaco.com` ranks below local competitors for `waco concrete` and produce a practical plan to reach #1.

### What worked
- Playwright Google queries gave live SERP and indexation checks (`site:` queries) with location context.
- Source-level HTML checks across competitor domains revealed clear crawl/index differences.
- Sitemap sampling confirmed unique title/canonical coverage gaps on our deployed routes.

### Mistakes / corrections
- Tried Firecrawl first (per request), but MCP endpoints failed (`search`, `agent`, `scrape`). Pivoted to Playwright + direct HTML fetches.
- Initial shell command used `bash` and failed due zsh snapshot compatibility; switched to `zsh`.
- First status loop reused stale HTML on failed requests; fixed by clearing temp file each iteration.

### Critical finding
- Major indexability issue: many `concretewaco.com` routes return identical initial HTML with homepage canonical/title in source.
- Google currently shows very low indexation for important route groups (`/services`, `/jobs`, `/blog` queries returning no docs).

### Next implementation target
- Ship server-rendered or pre-rendered HTML for core SEO routes (home, services, locations, jobs, blog), with per-route canonical/title/H1 visible in raw HTML before JS.

## 2026-02-10 — SEO execution completed

### Implemented
- Added build-time prerender pass (`scripts/prerender-routes.mjs`) and wired into `npm run build`.
- Generated route-specific HTML in `dist/` for home, service pages, location pages, guides, blog/jobs/guides indexes, and 404.
- Standardized canonical domain to `https://www.concretewaco.com` in app SEO defaults, sitemap, robots, and base HTML.
- Expanded sitemap to include guide detail pages.
- Updated Vercel rewrites to serve prerendered static route HTML where it matters for indexing.

### Validation notes
- Verified build completes and generated HTML contains unique per-route title/description/canonical/robots and route-specific hidden H1 marker.
- Verified sitemap handler includes new guide URLs.

### Constraints / gotchas
- Firecrawl MCP remained unavailable during this session; used Playwright + direct fetch analysis instead.
- `vite preview` does not model Vercel rewrites, so rewrite behavior validated by config review and artifact existence.

## 2026-02-10 — SEO audit pass (post-execution)

### Context
- Task: run a fresh SEO audit for `https://www.concretewaco.com` using live production evidence and current repo configuration.

### What worked
- Combined source review (`src/lib/seo.js`, `scripts/prerender-routes.mjs`, `vercel.json`, `api/sitemap.xml.js`) with live `curl` checks to separate build intent from deployed behavior.
- Lighthouse CLI runs succeeded and produced actionable mobile performance evidence (LCP + payload contributors).
- Playwright checks confirmed the SSR-vs-hydration gap: raw HTML has homepage metadata on dynamic routes, then client JS rewrites tags after data load.

### Mistakes / corrections
- Tried PageSpeed API first; quota was exhausted (`429 RESOURCE_EXHAUSTED`), switched to Lighthouse CLI for metrics.
- GSC MCP access failed (`403 Insufficient Permission`), so prioritized direct crawl/indexability evidence from live responses.

### Key findings captured
- Unknown routes return `200` with homepage canonical/index metadata in raw HTML (soft-404 pattern).
- Existing dynamic job detail URL source also returns homepage metadata before hydration.
- Sitemap misses `/guides` and currently outputs no `/jobs/:slug` URLs even though public jobs with slugs exist.
- `/admin` (no trailing slash) is missing `X-Robots-Tag`; `/admin/` and nested admin paths include it.
- Mobile homepage performance bottleneck is image payload + unused JS (Lighthouse perf 0.61, LCP 7.6s).

## 2026-02-16 — Live competitor audit for "Waco Concrete Contractor"

### Context
- User asked for extensive research on why these domains outrank ours:
  - gonzalezconcreteconstruction.com
  - wacoconcrete.net
  - wacoconcretecontractor.com
- Goal: diagnosis + execution plan.

### What worked
- Pulled live on-page signals (title/description/canonical/h1/json-ld), robots/sitemaps, and content depth from raw HTML.
- Confirmed query-level data via GSC MCP `detect_quick_wins` for `sc-domain:concretewaco.com`.
- Verified technical behavior with direct HTTP checks (canonical redirects + 404 behavior).

### Mistakes / corrections
- Firecrawl MCP search/scrape failed repeatedly; pivoted to direct web search + curl-based audit.
- Attempted Bing/DDG SERP scraping, but anti-bot challenge blocked reliable parsing; used available web SERP evidence + direct domain analysis.

### Critical findings
1. **Raw HTML content gap (highest impact):** `www.concretewaco.com` pages expose metadata + hidden H1, but almost no crawlable body copy/links in source. Home and key SEO routes show ~12-18 words in raw HTML, while competitors expose hundreds to thousands.
2. **Soft-404 issue persists:** unknown routes on `www.concretewaco.com` return `200` + homepage title instead of `404`.
3. **GSC duplication/canonical split indicators:** quick-wins output shows both `http://concretewaco.com/` and `https://concretewaco.com/` page variants for similar queries, with different average positions.
4. **CTR and click-through weakness:** multiple high-intent queries have impressions with `0` clicks in GSC output.

### Evidence snapshot
- Homepage raw text words:
  - `https://www.concretewaco.com/` => 18
  - `https://wacoconcretecontractor.com/` => 1839
  - `https://www.gonzalezconcreteconstruction.com` => 711
  - `https://www.wacoconcrete.net/index.html` => 5372
- Homepage source links in raw HTML:
  - `https://www.concretewaco.com/` => 0 `<a>` tags found in source
- Unknown route behavior:
  - `https://www.concretewaco.com/does-not-exist` => HTTP 200 (homepage title)

### Next implementation target
- Move from metadata-only prerender to true prerender/SSR for homepage + location + service + guide pages so Google receives crawlable body copy and internal links in initial HTML.
- Fix unknown route handling to return real 404 status.
- Consolidate canonical signals and monitor GSC for one canonical URL variant per query/page.

## 2026-02-16 — Implemented Phases 1, 2, 3 (SEO recovery)

### Context
- User asked to execute all three phases from competitive SEO plan.

### What was implemented
1. **True source-visible prerender content**
   - Replaced metadata-only prerender approach in `scripts/prerender-routes.mjs`.
   - New prerender now injects real route body HTML into `#root` for:
     - Homepage
     - All service routes
     - All location routes
     - Guide index + guide detail routes
     - Blog index + jobs index fallback content
   - Content includes visible H1/H2s, FAQs, internal links, action links, and local-intent copy.

2. **Soft-404 mitigation / routing hygiene**
   - Removed catch-all rewrite from `vercel.json` (`/(.*) -> /index.html`) to avoid unknown-path homepage 200 behavior.
   - Added explicit noindex header for `/admin` (without trailing slash) in addition to `/admin/(.*)`.

3. **On-page relevance + internal linking upgrades in React pages**
   - Updated homepage messaging for local-intent language:
     - `src/components/Hero.jsx`
     - `src/components/Services.jsx`
     - `src/components/CostQuickAnswers.jsx`
   - Added cross-link clusters:
     - `src/pages/ServiceLanding.jsx` now links to related services + pricing guides.
     - `src/pages/LocationLanding.jsx` now links to pricing guides.
     - `src/pages/GuidesIndex.jsx` now links to services + city pages.

### Validation
- `npm run build` succeeded after changes.
- Source-visible content checks on built HTML:
  - `dist/index.html`: 981 words, 24 links, 1 H1
  - `dist/services/concrete-driveways/index.html`: 660 words, 18 links, 1 H1
  - `dist/waco-tx-concrete-contractor/index.html`: 437 words, 13 links, 1 H1
  - `dist/guides/concrete-driveway-cost-waco-tx/index.html`: 403 words, 5 links, 1 H1

### Mistakes / notes
- `npm run lint` fails due many pre-existing repository-wide lint issues not introduced in this pass.
- Firecrawl MCP tools were unavailable earlier in session; local/direct validation path used.

### Next operational step
- Deploy to Vercel and re-validate production responses for:
  - unknown URL => HTTP 404
  - raw HTML word count + links on priority routes
  - GSC recrawl/reindex for homepage + top services + top locations + guides

## 2026-02-18 — Portfolio title specificity preference

### User Preferences
- Use clear, real-world project titles in portfolio/jobs (e.g., `Sidewalk Concrete Paving`, `Parking Lot Repairs`, `Retaining Walls`, `Shop Foundations`) instead of vague or generic construction labels.

### Patterns That Work
- Update `public.jobs.title` (and matching `description`/`job_images.alt_text`) via a forward migration so production and local environments stay aligned.

## 2026-02-18 — Mobile related-project image fill fix

### Context
- User reported that images in the Job Detail "Related Projects" cards were not filling the full card on mobile.

### What was done
1. Updated related project card image in `src/pages/JobDetail.jsx` to use absolute positioning (`absolute inset-0`) inside the card.
2. Added inline style (`width: 100%`, `height: 100%`, `objectFit: cover`) on that image for robust full-card fill behavior.
3. Added explicit z-index layering for gradient and text overlays to preserve readability.

### Pattern note
- For card images that must fully fill an aspect-ratio container on mobile Safari, use absolute fill + explicit 100% dimensions/object-fit instead of relying on flow layout image sizing.

## 2026-02-18 — Mobile related-project card image not filling

### Context
- User reported Related Projects card image leaving a large empty/gray area on mobile.

### Root cause
- Global rule `img { height: auto; }` in `src/index.css` had the same specificity as Tailwind utility classes like `h-full`.
- Because the global rule appears later in the stylesheet, it overrode `h-full`, so card images could not stretch to fill the aspect-ratio container.

### Fix
- Changed the baseline selector to `:where(img)` so utility classes keep priority.
- Kept `max-width: 100%` + `height: auto` baseline for normal content images.

### Rule to remember
- Use low-specificity global resets (`:where(...)`) when utility classes must be able to override them.

## 2026-02-18 — Portfolio title migration applied

### Context
- User asked to run `20260218110000_update_project_titles.sql` and record it.

### What was done
1. Ran migration SQL via MCP to refresh featured portfolio/project data:
   - Updated `public.jobs.title` and `public.jobs.description` for four slugs:
     - `2025-01-27-commercial-concrete-barrier`
     - `2024-04-06-concrete-slab-finishing`
     - `2024-03-27-concrete-formwork`
     - `2024-02-13-foundation-excavation`
   - Updated `public.job_images.alt_text` for image ordering under the same jobs.
2. Confirmed migration landed with Supabase MCP as version `20260218001431` for name `20260218110000_update_project_titles`.
3. Added a persistent note to this napkin.

## 2026-02-18 — Supabase-driven project category filters

### Context
- User asked for these gallery categories: `Sidewalk Concrete Paving`, `Parking Lot Repairs`, `Retaining Walls`, `Shop Foundations`, and explicitly asked to use Supabase MCP.

### What was done
1. Updated `public.jobs.category` for four existing slugs so category labels match the requested names.
2. Updated UI filter chips to derive categories from Supabase job data rather than hardcoded arrays:
   - `src/components/Gallery.jsx`
   - `src/components/JobGallery.jsx`
3. Updated admin job category options/filtering to include requested labels and merge in live categories from existing jobs:
   - `src/admin/AdminJobs.jsx`

### Pattern note
- Keep portfolio category filters data-driven from Supabase to avoid future code edits whenever category labels change.

## 2026-02-18 — Keep full category chip set visible

### User Preference
- Show all category chips together, including:
  - `Driveways`, `Patios`, `Stamped`, `Commercial`, `Residential`
  - `Sidewalk Concrete Paving`, `Parking Lot Repairs`, `Retaining Walls`, `Shop Foundations`

### Pattern note
- Do not rely only on currently used DB categories for chip visibility; keep a stable default category list and merge in any new DB categories.

## 2026-02-18 — Job detail hero image fill lock

### Context
- User reported the top project hero image on job detail still left empty space on mobile.

### What was done
1. Updated hero image in `src/pages/JobDetail.jsx` to absolute fill (`absolute inset-0`) instead of normal flow.
2. Added explicit inline cover sizing (`width: 100%`, `height: 100%`, `objectFit: cover`) for robust mobile rendering.

### Pattern note
- For full-bleed hero cards on mobile Safari, treat the image like a background layer: absolute fill + explicit cover dimensions.
