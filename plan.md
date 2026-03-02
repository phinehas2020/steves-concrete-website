# ConcreteWaco.com SEO Execution Plan

Last updated: 2026-03-02  
Goal window: 90 days (March-May 2026)  
Primary goal: outrank top Waco-area concrete competitors for high-intent local searches and increase qualified organic leads.

## 0) Live Implementation Status (Shipped 2026-03-02)

### Completed now in code
- Fixed sitemap runtime risk and validated API sitemap output returns HTTP `200` with valid XML.
- Added `llms.txt` and updated `robots.txt` to allow crawl visibility.
- Implemented high-intent service pages:
  - `/foundation-repair-waco-tx`
  - `/house-leveling-waco-tx`
  - `/parking-lot-concrete-waco`
  - `/retaining-walls-waco-tx`
  - `/decorative-concrete-waco`
  - `/hardscaping-waco-tx`
  - `/concrete-deck-contractors`
  - `/contractors-in-waco-tx`
- Implemented canonical consolidation:
  - Added permanent redirects from duplicate legacy service paths to canonical pages.
  - Added canonical + `noindex, follow` handling for duplicate `/services/*` variants.
  - Removed non-canonical URLs from sitemap generation.
- Tightened on-page SEO:
  - Shortened long page titles.
  - Added `aggregateRating` on homepage LocalBusiness schema.
- Improved route-level performance baseline:
  - Added lazy-loaded route splitting in `src/main.jsx`.
- Regenerated sitemap and prerendered route outputs with canonical URLs.

### Still requires external/manual execution
- Submit sitemap and request indexing in Google Search Console.
- Run Semrush crawl + GSC monitoring to verify no remaining 5xx and validate indexation.
- Execute backlink outreach, citation submissions, and local partnership link acquisition.
- Continue blog and project-case publishing cadence.

## 1) Baseline and Competitive Gap

### Current baseline (ConcreteWaco.com)
- Organic keywords: `13`
- Estimated organic traffic: `49/month`
- Authority Score: `10`
- Average ranking position: `6.8`

### Top competitor benchmark
| Domain | Ranking Keywords | Est. Organic Traffic |
|---|---:|---:|
| wacoconcrete.net | 40 | 646 |
| wacoconcreteservices.com | 29 | 616 |
| wacoconcreteworks.com | 23 | 436 |
| luckysconcretewaco.com | 21 | 534 |
| concretewaco.com (current) | 13 | 49 |

### Strategic takeaway
Your authority foundation is competitive, but page depth and keyword coverage are not. The fastest path to gains is publishing and optimizing dedicated service/location pages for uncovered terms.

## 2) 90-Day Targets (KPI Commitments)

- Grow ranking keywords from `13` to `45+`
- Increase organic traffic from `49` to `200+` monthly visits
- Raise average CTR from `2.8%` to `5.0%+`
- Achieve top-3 rankings for at least `5` high-intent local commercial keywords
- Reach passing Core Web Vitals on key landing pages
- Add `15+` new referring domains with higher local relevance/quality

## 3) Priority Workstreams

## Workstream A: Service + Location Landing Pages (Highest Priority)
Target timeline: Week 1 to Week 3

### A1) Build/expand dedicated pages for keyword gaps
Use these as canonical SEO pages and avoid duplicates with canonical tags and 301 redirects where needed.

| Target URL | Primary Keyword Target | Search Volume | KD | Build Action |
|---|---|---:|---:|---|
| `/concrete-patios-waco-tx` | concrete patio builder | 390 | 34 | Create/refresh page with local patio intent |
| `/parking-lot-concrete-waco` | concrete parking lot contractors | 210 | 7 | Create/refresh parking lot commercial page |
| `/foundation-repair-waco-tx` | foundation repair waco tx | 140 | 4 | New page focused on repair + leveling |
| `/house-leveling-waco-tx` | house leveling waco tx | 70 | 6-9 | New page with crawlspace/slab leveling copy |
| `/retaining-walls-waco-tx` | retaining wall installation waco | 50 | 0 | New page targeting wall + drainage services |
| `/decorative-concrete-waco` | decorative concrete patio contractor | 50 | 21 | New page combining stamped/stained/decorative |
| `/concrete-driveways-waco-tx` | driveway pouring near me | 90 | low | Create/refresh transactional driveway page |
| `/hardscaping-waco-tx` | hardscaping contractor waco | 40 | 0 | New page for patios/walls/walkways package |
| `/concrete-deck-contractors` | concrete deck contractors | n/a | low | New page tied to patios/pool deck services |

### A2) On-page requirements for every service page
- One clear commercial intent per page with unique title/H1/meta description.
- 700-1,400 words of local-first copy (Waco, Woodway, Hewitt, McLennan County).
- One project proof block: location, square footage, concrete PSI, completion date, project story.
- One pricing section with realistic range and key cost drivers.
- FAQ block (4-6 Q&As) matching PAA and included in structured data.
- Internal links to related services, jobs/portfolio, and contact CTA.
- Prominent trust signals: years in business, license/insurance, review summary, phone CTA.

### A3) Existing-route cleanup
- Decide canonical strategy once: `/services/...` versus top-level slugs.
- Add 301 redirects from non-canonical versions.
- Ensure canonical tags, sitemap URLs, and internal links all point to canonical URLs only.

## Workstream B: Technical SEO Fixes (Critical)
Target timeline: Week 1

### B1) Immediate technical fixes (Day 1 to Day 2)
- Identify and fix the reported `5xx` URL (crawl with Semrush Site Audit + Vercel logs, verify HTTP 200 after fix).
- Validate live sitemap endpoint and submit in Google Search Console.
- Add `llms.txt` in public root with crawl guidance and key page map.
- Fix long title tags on affected pages (keep under ~60 characters where feasible).

### B2) Performance + Core Web Vitals (Day 3 to Day 7)
- Enable aggressive asset optimization: minification, compression, tree-shaking, code splitting.
- Optimize hero and above-the-fold media (preload primary image, compress, serve modern formats).
- Reduce JS/CSS unused bytes and defer non-critical scripts.
- Fix layout shifts (reserve image dimensions and stabilize dynamic components).
- Track LCP, CLS, INP in Search Console + PageSpeed Insights for top landing pages.

### B3) Technical acceptance criteria
- No 5xx errors in crawl reports for core pages.
- Sitemap submitted and indexed.
- Core landing pages pass CWV thresholds or show clear improving trend.
- No orphan pages, no conflicting canonicals, and no indexable duplicate variants.

## Workstream C: Ranking Push for Existing Keywords (Positions 5-25)
Target timeline: Week 2 to Week 5

### C1) Targeted ranking lift pages/queries
- `concrete contractor woodway texas` (position ~23): build or strengthen Woodway location page.
- `concrete contractor hewitt texas` (position ~24): build or strengthen Hewitt location page.
- `contractors waco` (position ~50): add dedicated contractors-in-Waco intent page.
- `waco cement` (position ~10): expand semantic relevance and supporting internal links.
- `concrete contractors waco tx` (position ~15): homepage + service hub optimization.
- `concrete companies waco tx` (position ~5): push into top 3 with richer proof/content.
- `waco concrete contractors` (position ~7): strengthen supporting links and schema.

### C2) CTR uplift tasks
- Rewrite title/meta for all top pages to include value prop + local qualifier + CTA.
- Add rich structured data (LocalBusiness, Service, Review, FAQ where valid).
- Improve snippet match quality with concise first-paragraph answers and service differentiators.

## Workstream D: Authority and Backlink Quality Upgrade
Target timeline: Week 3 onward (ongoing)

### D1) Link profile goals
- Keep growth trend in referring domains.
- Improve quality mix (reduce overreliance on low-authority sources).
- Prioritize local relevance over volume.

### D2) Local link-building execution
- Submit and optimize listings in Waco and Texas business directories (chamber, BBB, contractors, home services).
- Run monthly outreach to local publishers, neighborhood blogs, and regional home improvement resources.
- Build referral partnerships with landscapers, builders, roofers, and realtors for contextual links.
- Publish project case studies designed for citation and local sharing.
- Ask commercial clients/partners for website mentions where appropriate.

### D3) Weekly activity quota
- 20 outreach contacts per week.
- 5 directory/profile submissions per week.
- 2 partnership asks per week.
- 1 publishable case study or project story every 2 weeks.

## Workstream E: Content Engine (Blog + Portfolio)
Target timeline: Week 2 onward (ongoing)

### E1) Blog topics (high-intent informational)
- `How much does a concrete driveway cost in Waco?`
- `Best concrete finishes for Texas heat and black clay soil`
- `Concrete patio vs pavers in Central Texas`
- `When to repair vs replace a cracked driveway in Waco`
- `How long concrete curing takes in Texas weather`

### E2) Portfolio/jobs expansion
- Publish each completed project with neighborhood, service type, specs, timeline, and before/after media.
- Include a short owner quote and business outcome when available.
- Link each case study back to its related service page and contact page.

## 4) Execution Calendar

| Week | Main Deliverables |
|---|---|
| Week 1 | Fix 5xx, confirm sitemap indexing, add llms.txt, title tag cleanup, CWV sprint start |
| Week 2 | Publish first 3 high-value service pages, optimize homepage/service hub for primary local terms |
| Week 3 | Publish next 3 service pages, deploy schema upgrades, start outreach cadence |
| Week 4 | Publish remaining service pages, add/refresh Woodway + Hewitt pages, strengthen internal links |
| Week 5-6 | CTR optimization pass across top landing pages, expand FAQs, monitor ranking lift |
| Week 7-8 | Publish 4 blog posts + 2 project case studies, continue backlinks and citations |
| Week 9-12 | Iterate based on ranking/CTR data, refresh underperforming pages, scale winning clusters |

## 5) Measurement and Reporting Cadence

### Weekly scorecard
- Total ranking keywords
- Top 3 / Top 10 keyword counts
- Organic sessions
- Leads from organic traffic
- Average CTR and average position (GSC)
- New referring domains and quality mix
- Indexed page count + crawl errors

### Monthly review
- Identify pages in positions 4-12 and run a focused optimization pass.
- Prune/merge thin or overlapping pages.
- Rebalance internal links from strongest pages to pages closest to top 3.
- Update content freshness and schema where needed.

## 6) Definition of Done (90-Day Checkpoint)

- Service page cluster is complete and internally linked.
- Technical SEO blockers are resolved and verified in audit tools.
- Local schema is fully deployed on homepage + key service/location pages.
- Link-building pipeline is active with repeatable monthly outputs.
- Organic keyword footprint and traffic show measurable, sustained growth.

## 7) Immediate Next 5 Actions (Start This Week)

1. Submit `https://www.concretewaco.com/sitemap.xml` in Google Search Console and request indexing for the new canonical service URLs.
2. Run a fresh Semrush Site Audit and resolve any remaining crawl/index flags.
3. Begin weekly local outreach cadence (directories + partner links + media pitches).
4. Publish one new local project case study and link it from relevant service pages.
5. Publish one informational blog post from the content queue and interlink it to core service pages.
