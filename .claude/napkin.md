# Napkin

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
