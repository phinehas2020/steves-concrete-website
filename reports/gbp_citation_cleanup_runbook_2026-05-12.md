# GBP and Citation Cleanup Runbook - 2026-05-12

Purpose: make GitHub issue `#8` executable from the Google Business Profile and citation dashboards.

Source reports:

- `reports/gbp_action_pack_2026-05-12.md`
- `reports/gbp_public_profile_verification_2026-05-12.md`
- `reports/citation_correction_request_templates_2026-05-12.md`
- `reports/nap_citation_audit_2026-05-12.md`
- `reports/public_trust_record_audit_2026-05-12.md`
- `reports/owner_blocker_packet_2026-05-12.md`

## Canonical NAP

Use this exact public identity unless the owner provides a newer verified source:

```text
SLA Concrete Works LLC
1045 W Elm Mott Ln
Elm Mott, TX 76640
(254) 230-3102
https://www.concretewaco.com/
```

Do not add unverified license, BBB, or insurance claims while editing listings.

## Google Business Profile

Verify or update:

- Primary category: `Concrete contractor`
- Read-only Places API check on `2026-05-12` returned public primary type `general_contractor` / `General contractor`; verify the actual GBP dashboard category and switch the primary category to `Concrete contractor` if available and accurate.
- Service area: McLennan County
- Website: `https://www.concretewaco.com/`
- Read-only Places API check returned public website URI `http://concretewaco.com/`; update to the canonical HTTPS www URL if the dashboard allows it.
- Phone: use the owner-confirmed canonical phone from GBP/account records
- Hours: owner-confirmed current hours; public Places data currently shows Monday-Saturday `8:00 AM - 6:00 PM`, Sunday closed.
- Services: driveway concrete, patio concrete, stamped concrete, concrete repair, foundations/slabs, sidewalks/walkways, retaining walls/hardscaping where applicable

Publish only owner-approved Q&A answers from `reports/gbp_action_pack_2026-05-12.md`.

Post cadence:

- one post per week
- real project photo when available
- no stock photos
- no fabricated customer names or claims

Review workflow:

- request 2+ new reviews per month from real past customers
- respond to every review within 48 hours
- never script or fabricate reviews

Verification evidence:

- screenshot/export of primary category
- screenshot/export of service area
- screenshot/export of services list
- links or screenshots for published posts
- review count and average rating after update

## Citation Cleanup Priority

1. Manta: stale old address/phone risk from `reports/nap_citation_audit_2026-05-12.md`.
2. Buzzfile: stale old address/phone risk.
3. Levelset: stale old address/phone risk in public result.
4. Greater Waco Chamber: street suffix mismatch check.
5. BuildZoom: `Dr` vs `Ln` mismatch and missing canonical phone/site.
6. Porch: verify canonical NAP and avoid unverified claims.
7. BBB, Yelp, Angi/HomeAdvisor: verify whether exact owner-controlled profiles exist before adding claims.

For each listing:

- record current URL
- record before NAP
- update to canonical NAP if account access allows
- record after NAP
- save screenshot/export
- note whether the listing is pending moderation

Use `reports/citation_correction_request_templates_2026-05-12.md` for listing-specific correction language.

## Report After Cleanup

Create a dated report:

```text
reports/gbp_citation_cleanup_YYYY-MM-DD.md
```

Use this table:

```md
| Source | URL | Before NAP | After NAP | Status | Evidence |
| --- | --- | --- | --- | --- | --- |
| GBP |  |  |  |  |  |
| Manta |  |  |  |  |  |
| Buzzfile |  |  |  |  |  |
| Levelset |  |  |  |  |  |
| Greater Waco Chamber |  |  |  |  |  |
| BuildZoom |  |  |  |  |  |
| Porch |  |  |  |  |  |
| BBB |  |  |  |  |  |
| Yelp |  |  |  |  |  |
| Angi/HomeAdvisor |  |  |  |  |  |
```
