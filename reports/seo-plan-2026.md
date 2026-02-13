# SEO Plan: concretewaco.com → #1 Rankings

**Generated:** 2026-02-13 from GSC data analysis

---

## Executive Summary

GSC data shows **22 clicks, 562 impressions** over Jan 2025–Feb 2026. The site ranks **position 1–7** for many high-value keywords but gets **0% CTR** on most—a meta/title problem, not a ranking problem. Fix CTR first, then consolidate URL equity and build content depth.

**Target keywords for #1:**
- concrete contractor waco tx (38 impr, pos 5.5, 0 clicks)
- concrete contractors waco tx (24 impr, pos 7.2, 0 clicks)
- concrete contractor waco (7 impr, pos 3.4, 1 click)
- concrete waco tx (10 impr, pos 1.4, 0 clicks)
- concrete driveways (13 impr, pos 4, 0 clicks)
- concrete foundations (15 impr, pos 3.7, 0 clicks)

---

## Part 1: GSC-Derived Weaknesses

### 1. Zero CTR Despite Top 10 Rankings (CRITICAL)

| Keyword | Impressions | Position | Clicks | Issue |
|---------|-------------|----------|--------|-------|
| concrete contractor | 27 | 1.7 | 0 | Ranking #1–2, nobody clicks |
| concrete slabs | 27 | 1.0 | 0 | **#1 for 27 impr, 0 clicks** |
| concrete contractor waco tx | 38 | 5.5 | 0 | Highest-volume local term |
| concrete contractors waco tx | 24 | 7.2 | 0 | Second highest |
| concrete foundations | 15 | 3.7 | 0 | Service term, strong position |
| concrete driveways | 13 | 4.0 | 0 | Service term |
| concrete waco tx | 10 | 1.4 | 0 | Brand+geo, ranks #1 |
| concrete contractors waco | 10 | 4.3 | 0 | |
| concrete companies waco tx | 7 | 2.6 | 0 | |

**Root cause:** Title and meta description are not compelling or don’t match search intent. Generic titles like "Concrete Contractor Waco TX | Driveways, Patios & Stamped Concrete" don’t differentiate in the SERP.

### 2. URL Fragmentation & Canonical Chaos

- **http://concretewaco.com/** → 417 impr, 15 clicks, pos 3.2 (dominant)
- **https://concretewaco.com/** → 213 impr, 5 clicks, pos 13.2
- **https://www.concretewaco.com/** → canonical in HTML but not enforced at host level

Google sees multiple versions. Link equity and relevance are split across:
- http vs https
- www vs non-www

**Impact:** Weaker rankings than if all signals pointed to a single canonical URL.

### 3. Fragment URLs (#about, #services, etc.) Indexed

- `https://www.concretewaco.com/#about` — 18 impr
- `https://www.concretewaco.com/#services` — 18 impr
- `https://www.concretewaco.com/#faq` — 17 impr
- `https://www.concretewaco.com/jobs` — 18 impr

Single-page app fragments compete with the main URL for the same queries, diluting authority.

### 4. Mobile vs Desktop Imbalance

- Desktop: 441 impr, 17 clicks (3.9% CTR)
- Mobile: 118 impr, 5 clicks (4.2% CTR)

Mobile has fewer impressions despite typical local/search behavior. Suggests potential mobile index or UX issues, or local pack not showing.

### 5. Irrelevant / Misfire Queries

- "sla concrete works", "sla", "sla company" — tech/IT SLA confusion
- "concrete slab companies vidor tx", "concrete slab company vidor tx" — Vidor ~4 hrs away
- "how to quote a concrete job" — informational
- "emergency concrete killeen", "commercial concrete killeen" — Killeen-focused (expansion opportunity)

### 6. Content Gaps

- **Blog** — 2 impr, pos 10
- **Guides** — 1 impr
- **Gallery** — 2 impr
- **Location pages** (waco-tx-concrete-contractor, etc.) — not surfacing in GSC

Sitemap includes location, service, and guide pages, but they don’t appear in top query data. Either not indexed or not ranking.

### 7. Weak Service-Specific Landing Pages

High-impression service terms (concrete driveways, concrete foundations, stamped concrete, etc.) are mostly served by the homepage. Dedicated service pages exist but aren’t capturing these queries.

---

## Part 2: #1 Ranking Plan (Phased)

### Phase 1: Fix CTR (Weeks 1–2) — Highest ROI

**Goal:** Turn existing impressions into clicks.

1. **Rewrite meta titles** for each page type:
   - Homepage: Include primary keyword + benefit + location.
     - Before: `Concrete Contractor Waco TX | Driveways, Patios & Stamped Concrete`
     - After: `Concrete Contractor Waco TX | Free Estimates (254) 230-3102 | 20+ Years`
   - Add urgency/scarcity where appropriate: "Free Estimate Today" or "Licensed & Insured".

2. **Rewrite meta descriptions:**
   - Match intent (e.g., "Need a driveway? Get a free quote.")
   - Include call-to-action and phone number.
   - Stay under 155 characters.

3. **Improve H1s:** Ensure H1 matches target keyword and search intent (e.g., "Concrete Contractor Waco TX").

4. **Schema:** Verify LocalBusiness/ConcreteContractor schema is valid and includes service area, phone, address.

**Expected impact:** 2–3x CTR on terms already in top 10.

---

### Phase 2: Technical SEO (Weeks 2–3)

1. **Canonical & Redirect Strategy:**
   - Choose single canonical: `https://www.concretewaco.com/`
   - 301 redirect: `http://concretewaco.com` → `https://www.concretewaco.com`
   - 301 redirect: `https://concretewaco.com` → `https://www.concretewaco.com`
   - Configure at Vercel/host level, not just `<link rel="canonical">`.

2. **Fragment URLs:**
   - Use `rel="canonical"` to point `#about`, `#services`, `#faq`, etc. to `https://www.concretewaco.com/`
   - Or use `data-nosnippet` / meta noindex on fragments if they shouldn’t be treated as separate pages.

3. **Sitemap:** Confirm all location, service, and guide URLs are live, return 200, and are in sitemap.xml.

---

### Phase 3: Content Expansion (Weeks 4–8)

1. **Location pages (priority):**
   - Ensure `waco-tx-concrete-contractor` is unique, keyword-rich, and internally linked.
   - Add local proof: projects, neighborhoods, city-specific copy.

2. **Service pages (priority):**
   - `concrete-driveways`, `concrete-foundations`, `stamped-concrete`, `concrete-repair`, `conmercial-concrete`
   - Target queries: "concrete driveways", "concrete foundations", "stamped concrete waco"
   - 800–1,500 words each, clear H1/H2 structure, FAQ section.

3. **Guide content:**
   - "Concrete Driveway Cost Waco TX", "Stamped Concrete Cost Waco TX"
   - Target informational + commercial intent.

4. **Blog:**
   - 1–2 posts/month on local topics: "Best Concrete Driveway Options for Waco", "Black Clay Soil and Concrete Foundations".
   - Internal links to services and location pages.

---

### Phase 4: Local SEO & Off-Page (Ongoing)

1. **Google Business Profile:** Optimize, add photos, posts, Q&A.
2. **Citations:** NAP consistency (Name, Address, Phone) across directories.
3. **Reviews:** Systematize review requests.
4. **Backlinks:** Local partnerships, chamber of commerce, supplier/partner links.

---

## Quick Wins (Do First)

| Action | Effort | Impact |
|--------|--------|--------|
| Rewrite homepage meta title & description | 30 min | High |
| Add phone to meta description | 5 min | Medium |
| Implement 301 from http→https and non-www→www | 1 hr | High |
| Canonicalize fragment URLs to homepage | 30 min | Medium |
| Audit H1 on homepage vs target keyword | 15 min | Medium |

---

## Success Metrics

- **3 months:** CTR 3.5% → 6%+ on top 10 terms
- **6 months:** "concrete contractor waco tx" and "concrete contractors waco tx" in top 3
- **12 months:** #1 for primary terms; 100+ monthly organic clicks

---

## Data Sources

**Yes—all data was pulled from GSC (Google Search Console API)** via the Search Console API using the HomesteadEdu service account. The GSC MCP tools were not available in-session, so a Node script using `googleapis` fetched:
- Top 50 queries
- Top 30 pages
- Device breakdown
- Query + page combinations

Property: `sc-domain:concretewaco.com` (Jan 2025–Feb 2026)

---

## Implementation Log (2026-02-13)

- **Phase 1:** Meta titles, descriptions, H1 updated (index.html, seo.js, Hero.jsx)
- **Phase 2:** Vercel redirect (concretewaco.com → www.concretewaco.com) added
- **Phase 3:** Location + service + jobs + guides pages: CTR-optimized titles/descriptions, phone in meta
- **Phase 4:** Schema description tightened
- **Competitor plan:** See `reports/competitor-beating-plan-2026.md` for detailed tasks to outrank Waco Concrete, Waco Concrete Company, and Waco Concrete Works
