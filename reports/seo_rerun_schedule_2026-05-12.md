# SEO Rerun Schedule - 2026-05-12

This file turns the 30/60/90-day follow-up requirement into a concrete checklist. GitHub issues were also created as external reminders.

## Rerun dates

| Checkpoint | Date | Primary comparison window |
| --- | --- | --- |
| 30-day | 2026-06-11 | 2026-05-12 to 2026-06-10 |
| 60-day | 2026-07-11 | 2026-06-11 to 2026-07-10 |
| 90-day | 2026-08-10 | 2026-07-11 to 2026-08-09 |

## GitHub reminders

Created on 2026-05-12 in `phinehas2020/steves-concrete-website`:

- `#3` - `30-day SEO rerun - 2026-06-11`; milestone `30-day SEO rerun - 2026-06-11`, due `2026-06-11`
- `#4` - `60-day SEO rerun - 2026-07-11`; milestone `60-day SEO rerun - 2026-07-11`, due `2026-07-11`
- `#5` - `90-day SEO rerun - 2026-08-10`; milestone `90-day SEO rerun - 2026-08-10`, due `2026-08-10`

## Commands and tools to rerun

Run these from the repo root.

```sh
npm run build
npm run perf:sweep -- --json
```

Then refresh the live/account-side data:

- Google Search Console: export query/page data for USA web search.
- Semrush: refresh the same target keyword set used in `reports/baseline_rankings.md`.
- Google Business Profile: record review count, average rating, latest posts, unanswered Q&A, and profile completeness.
- Citation cleanup: recheck Manta, Buzzfile, Levelset, Chamber, BuildZoom, Porch, BBB, Yelp, Angi, and HomeAdvisor against the canonical NAP.
- PageSpeed Insights API: rerun with the existing enabled key; `pagespeedonline.googleapis.com` access was verified during the baseline pass.

## Report template

Save each rerun as `reports/seo_rerun_YYYY-MM-DD.md`.

```md
# SEO Rerun - YYYY-MM-DD

## Window

- Baseline: 2026-05-12
- Current checkpoint:
- GSC comparison range:

## Build and technical checks

- `npm run build`:
- Lighthouse sweep:
- Sitemap URL count:
- Sitemap errors/warnings in GSC:
- Canonical redirect check:

## Ranking and visibility

| Query | Baseline position | Current position | Baseline impressions/clicks | Current impressions/clicks | Note |
| --- | ---: | ---: | ---: | ---: | --- |
| concrete contractor waco tx | 2.02 |  | 566 / 2 |  |  |
| concrete contractors waco tx | 8.37 |  | 194 / 1 |  |  |
| concrete contractors near me | 7.54 |  | 135 / 2 |  |  |
| concrete waco tx | 6.83 |  | 120 / 2 |  |  |
| waco concrete contractors | 4.70 |  | 61 / 1 |  |  |

## GSC quick wins

| Query | Page | Position | Impressions | Clicks | Action |
| --- | --- | ---: | ---: | ---: | --- |

## GBP and reviews

- Review count:
- Average rating:
- Posts published since last check:
- Unanswered Q&A:
- Profile updates made:

## Citation cleanup

| Source | Current NAP status | Action needed |
| --- | --- | --- |
| Manta |  |  |
| Buzzfile |  |  |
| Levelset |  |  |
| Greater Waco Chamber |  |  |
| BuildZoom |  |  |
| Porch |  |  |
| BBB |  |  |
| Yelp |  |  |
| Angi / HomeAdvisor |  |  |

## Decisions

- Keep:
- Fix next:
- Needs owner input:
- Blocked:
```
