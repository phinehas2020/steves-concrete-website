# PageSpeed API Verification - 2026-05-12

Purpose: replace the earlier PageSpeed API blocker with keyed PageSpeed Insights evidence in `reports/audit_2026-05-12.csv`.

## Access change

- Active gcloud account: `phinehasmadams031@gmail.com`.
- Active Google Cloud project: `eminent-subject-478800-q2`.
- Enabled service: `pagespeedonline.googleapis.com`.
- Updated the existing `Maps Platform API Key` API-target restrictions by preserving the existing allowed services and adding `pagespeedonline.googleapis.com`.
- No API key value was printed or committed.

## Commands run

```bash
gcloud services enable pagespeedonline.googleapis.com --project eminent-subject-478800-q2
gcloud services enable apikeys.googleapis.com --project eminent-subject-478800-q2
node scripts/seo-phase1-audit.mjs
```

The audit command was run with `PAGESPEED_API_KEY` populated from the existing local `GOOGLE_PLACES_API_KEY` value.

## Output artifacts

- `reports/audit_2026-05-12.csv`
- `reports/link_graph.html`

## PageSpeed coverage

| Site | Rows | PageSpeed status | Score range | Worst LCP | Worst CLS |
| --- | ---: | --- | ---: | ---: | ---: |
| Concrete Waco target | 44 | 44 ok | 78-100 | 5252 ms | 0.228433 |
| Concrete Contractor NYC reference | 194 | 194 ok | 37-69 | 18696 ms | 0.130417 |

## Target pages needing later performance attention

| URL | Mobile score | LCP | CLS |
| --- | ---: | ---: | ---: |
| `https://www.concretewaco.com/jobs` | 78 | 3619 ms | 0.228433 |
| `https://www.concretewaco.com/sports-court-coating-waco-tx` | 80 | 5252 ms | 0 |
| `https://www.concretewaco.com/mcgregor-tx-concrete-contractor` | 85 | 1868 ms | 0 |

## Notes

- Initial run produced transient PSI failures on a small set of URLs while the key/service change propagated.
- Failed rows were retried with the same key, and the CSV now has `pagespeed_mobile_status=ok` for all 238 rows.
- This completes the `goal.md` PageSpeed API capture requirement for the current audit snapshot.
