# Image GPS Permission Form - 2026-05-12

Purpose: resolve GitHub issue `#9` before adding or omitting EXIF GPS metadata.

Source evidence:

- `reports/image_exif_gps_scan_2026-05-12.md`
- `reports/image_exif_gps_scan_2026-05-12.json`

Current scan result:

- `86` public images scanned
- `0` images exposed GPS latitude/longitude metadata through macOS metadata indexing

Do not add synthetic GPS metadata unless the owner approves the policy below.

## Policy Decision

- Should approximate GPS metadata be added to eligible project photos? `yes/no`
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
- Project location approved for metadata:
- Customer permission confirmed? `yes/no/not applicable`
- Exact or approximate coordinates approved:
- Privacy notes:
- Owner approval date:

## Default If Not Approved

If this form is not completed, leave image files unchanged and keep the EXIF GPS requirement marked blocked by permission/source uncertainty.

## After Decision

If approved:

- add metadata only to explicitly eligible images
- rerun GPS scan
- add a dated verification report under `reports/`
- update `reports/completion_audit_2026-05-12.md`
- close GitHub issue `#9`

If not approved:

- update `reports/completion_audit_2026-05-12.md` to record the owner decision
- close GitHub issue `#9`
