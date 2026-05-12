# Phase 3 Verification - 2026-05-12

## Completed commits

- `7e7103c` - Phase 1-2 SEO audit and remediation plan
- `49630b5` - Phase 3 add crawl-visible schema markup
- `2faf7c6` - Phase 3 deepen Waco contractor hub
- `7973a7c` - Phase 3 strengthen service internal links
- `0bbe04a` - Phase 3 add optimized project image set
- `f6ef88f` - Phase 3 clarify trust and permit language
- `32df9ba` - Phase 3 add baseline ranking report
- `6a10f33` - Phase 3 rewrite driveway service page
- `fad7f1d` - Phase 3 deepen remaining service pages
- `cea0e5e` - Phase 3 add service project galleries
- `c1f20a2` - Phase 3 add service URL redirects
- `6828d99` - Phase 3 clean sitemap metadata
- `b677a04` - Phase 3 add verification report
- `b9f3660` - Phase 3 prevent duplicate rendered schema
- `109cd0a` - Phase 3 add organization schema recommendations
- `db53eb9` - Phase 3 remove organization rich result warnings
- `18c515b` - Phase 3 use verified business address schema

## Verification run

- `npm run build` passed after the schema, content, image, redirect, and sitemap changes.
- Git push to `origin/main` succeeded after rebasing on the newer blog commits already on `origin/main`.
- Vercel production deployment is ready:
  - Deployment: `dpl_7ufSYdKaWW1rGxY2xMmWoiyskYjD`
  - Commit: `18c515b3ed170ad097719a3064bad8290d653e27`
  - Aliases include `www.concretewaco.com` and `concretewaco.com`.
- Static schema check passed across `54` prerendered `index.html` files: exactly one parseable JSON-LD block and one canonical link per file.
- Production rendered DOM check on `https://www.concretewaco.com/concrete-driveways-waco-tx` passed:
  - `1` JSON-LD script after hydration.
  - Business schema type: `LocalBusiness`.
  - Verified Google Places address in schema: `1045 W Elm Mott Ln`, `Elm Mott`, `TX`, `76640`.
- SEO service page depth check passed across `18` service pages:
  - Minimum static word count: `1597`
  - Maximum static word count: `2473`
  - FAQ count: `10` or `11` per page
  - Project image count: `8` per page
  - Missing image alt text: `0`
- Internal linking check passed across `18` service pages:
  - Each page links to the Waco contractor hub.
  - Each page links to both current blog resources.
  - Each page includes at least `3` adjacent service links.
- Sitemap check passed:
  - `43` URLs
  - `43` `<lastmod>` entries
  - `0` `<changefreq>` entries
  - `0` `<priority>` entries
  - `/admin` remains disallowed in `robots.txt`.
- GSC check:
  - Property found: `sc-domain:concretewaco.com`
  - Existing sitemap: `https://www.concretewaco.com/sitemap.xml`
  - Last submitted: `2026-03-02T17:44:02.762Z`
  - Last downloaded: `2026-05-11T09:40:14.335Z`
  - GSC warnings: `0`
  - GSC errors: `0`
  - API sitemap submit attempt returned `403 Insufficient Permission`, so resubmission should be done from the GSC UI or after refreshing API permissions.
- Google Rich Results Test on live driveway page passed after deployment:
  - URL tested: `https://www.concretewaco.com/concrete-driveways-waco-tx`
  - Result id: `WYow_kvZWHMaxyHIYd20OA`
  - Crawled successfully on `2026-05-12 12:18:56 PM`.
  - `5` valid item groups detected.
  - Valid groups: Breadcrumbs, FAQ, Local businesses, Organization, Review snippets.
  - No non-critical issue text remained in the final result.
- PageSpeed Insights attempt on live URLs remained blocked:
  - `https://www.concretewaco.com/` returned `429` quota exceeded.
  - `https://www.concretewaco.com/concrete-driveways-waco-tx` returned `429` quota exceeded.
  - No `PAGESPEED_API_KEY` is configured in local environment.
- Browser smoke checks on `http://127.0.0.1:5173`:
  - Mobile viewport `375x812`: `/concrete-driveways-waco-tx`, `/concrete-patios-waco-tx`, `/waco-tx-concrete-contractor`, and `/` had no horizontal overflow and no console errors.
  - Desktop viewport `1440x900`: same route set had no horizontal overflow and no console errors.
  - Gallery section on `/concrete-driveways-waco-tx` displayed `8` images in mobile viewport.
  - Direct gallery asset requests returned `200 image/webp`.

## Known blockers and remaining work

- PageSpeed Insights / Core Web Vitals could not be refreshed because no `PAGESPEED_API_KEY` is configured and the unauthenticated API returned quota exceeded during the audit.
- Trust items that require owner inputs remain blocked:
  - Insurance carrier and coverage type
  - BBB rating/widget details, if applicable
  - Owner bio/photo/credentials beyond already known site copy
  - Named case studies with written customer permission
- Off-site Google Business Profile work remains manual/account-side:
  - GBP category/service-area verification
  - Weekly GBP posts
  - Q&A seeding with owner-authored answers
  - Review outreach and response workflow
- Pull requests per service-page rewrite were not opened from this local `main` branch. The current work is represented as atomic local commits.
