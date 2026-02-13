# Plan: Rank #1 for Waco Concrete Keywords

**Date:** 2026-02-13  
**Site:** concretewaco.com (Concrete Works LLC)  
**Goal:** Reach position #1 for core Waco-area concrete keywords.

**Note:** GSC MCP is not available (403 Insufficient Permission). This plan is based on past audits, competitor reports, live crawl checks, and SEO best practices.

---

## Current State Summary

### What’s Working
- **Prerendered core routes** – Services, locations, guides, blog/jobs indexes return unique title, canonical, description, H1 in raw HTML (verified via curl).
- **Canonical consistency** – `https://www.concretewaco.com` used across SEO config and sitemap.
- **Sitemap** – Includes home, blog, jobs, guides, services, locations; blog posts and jobs pulled from Supabase.
- **robots.txt** – Allows indexing, disallows `/admin`, references sitemap.
- **Pricing guides** – Driveway, stamped, patio cost pages in place for high-intent cost queries.
- **Stamped concrete** – Already ranking around #8 for "stamped concrete Waco TX" (per Feb 4 report).

### Remaining Weaknesses (from audits + napkin)

| Issue | Impact | Priority |
|-------|--------|----------|
| Dynamic job detail URLs return homepage metadata in raw HTML | Google sees duplicate canonical/title; job pages under-indexed | High |
| Unknown/404 routes return 200 + homepage metadata | Soft-404 pattern; wastes crawl budget | Medium |
| `/admin` (no slash) missing X-Robots-Tag | Admin could be indexed if crawled | Low |
| Mobile LCP ~7.6s, images + unused JS | CWV penalty, lower rankings | High |
| Not in top 10 for "concrete contractor Waco TX" | Main money keyword missed | Critical |
| Not in top 14 for "concrete driveway Waco TX" | High-intent service keyword missed | Critical |
| Directory dominance (BBB, Yelp, Procore, etc.) | Takes spots 1–5 for broad contractor queries | Strategic |
| Competitors use service pages + cost content | Rank on intent-matching pages | Strategic |

---

## Phase 1: Technical Fixes (1–2 weeks)

### 1.1 Prerender Job Detail Pages
- **Problem:** `/jobs/:slug` falls through to SPA; raw HTML has homepage metadata.
- **Fix:** Extend `scripts/prerender-routes.mjs` to fetch job slugs from Supabase at build time and emit static HTML per job with job-specific title, description, canonical.
- **Vercel:** Add rewrite for `/jobs/[slug]` → `dist/jobs/[slug]/index.html` when file exists; otherwise SPA.

### 1.2 Fix Soft-404 Pattern for Unknown Routes
- **Problem:** `/random-unknown-path` returns 200 with homepage canonical.
- **Fix:** Add Vercel rewrite so unknown routes serve `404.html` (already prerendered with noindex) when no static file matches. Fallback to index.html only for known SPA routes.

### 1.3 X-Robots-Tag on /admin (no slash)
- **Fix:** In `vercel.json` headers, change `/admin/(.*)` to also catch `/admin` exactly, e.g. add a second rule for `source: "/admin"` with same X-Robots-Tag.

### 1.4 Mobile Performance (LCP)
- **Problem:** LCP 7.6s, images and unused JS (Lighthouse perf 0.61).
- **Fixes:**
  - LCP image: ensure hero/above-fold image uses `fetchpriority="high"` and is NOT lazy-loaded; consider `<link rel="preload">`.
  - Resize/compress hero images; use WebP/AVIF with fallbacks.
  - Lazy-load below-fold images; defer non-critical JS.
  - Trim unused JS (analyze bundle, code-split by route).

---

## Phase 2: Content & On-Page (2–4 weeks)

### 2.1 Strengthen Primary Money Page
- **Keyword:** "concrete contractor Waco TX"
- **Action:** Optimize homepage for this query:
  - H1 variant: "Waco TX Concrete Contractor | Driveways, Patios & Stamped Concrete"
  - Expand above-fold copy with "concrete contractor Waco TX" and "Waco, Texas" naturally.
  - Add a short FAQ block answering "Who is the best concrete contractor in Waco?" and "What concrete services does Waco offer?"
  - Add LocalBusiness schema with address, phone, service area, reviews aggregate if available.

### 2.2 Service Page Depth
- Competitors rank on dedicated service pages.
- **Action:** Ensure each service page has:
  - 800–1,200 words of unique, local content (Central Texas soil, heat, neighborhoods).
  - FAQ schema for 3–5 relevant questions.
  - Internal links to related services, guides, and location pages.
  - CTA with phone + "Free estimate" prominent.

### 2.3 Cost / Guide Content Expansion
- Aggregators (manta.com, homeyou.com, etc.) rank for cost queries.
- **Action:**
  - Add "Concrete patio cost Waco TX" if not already covered.
  - Include specific $/sq ft ranges (even if approximate), plus factors (size, finish, base prep).
  - Add "Last updated" date.
  - Internal links from service pages and homepage.

### 2.4 Gallery / Jobs as SEO Assets
- Add project specs (sq ft, finish type, neighborhood, completion date) to job cards/pages.
- Use unique title/meta per job: `"[Project Type] in [Neighborhood] | Concrete Works LLC"`.
- Internal links from jobs to relevant service pages.

---

## Phase 3: Off-Site & Authority (Ongoing)

### 3.1 Google Business Profile
- Claim/verify GBP; ensure NAP matches site.
- Add services, photos, regular posts.
- Target reviews for phrases like "concrete contractor Waco" and "driveway Waco."
- Respond to all reviews.

### 3.2 Local Citations
- Submit to: Waco Chamber, BBB, local directories, Angi/HomeAdvisor (if used).
- Ensure NAP consistency everywhere.

### 3.3 Backlinks
- Goal: 3–5 relevant local links in 3–6 months.
- Sources: suppliers, builders, real estate agents, community/neighborhood sites.
- Avoid link farms; focus on relevance and local trust.

---

## Phase 4: GSC & Iteration

### 4.1 Manual GSC Actions (You Do These)
- Submit sitemap: `https://www.concretewaco.com/sitemap.xml`
- Request indexing for: homepage, all `/services/*`, all location pages, `/guides/*`, `/blog`, `/jobs`
- After job prerender: request indexing for `/jobs/*` URLs
- Monitor: Index coverage, "concrete contractor Waco TX", "concrete driveway Waco TX", "stamped concrete Waco TX"

### 4.2 Tracking
- Track positions for target keywords (manual checks or rank tracker).
- Use GSC Performance for impressions, clicks, CTR.
- Re-run Lighthouse after performance changes; aim LCP < 2.5s on mobile.

---

## Priority Order (Recommended)

1. **Immediate (this week):**
   - Fix `/admin` X-Robots-Tag
   - Prerender job detail pages
   - Improve mobile LCP (hero image + critical JS)

2. **Next 2 weeks:**
   - Fix soft-404 for unknown routes
   - Strengthen homepage for "concrete contractor Waco TX"
   - Expand service page content and FAQ schema

3. **Month 1–2:**
   - Cost/guide content updates
   - Gallery/job SEO enhancements
   - GBP optimization and review campaign

4. **Ongoing:**
   - Citation building
   - Local backlinks
   - GSC monitoring and re-index requests

---

## Success Metrics

- **Primary:** Top 3 for "concrete contractor Waco TX", "concrete driveway Waco TX", "stamped concrete Waco TX"
- **Secondary:** Increased indexed pages in GSC, LCP < 2.5s on mobile, 10+ quality backlinks
- **Stretch:** #1 for at least one primary keyword within 3 months
