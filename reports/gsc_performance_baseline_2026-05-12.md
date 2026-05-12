# Google Search Console Performance Baseline - 2026-05-12

Data source: Google Search Console property `sc-domain:concretewaco.com`.

Date range: 2026-02-11 through 2026-05-10, web search, USA only.

## Summary

| Segment | Clicks | Impressions | CTR | Avg position |
| --- | ---: | ---: | ---: | ---: |
| Desktop | 70 | 8,168 | 0.86% | 5.83 |
| Mobile | 54 | 2,406 | 2.24% | 10.16 |
| Tablet | 3 | 42 | 7.14% | 7.67 |
| Total | 127 | 10,616 | 1.20% | 6.83 |

## Top query snapshot

| Query | Clicks | Impressions | CTR | Avg position | Note |
| --- | ---: | ---: | ---: | ---: | --- |
| `concrete contractor waco tx` | 2 | 566 | 0.35% | 2.02 | Strong position, weak CTR; monitor title/meta and local pack behavior. |
| `concrete companies near me` | 1 | 283 | 0.35% | 1.71 | Strong position, weak CTR; likely map/local intent. |
| `concrete companies` | 1 | 260 | 0.38% | 1.18 | Broad query; high impressions but low qualified intent. |
| `concrete contractors waco tx` | 1 | 194 | 0.52% | 8.37 | Good near-term CTR/ranking opportunity. |
| `concrete contractors near me` | 2 | 135 | 1.48% | 7.54 | Local intent; opportunity to improve GBP/citations. |
| `concrete waco tx` | 2 | 120 | 1.67% | 6.83 | Solid local opportunity. |
| `best concrete contractor waco` | 0 | 99 | 0.00% | 1.00 | High ranking but no clicks; SERP likely local-pack/list style. |
| `affordable concrete contractor waco` | 0 | 98 | 0.00% | 1.00 | High ranking but no clicks; avoid overclaiming price. |
| `concrete waco` | 4 | 65 | 6.15% | 5.69 | Existing winner. |
| `waco concrete contractors` | 1 | 61 | 1.64% | 4.70 | Good money query to track. |

## Page snapshot

| Page | Clicks | Impressions | CTR | Avg position | Note |
| --- | ---: | ---: | ---: | ---: | --- |
| `http://concretewaco.com/` | 31 | 5,239 | 0.59% | 1.71 | Historical HTTP/non-www rows still dominate impressions. |
| `https://www.concretewaco.com/` | 8 | 878 | 0.91% | 14.65 | Current canonical homepage is still accruing page-2 rows. |
| `/killeen-tx-concrete-contractor` | 0 | 227 | 0.00% | 28.28 | Impression volume, weak rank. |
| `/sports-court-coating/dallas-tx` | 0 | 217 | 0.00% | 11.61 | Page-2 sports court opportunity outside Waco. |
| `/hewitt-tx-concrete-contractor` | 0 | 205 | 0.00% | 12.57 | Local service-area opportunity. |
| `/sports-court-coating/fort-worth-tx` | 0 | 190 | 0.00% | 9.61 | Near page-1 sports court opportunity. |
| `/retaining-walls-waco-tx` | 0 | 162 | 0.00% | 11.67 | Good candidate for next service deepening/internal-link push. |
| `/hardscaping-waco-tx` | 0 | 139 | 0.00% | 14.04 | Good candidate for next service deepening/internal-link push. |
| `/woodway-tx-concrete-contractor` | 0 | 128 | 0.00% | 14.63 | Local service-area opportunity. |
| `/house-leveling-waco-tx` | 1 | 57 | 1.75% | 14.07 | Some clicks, but still page 2. |

## Quick-win queries from GSC

These rows have at least 10 impressions, average position 4-20, and low CTR.

| Query | Page | Impressions | Clicks | Avg position | Current CTR |
| --- | --- | ---: | ---: | ---: | ---: |
| `concrete contractor waco tx` | `/` | 98 | 1 | 11.5 | 1.02% |
| `concrete contractors waco tx` | `/` | 86 | 0 | 13.4 | 0.00% |
| `hardscaping contractor hewitt` | `/hewitt-tx-concrete-contractor` | 71 | 0 | 14.8 | 0.00% |
| `retaining wall installation woodway` | `/woodway-tx-concrete-contractor` | 55 | 0 | 14.2 | 0.00% |
| `waco concrete` | `/` | 59 | 0 | 10.6 | 0.00% |
| `concrete waco tx` | `/` | 52 | 1 | 12.0 | 1.92% |
| `concrete contractor hewitt texas.` | `/hewitt-tx-concrete-contractor` | 41 | 0 | 8.1 | 0.00% |
| `concrete contractor waco texas.` | `/` | 35 | 0 | 13.1 | 0.00% |
| `hardscaping contractor waco` | `/hardscaping-waco-tx` | 49 | 0 | 9.6 | 0.00% |
| `retaining wall installation hewitt` | `/hewitt-tx-concrete-contractor` | 47 | 0 | 9.0 | 0.00% |
| `retaining wall installation woodway` | `/retaining-walls-waco-tx` | 33 | 0 | 8.5 | 0.00% |

## Interpretation

- Search Console confirms the site already receives meaningful visibility for the main Waco concrete terms, but CTR is low on several high-position rows. That points to SERP presentation, local pack competition, GBP strength, and review/citation trust signals rather than only page copy.
- The current `https://www` homepage has page-2 averages for several money terms, while old `http://concretewaco.com/` data still dominates historical impressions. Keep canonical/redirect checks in the 30-day rerun to confirm Google consolidates newer URLs.
- The next on-site opportunities are retaining walls, hardscaping, Hewitt, and Woodway because they show impressions in striking distance with zero clicks.
- The off-site work in `reports/nap_citation_audit_2026-05-12.md` is directly relevant to the weakest local-intent rows because local pack trust likely controls a large share of clicks.

## Canonical and redirect check

Checked live on 2026-05-12:

| URL | Result |
| --- | --- |
| `http://concretewaco.com/` | 308 to `https://concretewaco.com/` |
| `https://concretewaco.com/` | 308 to `https://www.concretewaco.com/` |
| `http://www.concretewaco.com/` | 308 to `https://www.concretewaco.com/` |
| `https://www.concretewaco.com/` | 200 |

The historical `http` rows in GSC do not appear to be caused by a current redirect failure.

## 30/60/90 rerun dates

- 30-day check: 2026-06-11
- 60-day check: 2026-07-11
- 90-day check: 2026-08-10
