# SEO Remediation Plan - 2026-05-12

Source artifacts:
- Phase 1 crawl CSV: `reports/audit_2026-05-12.csv`
- Link graph: `reports/link_graph.html`
- Target site crawl: 44 concretewaco.com URLs
- Reference crawl: 194 concretecontractor.nyc URLs from Rank Math sitemaps

## Executive Scorecard

| Dimension | Concrete Waco | Reference Site | Score | Gap |
| --- | ---: | ---: | ---: | --- |
| Crawlable URL footprint | 44 URLs | 194 URLs | 5/10 | Reference has far more service and support pages. |
| Median visible content depth | 794 words | 1,315 words | 5/10 | Most Waco service/location pages are below the 1,500-word target. |
| Internal links per page | 29 median | 65 median | 6/10 | Waco has good sitewide nav, but weaker contextual hub links. |
| Schema variety in live HTML | LocalBusiness/WebPage graph everywhere | Article/WebPage/Breadcrumb-style WordPress graph | 4/10 | Waco live HTML is missing page-specific Service, BreadcrumbList, and FAQPage. |
| Image presence in audited HTML | 0 detected | 10 average | 2/10 | Live crawl did not expose meaningful project images in HTML. |
| CTA and phone prominence | Phone on 93%; forms not detected | Phone/forms on 100% | 7/10 | Phone is strong; form markup is deferred or not crawl-visible. |
| Trust signals | Reviews 100%; license 7%; insurance 9% | Reviews 49%; license 54%; insurance 47% | 6/10 | Reviews are strong; verified license/insurance claims need broader placement. |
| Local signal depth | Waco/McLennan references present | NYC borough/location pages deep | 6/10 | Waco pages need more neighborhood, soil, permit, and project specifics. |
| Mobile/CWV evidence | Not measured: PageSpeed API quota/key unavailable | Not measured | n/a | Requires `PAGESPEED_API_KEY` or manual Lighthouse run. |

## Ranked Fix List

| Rank | Task | Impact | Effort | Est. hours | Dependencies | Expected lift |
| ---: | --- | --- | --- | ---: | --- | --- |
| 1 | Make prerendered schema page-specific: LocalBusiness only where appropriate, Service schema on service URLs, BreadcrumbList sitewide, FAQPage where FAQ exists, Place/area schema for Waco service area. | HIGH | Low | 3-5 | Existing page data | Better rich result eligibility and clearer entity mapping. |
| 2 | Expand the money page `/waco-tx-concrete-contractor` into a true hub with 1,500-2,000 words, service clusters, local soil/weather/permit detail, visible CTA, and links to every core service. | HIGH | Medium | 5-7 | Verified business facts | Stronger relevance for "concrete contractor Waco TX". |
| 3 | Expand top service pages to 1,500+ words: driveways, patios, stamped concrete, sidewalks, foundations, commercial concrete. | HIGH | High | 4-6 per page | Owner photos/facts | Better service-location long-tail coverage. |
| 4 | Make real project photos crawl-visible on service pages with WebP images, descriptive filenames, and natural Waco alt text. | HIGH | Medium | 4-8 | Existing uploaded project images and owner approval | Improves EEAT, engagement, and image-search/local relevance. |
| 5 | Add verified trust block globally and on service pages: Texas/state licensing caveat, municipal permit note, insurance type/carrier if owner confirms, owner bio/photo, GBP review link/API widget. | HIGH | Medium | 3-6 | Owner-supplied insurance/licensing facts | Reduces local trust gap without fabricating credentials. |
| 6 | Strengthen contextual internal linking: every service page links to 3-5 adjacent services, 1-2 relevant guides/posts, and the Waco hub with varied anchors. | MEDIUM | Low | 2-3 | Existing URL map | Raises crawl paths and topical clustering. |
| 7 | Expand pricing guides and FAQs with real ranges or omit unsupported pricing. | MEDIUM | Medium | 3-5 | Real quote/range confirmation | Captures cost-intent queries safely. |
| 8 | Add current project/case-study modules to the top 3 service pages using named client details only with permission. | MEDIUM | Medium | 4-8 | Written permission or anonymized project facts | Better EEAT and conversion proof. |
| 9 | Fix sitemap hygiene last: remove `<changefreq>`/`<priority>`, add accurate `<lastmod>`, verify `/admin` robots handling, then submit in GSC. | LOW | Low | 0.5-1 | Phase 3 content settled | Cleaner crawl signals, low direct ranking impact. |
| 10 | Off-site local SEO: GBP completeness, weekly posts, Q&A, review outreach, NAP citation audit. | HIGH | Ongoing | 6 initial + weekly | GBP access and owner participation | Highest local-pack lift; cannot be completed solely in repo. |

## Dependency Chain

1. Schema and crawl-visible rendering first because it uses existing structured data and does not require new owner-supplied claims.
2. Hub page and top service content next because they define the internal-link destination and voice standard.
3. Images and project modules after confirming which photos can be used for which service pages.
4. Trust/EEAT blocks after owner confirms insurance, license/permit language, and any BBB/certification status.
5. Sitemap/robots cleanup after URL/content changes settle.
6. GBP and citation work runs in parallel outside the repo.

## Blocked Inputs

- Real insurance carrier and coverage type.
- Any municipal license/permit identifiers that should appear publicly, or confirmation that no state license applies and municipal permits are handled per project.
- Owner-approved bio details beyond existing site copy.
- Written permission for named case studies/testimonials.
- PageSpeed Insights API key or permission to use local Lighthouse/Chrome for CWV-style lab checks.
- GBP access for reviews, posts, Q&A, and service area/category verification.

## Verification Gates

- `node scripts/seo-phase1-audit.mjs` regenerates `reports/audit_2026-05-12.csv` and `reports/link_graph.html`.
- `npm run build` must complete after source changes; if prerender fails for environmental port/sandbox reasons, report Vite bundle and prerender separately.
- Schema must be inspected in `dist/index.html` and representative prerendered route files after build.
- Mobile 375px render must be checked for every rewritten layout before commit.
- No invented claims: trust blocks remain generic unless owner-supplied evidence exists.
