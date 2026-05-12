# PageSpeed Performance Tuning - 2026-05-12

Purpose: tune the lowest-scoring target pages found after the keyed PageSpeed API audit.

## Changes

- Added `public/seo-images/sports-court-coating.webp`, converted from the existing 710 KB PNG hero to a 77 KB WebP.
- Switched `/sports-court-coating-waco-tx` to the WebP hero.
- Added eager loading, high fetch priority, dimensions, and async decoding for service-page hero images.
- Updated `/jobs` so the local project gallery renders static project data immediately instead of showing a loading placeholder while Supabase refreshes.
- Marked the first visible `/jobs` gallery image as eager/high-priority and left the rest lazy.

## Verification

- `npm run build` passed.
- Vercel production deployment `dpl_EtpwKonQziBAgQLMGZA21uivM7Fa` became ready and was aliased to `https://www.concretewaco.com`.
- Keyed PageSpeed Insights mobile checks were rerun against live production URLs.
- A later experiment to prerender project-gallery thumbnails on `/jobs` was reverted after live PSI regressed to score `74` and LCP `6527 ms`.
- The revert deployment `dpl_222AyhHpotiCNMWiowJNbhsa3TWr` became ready; direct HTTP checks on `/jobs` returned `200` quickly, while immediate post-revert PSI retries hit transient `FAILED_DOCUMENT_REQUEST` timeouts from Google.

## Before and after

| URL | Before score | After score | Before LCP | After LCP | Before CLS | After CLS |
| --- | ---: | ---: | ---: | ---: | ---: | ---: |
| `https://www.concretewaco.com/jobs` | 78 | 85 | 3619 ms | 4203 ms | 0.228433 | 0.007695 |
| `https://www.concretewaco.com/sports-court-coating-waco-tx` | 80 | 96 | 5252 ms | 2102 ms | 0 | 0 |

## Current target summary

- Target URLs with PageSpeed status ok: `44/44`
- Target mobile score range: `85-100`
- Worst target LCP: `4203 ms`
- Worst target CLS: `0.007695`

## Notes

- `/jobs` still has the slowest target LCP, but the poor CLS was fixed and the mobile score improved.
- The sports-court service page moved out of the low-score bucket after the hero image conversion.
- Keep the reverted prerender-gallery approach out unless it is redesigned with smaller thumbnails or a different critical-render path.
