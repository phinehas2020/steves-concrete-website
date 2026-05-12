# Owner Decision Packet - 2026-05-12

Purpose: collect the remaining owner/account decisions needed to finish `goal.md`. This packet only covers unresolved items; completed PageSpeed, GSC sitemap submission, schema, service content, internal linking, and audit reconstruction work are intentionally omitted.

Do not publish stronger claims, edit external listings, or change image metadata until the relevant section is approved.

## 1. Public Owner / Trust Claims

Tracking issue: `#7`

Source files:

- `reports/owner_trust_intake_form_2026-05-12.md`
- `reports/owner_eeat_verification_2026-05-12.md`
- `reports/public_trust_record_audit_2026-05-12.md`
- `reports/insurance_claim_cleanup_2026-05-12.md`

### Owner Identity To Confirm

There is a source discrepancy:

- `goal.md` names `Phinehas Adams` as owner.
- The website source names Steve/Stephen and includes `Stephen Alexander, Owner`.

Decision needed:

- Public owner/operator name to use:
- Should website schema use the same name? `yes/no`
- Owner photo approved for website use? `yes/no`
- Current bio copy approved? `yes/no`
- `20+ years` language approved? `yes/no`

### Trust Proof Needed

- Insurance carrier:
- Coverage type approved for public mention:
- BBB profile URL, if any:
- BBB accreditation/rating approved for public mention? `yes/no/not applicable`
- Current credentials/certifications:
- Named case studies or customer quotes with written permission:
- Legal/account-approved wording for Louisiana licensing-record context, if any:

Default if not approved:

- Keep current conservative Texas permit-aware wording.
- Do not add insurance carrier/type, BBB badge/rating, credentials, awards, named clients, or broad license claims.

## 2. Google Business Profile And Citations

Tracking issue: `#8`

Source files:

- `reports/gbp_public_profile_verification_2026-05-12.md`
- `reports/gbp_dashboard_access_check_2026-05-12.md`
- `reports/gbp_citation_cleanup_runbook_2026-05-12.md`
- `reports/citation_correction_request_templates_2026-05-12.md`
- `reports/nap_citation_audit_2026-05-12.md`
- `reports/gbp_action_pack_2026-05-12.md`

Canonical NAP to confirm:

```text
SLA Concrete Works LLC
1045 W Elm Mott Ln
Elm Mott, TX 76640
(254) 230-3102
https://www.concretewaco.com/
```

### GBP Dashboard Decisions

Read-only public data currently shows:

- profile operational
- rating `5`
- `33` reviews
- public website URI `http://concretewaco.com/`
- public primary type `general_contractor` / `General contractor`

Read-only dashboard check currently shows:

- `SLA Concrete Works` is present in Business Profile Manager
- status `Verified`
- address shown as `1045 W Elm Mott Ln, Elm Mott, TX 76640`
- edit/photo/post controls are visible
- no account-side fields were changed

Decision/action needed in GBP dashboard:

- Primary category should be `Concrete contractor` if available and accurate: `yes/no`
- Keep `General contractor` as secondary category if accurate: `yes/no`
- Update website to `https://www.concretewaco.com/`: `yes/no`
- Confirm service area covers McLennan County: `yes/no`
- Confirm current hours:
- Confirm services list:
- Approve GBP Q&A answers from `reports/gbp_action_pack_2026-05-12.md`: `yes/no`
- Approve weekly GBP post cadence with real project photos: `yes/no`

### Citation Cleanup Decisions

High-priority corrections:

- Buzzfile: latest public recheck still showed old `757 Shady Ln` / `(254) 412-2927`
- Manta: latest automated fetch returned Cloudflare `403`; verify manually or inside the listing/account dashboard before editing
- Levelset: search result indicated old address/phone; requires manual confirmation
- Greater Waco Chamber: `Dr` vs `Ln` street suffix
- BuildZoom: latest public recheck still showed `1045 W ELM MOTT DR`; missing visible canonical phone/site in fetched page; permit/license wording needs owner/legal approval before reuse
- Porch: partial profile; verify full NAP

Use `reports/citation_correction_request_templates_2026-05-12.md` for request text.

Evidence to save:

- before screenshot/export
- after screenshot/export
- listing URL
- moderation status
- date submitted

## 3. Image GPS / Privacy

Tracking issue: `#9`

Source files:

- `reports/image_gps_rescan_2026-05-12.md`
- `reports/image_gps_located_files_manifest_2026-05-12.md`
- `reports/image_gps_permission_form_2026-05-12.md`
- `scripts/scan-image-gps-metadata.mjs`

Current evidence:

- `87` public project/blog/gallery/SEO images scanned
- `24` expose macOS latitude/longitude metadata
- `63` do not expose macOS latitude/longitude metadata
- `exiftool 13.55` read-only verification matched the corrected count: `87` total images, `24` located, `63` without GPS metadata
- reusable scanner passed ESLint and reproduced `87 / 24 / 63`
- exact coordinates are intentionally not repeated in the owner-facing manifest

Decision needed:

- Keep existing location metadata on located JPEG originals? `yes/no`
- Strip existing location metadata from customer/jobsite originals? `yes/no`
- Add approved approximate GPS metadata to eligible project photos? `yes/no`
- If adding metadata, use:
  - exact project coordinates
  - approximate neighborhood/service-area coordinates
  - canonical business/Waco-area coordinates
- Exclude residential/customer projects? `yes/no`
- Exclude blog images? `yes/no`
- Only owner-supplied photos are eligible? `yes/no`

Default if not approved:

- Leave image files unchanged.
- Do not add synthetic coordinates.
- Do not intentionally retain or strip location metadata as a policy claim.

After approval:

```bash
node scripts/scan-image-gps-metadata.mjs --json=reports/image_gps_scan_YYYY-MM-DD.json --manifest=reports/image_gps_located_files_manifest_YYYY-MM-DD.md
```

Then update `reports/completion_audit_2026-05-12.md` and GitHub issue `#9`.
