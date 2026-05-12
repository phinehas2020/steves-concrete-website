# Phase 3 Verification - 2026-05-12

## Completed commits

- `aef6932` - Phase 1-2 SEO audit and remediation plan
- `5feed46` - Phase 3 add crawl-visible schema markup
- `1c736ae` - Phase 3 deepen Waco contractor hub
- `e7d6da0` - Phase 3 strengthen service internal links
- `a325b02` - Phase 3 add optimized project image set
- `ce9a79e` - Phase 3 clarify trust and permit language
- `d833913` - Phase 3 add baseline ranking report
- `d5ba11d` - Phase 3 rewrite driveway service page
- `859fd42` - Phase 3 deepen remaining service pages
- `0fa52b7` - Phase 3 add service project galleries
- `b606f33` - Phase 3 add service URL redirects
- `4b39a81` - Phase 3 clean sitemap metadata

## Verification run

- `npm run build` passed after the schema, content, image, redirect, and sitemap changes.
- Static schema check passed across `54` prerendered `index.html` files: exactly one parseable JSON-LD block and one canonical link per file.
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
- Browser smoke checks on `http://127.0.0.1:5173`:
  - Mobile viewport `375x812`: `/concrete-driveways-waco-tx`, `/concrete-patios-waco-tx`, `/waco-tx-concrete-contractor`, and `/` had no horizontal overflow and no console errors.
  - Desktop viewport `1440x900`: same route set had no horizontal overflow and no console errors.
  - Gallery section on `/concrete-driveways-waco-tx` displayed `8` images in mobile viewport.
  - Direct gallery asset requests returned `200 image/webp`.

## Known blockers and remaining work

- Google Rich Results Test was not completed against the new code because these changes are not deployed yet and the tool does not provide a stable local-code API in this workflow. Local JSON-LD parsing passed.
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

