# Image GPS Permission Form - 2026-05-12

Purpose: resolve GitHub issue `#9` before adding or omitting EXIF GPS metadata.

Source evidence:

- `reports/image_exif_gps_scan_2026-05-12.md`
- `reports/image_exif_gps_scan_2026-05-12.json`
- `reports/image_gps_rescan_2026-05-12.md`
- `reports/image_gps_located_files_manifest_2026-05-12.md`

Corrected scan result:

- `87` public images scanned in the corrected rescan
- `24` images exposed macOS latitude/longitude metadata
- `63` images did not expose macOS latitude/longitude metadata
- `reports/image_gps_located_files_manifest_2026-05-12.md` lists the 24 located filenames without repeating exact coordinates

Do not add, retain, normalize, or strip GPS metadata unless the owner approves the policy below.

## Policy Decision

- Should approximate GPS metadata be added to eligible project photos? `yes/no`
- Should existing GPS/location metadata on JPEG originals be retained? `yes/no`
- Should existing GPS/location metadata on customer/jobsite originals be stripped for privacy? `yes/no`
- If yes, should coordinates be:
  - exact project coordinates
  - approximate neighborhood/service-area coordinates
  - canonical business/Waco-area coordinates
- Should customer residential projects be excluded? `yes/no`
- Should blog images be excluded? `yes/no`
- Should only owner-supplied project photos be eligible? `yes/no`

## Per-Project Permission

For each photo/project group:

- Image filenames:
- Current metadata status: `located/not located/unknown`
- Project location approved for metadata:
- Customer permission confirmed? `yes/no/not applicable`
- Exact or approximate coordinates approved:
- Privacy notes:
- Owner approval date:

## Default If Not Approved

If this form is not completed, leave image files unchanged and keep the EXIF GPS requirement marked blocked by permission/source uncertainty. Because the corrected rescan found existing location metadata on some originals, leaving files unchanged may also mean leaving existing location metadata in place.

## After Decision

If approved:

- add metadata only to explicitly eligible images
- rerun GPS scan with `node scripts/scan-image-gps-metadata.mjs --json=reports/image_gps_scan_YYYY-MM-DD.json --manifest=reports/image_gps_located_files_manifest_YYYY-MM-DD.md`
- add a dated verification report under `reports/`
- update `reports/completion_audit_2026-05-12.md`
- close GitHub issue `#9`

If not approved:

- update `reports/completion_audit_2026-05-12.md` to record the owner decision
- close GitHub issue `#9`
