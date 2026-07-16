# Full-Site Content, Design & Structure Overhaul — 2026-07-16

Fine-tooth-comb pass over the whole site: de-slop the copy, fix conversion
bugs, unify the prerender pipeline, and expand coverage where GSC shows real
demand. Also serves as the ~July 15 measurement checkpoint from
`seo_optimization_2026-07-01.md`.

## GSC checkpoint (Jul 2–15 vs. July 1 baseline)

| Query | Baseline | Now | Note |
|---|---|---|---|
| concrete contractors waco tx | 2.5 | 7.1 | mix shift; local pack still #1 (pos 1.05 on non-www rows) |
| concrete contractor waco tx | 5.1 | 5.1 | flat |
| concrete contractor killeen tx | 26 | 17.8 | improved after page deepening |
| concrete contractor temple tx | 18.6 | ~20–39 | noisy, low volume |
| foundation repair waco tx | 38 | ~51 | still losing to dedicated foundation cos |
| concrete companies waco tx | 6.4–7.4 | 4.6 | improved |

**The bigger finding:** organic blue-link clicks are ~5 per 14 days — the
local pack carries the business. That reframed this pass around (a)
converting every visitor and (b) fixing why money pages underperform.

Ranked-but-unserved demand found in GSC:
- Demolition queries (pos 76–81, landing on homepage) — the demolition page
  existed but was **"Discovered – currently not indexed."**
- "short pour concrete waco tx" (pos 17.9) / "small job concrete contractors
  near me" (pos 10) — no page existed.
- Retaining-wall queries from Abbott/Aquilla/Lacy Lakeview ranking 1–3 with
  no supporting copy.

## Root causes found by the content audit

1. **Template injection**: `seoServicePages.js` auto-appended 4 identical
   sections + 6 identical FAQs to ~17 service pages (only the service name
   swapped). Likely why Google declined to index some pages.
2. **Fabricated project cards**: all 8 city pages showed the same three
   "projects" with identical fake stats ("720 sq ft · May 2025") under a
   "Concrete projects near {city}" heading.
3. **Raw search strings in prose**: "…searching for a concrete contractor
   near me, small job concrete contractors near me…" (Hewitt), quoted
   "near me" phrases in Waco intro and FAQs, keyword-as-noun intros
   ("As a commercial concrete contractor waco tx, we…").
4. **Exposed SEO scaffolding**: sports-court pages rendered a literal
   "Search trends we are targeting in Dallas, TX" keyword-chip section to
   users and crawlers.
5. **Prerender drift**: `prerender-routes.mjs` held a hand-copied duplicate
   of location content that had diverged — Google saw different text than
   users on Waco/Hewitt/Robinson/McGregor.
6. **Dead CTA bug**: "Get Free Estimate" targets `#contact`, but Contact is
   lazy-rendered — the anchor didn't exist until the user scrolled near it,
   so hero CTA clicks did nothing.

## Shipped

### Conversion / design
- **Fixed the dead `#contact` anchor** site-wide: `DeferredSection` now hosts
  the anchor id on its placeholder until the real section renders (also
  `#services`, `#faq` on the homepage).
- **Mobile sticky bottom bar** (Call / Text / Estimate) on every page via
  Header; Estimate falls back to `/#contact` on blog pages. gtag events:
  `sticky_call`, `sticky_text`, `sticky_estimate`.
- **Texting surfaced as a first-class contact path** (sms: links in bar and
  sports-court pages) — form footer now says "Call or text Stephen."
- Removed "Permit-Aware · Scope-Documented" jargon everywhere (hero, form,
  footer chips, metas, guides) in favor of plain language.
- Fixed nested-container bug where SeoServiceLanding double-wrapped Contact.

### Content (voice model: the demolition/sawing/foundation-repair pages)
- **Deleted the 17-page template injection**; pages now stand on their own
  copy. Rewrote from scratch: commercial, residential, parking lot,
  decorative, pool deck. De-keyworded intros/metas: driveways, patios,
  sidewalks, stamped, concrete-contractors (servicePages).
- **Parking lot page deepened** (85 imp, pos 15 — closest to page 1): repair
  vs full tear-out, concrete-vs-asphalt, real named jobs (Melody Grove,
  Circle K Lacy Lakeview).
- **Demolition page**: retitled "Demolition & Removal," added pricing-factor
  and recycling sections; targeted at the pos-76 homepage queries.
- **Real project references** replace fake city cards: heading now says
  "Recent work across Central Texas," cards carry honest finish/mix stats,
  and named jobs (Baylor Scott & White Hillcrest, Burnet 9,600 sq ft shop,
  Oncor Riesel walls) are cited in service copy.
- **Robinson & McGregor** went from stubs to real pages (shop slabs, RV pads,
  flat-lot drainage, rural hybrid driveways).
- **Retaining walls**: added small-town coverage section (Abbott, Aquilla,
  Lacy Lakeview, Riesel) + the real Oncor project.
- **Sports court pages differentiated** (Dallas 79 imp): honest Waco-based
  I-35 travel framing, tennis→pickleball conversion FAQs, crack-first Fort
  Worth angle. Killed the keyword-chip section.
- Blog automation tell removed ("captioned photo batches in the shared
  album").

### New page
- **`/small-concrete-jobs-waco-tx`** — targets short-pour/small-job queries;
  honest short-load-fee math, text-photos-for-quote CTA. Linked from hero
  chips, footer (auto via servicePageLinks), and related-service rotation.

### Structure
- **Prerender unification**: deleted the 461-line inline location copy from
  `prerender-routes.mjs`; it now imports `src/data/locationPages.js`. One
  source of truth — drift class eliminated. (Memory file updated.)
- Internal-link diversity: per-page rotation of planning links on service
  pages (was: same 5 links site-wide); related-services blurb humanized.

## Verification
- `npm run build` (sitemap + vite + prerender) clean; new page prerendered
  with content; sitemap (static + API function) includes it automatically.
- dist greps: 0 leftover boilerplate blocks, 0 "Search trends" leaks,
  0 raw "near me" strings, 0 "permit-aware."
- `npm run lint`: 37 errors, all pre-existing (unused motion imports,
  api/ process globals, legacy hook patterns) — none in changed code.

## Follow-ups (owner or next session)
- Request indexing in signed-in GSC UI (API is read-only) for:
  /concrete-demolition-waco-tx, /small-concrete-jobs-waco-tx,
  /parking-lot-concrete-waco, /robinson-tx-concrete-contractor,
  /mcgregor-tx-concrete-contractor, plus sitemap resubmit.
- Foundation repair (pos ~51): decide whether to compete harder (content +
  links) or reposition the page toward concrete slab repair specifically.
- GBP action pack / citation corrections / review outreach remain the
  off-site levers (unchanged from July 1 report).
- Measure ~2026-07-30: baseline queries above + new-page impressions
  (demolition, small jobs).
