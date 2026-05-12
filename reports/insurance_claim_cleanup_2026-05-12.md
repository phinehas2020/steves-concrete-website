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

## Remaining blocker

To complete the original insurance EEAT requirement, the owner still needs to provide:

- Carrier name
- Coverage type
- Any public wording the carrier/owner approves
- Whether the claim should appear in footer, About page, service pages, schema, or only in estimate documentation
