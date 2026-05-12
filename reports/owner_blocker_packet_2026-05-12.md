# Owner Blocker Packet - 2026-05-12

Purpose: turn the remaining `goal.md` blockers into concrete owner/account requests. Nothing below should be filled in by guessing; each item needs owner proof, account access, or an enabled API permission.

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

## 2. Google Search Console sitemap submit

Current state:

- GSC property `sc-domain:concretewaco.com` is accessible.
- Existing sitemap is present with zero warnings and zero errors.
- Fresh MCP `list_sites` reports `siteOwner`, but API submit still returned `403 Insufficient Permission`.
- See `reports/gsc_sitemap_submit_retry_2026-05-12.md`.

Owner/account action:

- In GSC, manually resubmit `https://www.concretewaco.com/sitemap.xml`, or give the API identity Owner/Full permission for sitemap submission.

Verification evidence to collect:

- GSC sitemap `lastSubmitted` date after resubmission.
- Screenshot or API result showing the submit succeeded.

## 3. Insurance proof

Current state:

- Unsupported generic insurance claims were softened across the site.
- Carrier and coverage type are not verified.

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
- Specific certifications/credentials were not verified in repo or public source checks.

Owner input needed:

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
- No GBP dashboard changes were made from this repo session.

Owner/account action:

- Confirm primary category is `Concrete contractor`.
- Confirm service area covers McLennan County.
- Publish one post per week using real project photos.
- Seed Q&A only with owner-authored answers.
- Respond to reviews within 48 hours.

Verification evidence:

- GBP dashboard screenshots or exported profile details after edits.
- New post URLs/screenshots.
- Review response timestamps.

## 8. Citation cleanup

Current state:

- `reports/nap_citation_audit_2026-05-12.md` identifies stale public NAP risks.
- `reports/public_trust_record_audit_2026-05-12.md` adds trust-profile context.

Owner/account action:

- Correct stale Manta, Buzzfile, and Levelset details first.
- Review BuildZoom and Porch details for accuracy.
- Do not add broad license/BBB/insurance claims during citation cleanup unless proof above is available.

Verification evidence:

- Updated listing URLs.
- Before/after screenshots or exported listing details.

## 9. Louisiana licensing-record context

Current state:

- Public Louisiana State Licensing Board for Contractors records mention `SLA Concrete Works, LLC`, Waco, Texas.
- The site currently avoids broad, jurisdiction-neutral license claims.

Owner/account action:

- Confirm whether follow-up is complete.
- Decide whether any public statement is needed.
- Use legal/account-approved wording only.

What should stay off the site without approval:

- any explanation, denial, or characterization of the record beyond documented public-source facts
