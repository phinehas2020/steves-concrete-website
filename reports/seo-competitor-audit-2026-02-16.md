# SEO Competitor Audit: Why Competitors Outrank for "Waco Concrete Contractor"

Date: 2026-02-16
Target site: https://www.concretewaco.com/
Competitors analyzed:
- https://www.gonzalezconcreteconstruction.com/
- https://www.wacoconcrete.net/
- https://wacoconcretecontractor.com/

## Executive summary
The biggest ranking handicap is not title tags or schema. It is crawlable content availability in raw HTML.

Your live pages currently serve metadata plus a hidden H1 in source, but almost no body copy or internal links before JavaScript executes. Competitors expose keyword-relevant content, headings, service sections, and internal links directly in initial HTML.

This creates a severe disadvantage for crawl efficiency, index confidence, and relevance scoring on local service terms.

## Research evidence

### 1) SERP snapshot for target query
US web SERP snapshots for "Waco Concrete Contractor" showed competitor domains appearing above your domain, including:
- wacoconcrete.net
- wacoconcretecontractor.com
- gonzalezconcreteconstruction.com

### 2) Raw HTML content depth (homepage)
Measured from initial HTML response (not hydrated DOM):
- https://www.concretewaco.com/ -> 18 words, 0 `<a>` tags, H1 only
- https://wacoconcretecontractor.com/ -> 1,839 words
- https://www.gonzalezconcreteconstruction.com/ -> 711 words
- https://www.wacoconcrete.net/index.html -> 5,372 words

### 3) Raw HTML content depth (key interior pages)
Your pages:
- https://www.concretewaco.com/waco-tx-concrete-contractor -> 12 words
- https://www.concretewaco.com/services/concrete-driveways -> 13 words
- https://www.concretewaco.com/services/stamped-concrete -> 13 words
- https://www.concretewaco.com/blog -> 14 words

Competitor pages:
- https://wacoconcretecontractor.com/concrete-driveway-and-driveway-resurfacing/ -> 952 words
- https://wacoconcretecontractor.com/stamped-concrete-and-concrete-finishing/ -> 1,072 words
- https://www.gonzalezconcreteconstruction.com/sidewalks-driveways -> 697 words

### 4) Site quality signal issue: soft 404 behavior
- https://www.concretewaco.com/does-not-exist returns HTTP 200 with homepage title.

Competitors tested returned proper 404 on unknown routes.

Soft 404 behavior can dilute site quality and crawl signals.

### 5) GSC quick-win signal (query-level)
GSC quick-win output shows high-intent terms with impressions and near-zero CTR/clicks. It also shows variant page URLs (http/https) in opportunities, suggesting canonical/URL version signal fragmentation still needs cleanup and monitoring.

### 6) Competitor on-page pattern differences
Competitors expose these directly in source HTML:
- Service-specific H2/H3 sections
- FAQ-style sections and query-matching headings
- Local intent language (Waco/TX in visible text)
- Review/social-proof references
- Keyword-rich internal links to service pages

Your source HTML currently relies on JS rendering for those UX/content signals, which weakens first-pass indexing quality for local queries.

## Root-cause ranking diagnosis

1. **Primary blocker (critical):** metadata-only prerender pattern
- Current prerender script updates meta tags and injects hidden H1, but not full route content.
- File: `scripts/prerender-routes.mjs`

2. **Critical technical quality gap:** unknown URL returns 200
- Needs real 404 routing and status response.

3. **Canonical/version signal hygiene still inconsistent in GSC reports**
- Duplicate URL variants appear in query opportunities.

4. **Secondary issue:** CTR underperformance on local-intent terms
- Even where ranking appears decent for some variants, clicks are not materializing.

## Priority recovery plan

## Phase 0 (0-3 days): unblock indexability quality
1. Replace metadata-only prerender with true HTML prerender/SSR for core SEO routes:
   - Homepage
   - Top 8 service pages
   - Waco + top location pages
   - Guides index + key guides
2. Ensure prerender output contains visible body copy and internal links in source HTML.
3. Fix unknown-route handling to return 404 status with dedicated 404 template.
4. Re-submit sitemap in GSC and request reindex for homepage + top pages.

**Definition of done:**
- Raw HTML on priority pages shows >= 400 words and meaningful internal links.
- Unknown routes return 404.

## Phase 1 (4-14 days): improve relevance + CTR on money pages
1. Rewrite homepage intro and service blocks to target exact local service intent in natural language.
2. Add visible trust stack above fold:
   - license/insured
   - service-area proof
   - phone CTA
   - review proof with honest counts
3. Add FAQ block on homepage and top services aligned to query intent.
4. Tighten title/meta for click intent (price, response time, local proof).

**Definition of done:**
- Homepage/source contains distinct service + local value sections, not generic copy.
- GSC CTR on target queries begins moving above 1% baseline.

## Phase 2 (2-6 weeks): topical authority + internal link architecture
1. Expand service cluster depth with real job details, pricing factors, and local constraints.
2. Build stronger internal linking between:
   - homepage -> service pages
   - service pages -> location pages
   - guides -> relevant services
3. Add project-level evidence (dates, neighborhoods, scope details) to improve E-E-A-T.

**Definition of done:**
- Each primary service page has substantial unique content and conversion CTA.
- Internal links are present in source HTML and crawlable.

## Phase 3 (parallel, ongoing): local authority off-site
1. Google Business Profile optimization and review velocity program.
2. Citation consistency across local directories (NAP lock).
3. Acquire local backlinks (suppliers, chambers, project partners, local media/community).

**Definition of done:**
- Monthly net-positive review growth.
- Consistent NAP in top citation sources.

## KPI scoreboard (track weekly)
- Exact query average position: "waco concrete contractor"
- GSC clicks and CTR for top 10 non-brand service queries
- Indexed page count for service/location clusters
- 404 correctness rate (no soft 404s)
- Raw HTML crawlability checks (word count + links) on priority URLs

## Immediate execution backlog (first sprint)
1. Implement SSR/prerender of real route body content for homepage + 10 priority pages.
2. Fix soft-404 behavior in routing/rewrite setup.
3. Audit canonical tags against final redirect chain for all URL variants.
4. Re-crawl and validate source HTML for priority pages (pre and post comparison).
5. Re-submit sitemap + request reindex in GSC.

## Why this plan should work
Competitors are winning because Google sees fully rendered, query-relevant, local-intent content in raw HTML. Once your pages expose equivalent-or-better crawlable content and technical quality (especially 404/canonical hygiene), your existing schema and breadth should become an advantage instead of being hidden behind JS.
