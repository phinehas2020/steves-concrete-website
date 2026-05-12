# Service Page PR Workflow Exception - 2026-05-12

Goal source: `goal.md`, output format: `Phase 3: One commit per task. Tag commits with phase number. Pull request per service page rewrite.`

## Current state

- The Phase 3 service-page work was already committed and pushed directly to `main`.
- GitHub currently shows no service-page rewrite pull requests.
- Existing pull requests found by `gh pr list --state all --limit 20`:
  - `#2` `Set up Vercel Web Analytics integration` - merged
  - `#1` `Add SEO + GEO Content Strategy Guide` - open
- The service-page rewrite history is still auditable through atomic commits on `main`, especially:
  - `6a10f33` - Phase 3 rewrite driveway service page
  - `fad7f1d` - Phase 3 deepen remaining service pages
  - `cea0e5e` - Phase 3 add service project galleries
  - `7f49224` - Phase 3 improve hardscape quick win pages
  - `cac277b` - Phase 3 improve Hewitt Woodway location pages

## Why this is not being backfilled automatically

Creating empty or no-op pull requests after the work is already merged would satisfy the letter of the checklist while reducing review quality. It would not provide a real before/after diff for each service page, and it could confuse future audit history.

## Honest resolution options

1. Accept direct-to-main history for this SEO push and keep this exception report with the completion audit.
2. For future service-page rewrites, branch per page or per tightly related page pair before editing, then open one PR with:
   - target URL and keyword intent
   - changed source files
   - word-count, FAQ, schema, link, image, and mobile-render verification
   - before/after PageSpeed or GSC note if available
3. If strict PR evidence is still required for this completed batch, recreate branches from pre-change commits and cherry-pick each rewrite into review branches. This is possible, but it should be treated as audit reconstruction work, not normal development.

## Recommended policy going forward

- Use one PR for a single primary service page when the page is being substantially rewritten.
- Use one PR for a small related cluster only when the pages share the same template/data edit and can be reviewed together.
- Do not merge a service-page PR until these checks are attached:
  - `npm run build`
  - static word count and FAQ count for the touched page
  - JSON-LD parse check for the touched route
  - mobile render check at `375x812`
  - internal-link check for hub, adjacent services, and blog links

## Completion impact

This report does not mark the original PR-per-service-page requirement complete. It documents the exception and gives the next repeatable workflow so future rewrites can satisfy the requirement without fake backfill.
