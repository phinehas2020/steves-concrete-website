# SEO + Design Optimization — 2026-07-01

Full-site optimization pass executed and deployed in four production rounds
(commits `884379a`, `02d0869`, `301f8c1`, `d18d614`). All items verified live
on www.concretewaco.com the same day.

## Baseline at time of deploy (GSC, June 2026)

| Query | Position | Notes |
|---|---|---|
| concrete contractors waco tx | 2.5 | primary target; 44 impressions |
| concrete contractor waco tx | 5.1 | singular variant |
| concrete companies waco (tx) | 6.4–7.4 | phrase was absent from homepage — now covered |
| concrete contractor temple tx | 18.6 | page deepened 1,017 → 1,414 words |
| concrete contractor killeen (tx) | 26 | page deepened 923 → 1,224 words |
| foundation repair waco tx | 38 | meta retargeted |

## Shipped on-site work

1. **Homepage** — title `Concrete Contractors Waco TX | SLA Concrete Works LLC`,
   description with 5-star / 500+ projects / phone CTA, "concrete companies in
   Waco TX" and "Waco, Texas" phrasing added to prerendered body.
2. **Location pages** — Temple and Killeen gained unique local sections + FAQs;
   Hewitt gained a neighborhoods section and its FAQ block is now prerendered
   (previously client-side only); Woodway gained a lots/trees section + FAQ.
   All edits made in BOTH `src/data/locationPages.js` and the duplicated copy
   in `scripts/prerender-routes.mjs`.
3. **Technical** — 11 noindexed `/services/*` duplicates now 308-redirect to
   canonical pages (vercel.json); related-links blocks rotate around the
   current page instead of repeating the same first entries.
4. **CTR metas** — /reviews (was pos 4.6, 0 clicks), /about (pos 10.3),
   /contractors-in-waco-tx (pos 4.7, 0 clicks), foundation-repair,
   /sports-court-coating/fort-worth-tx (striping query, pos 7.5).
5. **Content** — new article `/blog/repair-or-replace-cracked-concrete-driveway-waco`
   (from the plan.md backlog) with internal links to resurfacing, driveways,
   cost guide, and foundation repair pages. Live and in the sitemap.
6. **Design/accessibility** — descriptive image alts (Gallery, service heroes),
   h1→h3 heading-skip fix, honest region labeling on location project cards.

## Google notification (same day)

- Sitemap resubmitted twice via signed-in GSC UI (API token is read-only —
  returns 403 on writes). Both reads succeeded: **86 pages discovered** (up
  from 63 on the May 12 submission).
- Priority crawl ("Request indexing") confirmed for: homepage, Temple,
  Killeen, foundation-repair.

## What decides #1 from here (not code)

- **Google re-ranking latency**: days to ~2 weeks after the priority crawls.
  Do NOT re-edit titles/metas during this window — title churn resets
  evaluation and can suppress CTR gains.
- **Owner-gated off-site work** (the likely tiebreaker at position 2.5):
  - GBP action pack: `reports/gbp_action_pack_2026-05-12.md` (services,
    weekly posts, Q&A — pre-drafted, needs owner approval + photos)
  - Citation corrections: `reports/citation_correction_request_templates_2026-05-12.md`
  - Review outreach workflow (templates ready, needs owner approval)

## Measurement plan

- ~2026-07-08 and ~2026-07-15: pull GSC positions for the queries in the
  baseline table above and compare. The 60-day rerun from
  `reports/seo_rerun_schedule_2026-05-12.md` is due 2026-07-11 — combine them.
- Success gate: homepage ≤ position 1.5 for "concrete contractors waco tx";
  Temple/Killeen pages inside the top 10 for their city queries.
