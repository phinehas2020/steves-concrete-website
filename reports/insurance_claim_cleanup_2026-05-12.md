# Insurance Claim Cleanup - 2026-05-12

Goal item: insurance carrier and coverage type stated.

## What changed

Because no insurance carrier or coverage type has been provided, generic visible claims such as `Insured` and broad liability-insurance statements were softened to avoid unsupported trust claims.

Updated source:

- `src/components/Hero.jsx`
- `src/components/Footer.jsx`
- `src/components/ContactForm.jsx`
- `src/pages/TermsAndConditions.jsx`
- `src/data/seoServicePages.js`
- `scripts/prerender-routes.mjs`

## Verification

`npm run build` passed after the cleanup.

The generated/static search no longer finds these unsupported claim patterns:

- `Permit-Aware · Insured`
- `Permit-Aware & Insured`
- `properly insured`
- `industry-standard liability insurance`
- `We carry business insurance`
- `Are you insured`
- `>Insured<`

After production deployment for commit `12b80ab`, the same pattern check passed on:

- `https://www.concretewaco.com/`
- `https://www.concretewaco.com/terms-and-conditions`
- `https://www.concretewaco.com/concrete-patios-waco-tx`

Remaining insurance references are framed as questions to discuss during estimate, not as a carrier/coverage claim.

## Search snippet caveat

A follow-up web search on 2026-05-12 surfaced an apparently stale search-result snippet for `https://www.concretewaco.com/` that still referenced older license/insurance positioning. Treat that as search-index cache until recrawl, not as live copy.

Current live/source checks on 2026-05-12 found no matches for the unsupported trust-claim patterns in:

- `curl -sS https://www.concretewaco.com/`
- `curl -sS https://concretewaco.com/`
- `rg -n -i "licensed and insured|fully insured|properly insured|industry-standard liability insurance|we carry business insurance|permit-aware .*insured|>insured<|bbb accredited|bbb rated|licensed contractor" src public dist index.html`

## Remaining blocker

To complete the original insurance EEAT requirement, the owner still needs to provide:

- Carrier name
- Coverage type
- Any public wording the carrier/owner approves
- Whether the claim should appear in footer, About page, service pages, schema, or only in estimate documentation
