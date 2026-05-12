# Owner Blocker Packet - 2026-05-12

Purpose: turn the remaining `goal.md` blockers into concrete owner/account requests. Nothing below should be filled in by guessing; each item needs owner proof, account access, or an enabled API permission.

GitHub tracking issues:

- `#7` - `Collect owner trust proof for EEAT claims`
- `#8` - `Complete GBP and citation cleanup`
- `#9` - `Confirm image GPS metadata permissions`

Closed/completed tracking:

- `#6` - `Resolve GSC sitemap resubmission permission`; closed after authenticated Chrome Search Console UI submit
- `#10` - `Decide service-page PR workflow exception`; closed after audit reconstruction PRs `#11` through `#15`

## 1. PageSpeed Insights API - resolved

Current state:

- Earlier unauthenticated PageSpeed Insights calls returned quota errors.
- The existing key was previously blocked from `pagespeedonline.googleapis.com`.
- `pagespeedonline.googleapis.com` is now enabled on Google Cloud project `eminent-subject-478800-q2`.
- The existing `Maps Platform API Key` API-target restrictions now include `pagespeedonline.googleapis.com`.
- `reports/audit_2026-05-12.csv` now has `pagespeed_mobile_status=ok` for all 44 target rows and all 194 reference rows.

Owner/account action:

- No owner action currently needed for the PageSpeed audit snapshot.
- Keep PageSpeed API access enabled for future 30/60/90-day reruns.

Verification already completed:

```bash
npm run build
PAGESPEED_API_KEY='<enabled-key>' node scripts/seo-phase1-audit.mjs
```

Verification artifact:

- `reports/pagespeed_api_verification_2026-05-12.md`
- `reports/audit_2026-05-12.csv`

## 2. Google Search Console sitemap submit - resolved

Current state:

- GSC property `sc-domain:concretewaco.com` is accessible.
- Existing sitemap is present with zero warnings and zero errors.
- Fresh MCP `list_sites` reports `siteOwner`, but API submit still returned `403 Insufficient Permission`.
- Direct Search Console API submit with the active gcloud token returned `403` because the token has insufficient authentication scopes.
- Normal Chrome profile submitted `https://www.concretewaco.com/sitemap.xml` through the authenticated Search Console UI on 2026-05-12.
- GSC success dialog showed `Sitemap submitted successfully`.
- Post-submit table shows `Success`, submitted `May 12, 2026`, last read `May 12, 2026`, and `43` discovered pages.
- See `reports/gsc_sitemap_submit_retry_2026-05-12.md`.

Owner/account action:

- No owner/account action is currently needed for the sitemap resubmission.
- Optional future cleanup: refresh Google auth with Search Console write scope if automated API submits are desired.

Verification evidence to collect:

- Completed GSC sitemap `lastSubmitted` date: `May 12, 2026`.
- Browser evidence: authenticated Chrome success dialog and post-submit table state.

## 3. Insurance proof

Current state:

- Unsupported generic insurance claims were softened across the site.
- Carrier and coverage type are not verified.
- Intake form: `reports/owner_trust_intake_form_2026-05-12.md`

Owner input needed:

- Insurance carrier name.
- Coverage type, such as general liability, commercial auto, workers compensation, or other applicable policy.
- Whether the owner approves publishing the carrier/type on the website.

What can be restored after proof:

- A specific, narrow statement such as `General liability coverage through [Carrier]` if owner-approved and accurate.

What should stay off the site without proof:

- `licensed and insured`
- `fully insured`
- generic `Insured` badges

## 4. BBB profile or rating

Current state:

- Public search did not confirm an exact BBB profile for `SLA Concrete Works` / `SLA Concrete Works LLC`.

Owner input needed:

- BBB profile URL, if one exists.
- Whether the business is accredited.
- Current rating, if publicly visible and owner-approved.

What should stay off the site without proof:

- BBB badge
- BBB rating
- BBB accreditation claim

## 5. Credentials and certifications

Current state:

- Owner name, photo, bio, and `20+` years language are represented.
- `goal.md` names `Phinehas Adams` as owner, while current site source names Steve/Stephen and includes `Stephen Alexander, Owner`; the public owner/operator identity should be explicitly approved before any stronger owner EEAT claim is added.
- Specific certifications/credentials were not verified in repo or public source checks.
- Final owner approval for the represented bio/photo/year language should be collected in `reports/owner_trust_intake_form_2026-05-12.md`.

Owner input needed:

- Approval or correction for the public owner/operator name, owner photo, bio, and `20+` years wording already on the site.
- Any concrete, safety, supplier, municipal, equipment, or trade certifications that can be verified.
- The exact certificate/license name and issuing organization.
- Whether it is current, expired, or historical.

What should stay off the site without proof:

- certification claims
- award claims
- license-number claims that are not jurisdiction-specific

## 6. Named case studies

Current state:

- Service pages use real project-style galleries and details, but no named clients were added.

Owner input needed:

- Written permission from named clients.
- Approved project name, location, scope, photos, and any quote.
- Whether the client's full name, business name, or anonymized project label should be used.

Verification evidence:

- Keep permission outside the public repo unless the owner wants it stored elsewhere.
- Add only owner-approved public details to the site.

## 7. Google Business Profile work

Current state:

- GBP action pack is drafted in `reports/gbp_action_pack_2026-05-12.md`.
- Public GBP/Places verification is documented in `reports/gbp_public_profile_verification_2026-05-12.md`.
- No GBP dashboard changes were made from this repo session.
- Cleanup runbook: `reports/gbp_citation_cleanup_runbook_2026-05-12.md`
- Correction request templates: `reports/citation_correction_request_templates_2026-05-12.md`
- Read-only Places data confirms the public profile is operational, with address `1045 W Elm Mott Ln, Elm Mott, TX 76640`, phone `(254) 230-3102`, rating `5`, and `33` reviews.
- Read-only Places data also shows public primary type `general_contractor` / `General contractor` and website URI `http://concretewaco.com/`.

Owner/account action:

- Confirm the actual GBP dashboard primary category and switch it to `Concrete contractor` if available and accurate.
- Keep `General contractor` only as a secondary category if accurate.
- Update the website field to `https://www.concretewaco.com/` if the dashboard allows it.
- Confirm service area covers McLennan County.
- Confirm current hours; public Places data currently shows Monday-Saturday `8:00 AM - 6:00 PM`, Sunday closed.
- Publish one post per week using real project photos.
- Seed Q&A only with owner-authored answers.
- Respond to reviews within 48 hours.

Verification evidence:

- GBP dashboard screenshots or exported profile details after edits.
- Screenshot/export of primary category and website field.
- New post URLs/screenshots.
- Review response timestamps.

## 8. Citation cleanup

Current state:

- `reports/nap_citation_audit_2026-05-12.md` identifies stale public NAP risks.
- `reports/public_trust_record_audit_2026-05-12.md` adds trust-profile context.
- `reports/citation_correction_request_templates_2026-05-12.md` provides listing-specific request language for GBP, Manta, Buzzfile, Levelset, Greater Waco Chamber, BuildZoom, and Porch.

Owner/account action:

- Correct stale Manta, Buzzfile, and Levelset details first.
- Review BuildZoom and Porch details for accuracy.
- Do not add broad license/BBB/insurance claims during citation cleanup unless proof above is available.

Verification evidence:

- Updated listing URLs.
- Before/after screenshots or exported listing details.

## 9. Image GPS metadata permission

Current state:

- Corrected rescan: `reports/image_gps_rescan_2026-05-12.md`
- Permission form: `reports/image_gps_permission_form_2026-05-12.md`
- Located files manifest: `reports/image_gps_located_files_manifest_2026-05-12.md`
- The first scan incorrectly reported `0` located files because the parser mishandled `mdls -raw` NUL-separated output.
- Corrected macOS metadata rescan found `24` of `87` public image files with latitude/longitude metadata.
- `exiftool 13.55` was later installed and used in read-only mode against the same image set; it matched the corrected count at `87` total files, `24` located files, and `63` files without GPS metadata.
- Exact coordinate values are intentionally withheld from repo reports; use the filename manifest and owner permission form for the privacy decision instead of repeating jobsite/customer coordinates.

Owner/account action:

- Decide whether existing location metadata on jobsite/customer originals should be retained or stripped for privacy.
- Decide whether approved approximate GPS metadata should be added to selected project photos.
- Decide whether exact coordinates, approximate neighborhood coordinates, or canonical business/Waco-area coordinates are acceptable.
- Confirm whether residential/customer projects should be excluded.

Verification evidence:

- Completed `reports/image_gps_permission_form_2026-05-12.md`.
- Per-file retain/strip/normalize/leave-unchanged decisions from `reports/image_gps_located_files_manifest_2026-05-12.md`.
- Owner-approved policy for retaining, stripping, normalizing, adding, or leaving metadata unchanged.
- If changes are approved, rerun a dated scan with `exiftool` or equivalent EXIF tooling.
- Repeatable macOS metadata scan command: `node scripts/scan-image-gps-metadata.mjs --json=reports/image_gps_scan_YYYY-MM-DD.json --manifest=reports/image_gps_located_files_manifest_YYYY-MM-DD.md`

## 10. Louisiana licensing-record context

Current state:

- Public Louisiana State Licensing Board for Contractors records mention `SLA Concrete Works, LLC`, Waco, Texas.
- The site currently avoids broad, jurisdiction-neutral license claims.

Owner/account action:

- Confirm whether follow-up is complete.
- Decide whether any public statement is needed.
- Use legal/account-approved wording only.

What should stay off the site without approval:

- any explanation, denial, or characterization of the record beyond documented public-source facts
