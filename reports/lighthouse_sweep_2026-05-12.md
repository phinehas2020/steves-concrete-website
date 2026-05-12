# Lighthouse Performance Sweep - 2026-05-12

Command:

```sh
npm run perf:sweep -- --json
```

Base URL: `https://www.concretewaco.com`

Mode: Lighthouse mobile emulation, performance category only.

Thresholds from `scripts/lighthouse-sweep.mjs`:

- LCP <= `2500ms`
- TBT <= `200ms`
- CLS <= `0.1`

## Results

| Path | Status | Score | LCP | TBT | CLS |
| --- | --- | ---: | ---: | ---: | ---: |
| `/` | Pass | 95 | 2336ms | 0ms | 0 |
| `/services/concrete-foundations` | Pass | 97 | 2049ms | 0ms | 0 |
| `/services/concrete-patios` | Pass | 97 | 2079ms | 0ms | 0 |
| `/services/concrete-slabs` | Pass | 97 | 1658ms | 0ms | 0 |
| `/services/concrete-repair` | Pass | 97 | 1655ms | 0ms | 0 |
| `/services/stained-concrete` | Pass | 98 | 1633ms | 0ms | 0 |
| `/services/concrete-sealing` | Pass | 98 | 1655ms | 0ms | 0 |
| `/services/concrete-driveways` | Pass | 97 | 1853ms | 0ms | 0 |
| `/woodway-tx-concrete-contractor` | Pass | 97 | 1668ms | 0ms | 0 |
| `/waco-tx-concrete-contractor` | Pass | 98 | 1662ms | 0ms | 0 |

## Notes

- This is a local Lighthouse lab sweep, not a PageSpeed Insights API result.
- The PageSpeed Insights API remained blocked:
  - Unauthenticated calls previously returned quota errors.
  - The existing Google Places API key returned `API_KEY_SERVICE_BLOCKED` for `pagespeedonline.googleapis.com`.
- Use this report as supporting performance evidence only; the `goal.md` PageSpeed/API requirement remains blocked until a key with PageSpeed Insights API access is provided.

