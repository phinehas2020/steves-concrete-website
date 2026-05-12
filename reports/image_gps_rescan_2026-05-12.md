# Image GPS Rescan - 2026-05-12

Purpose: correct the earlier image GPS evidence for GitHub issue `#9`.

## Why This Exists

The first scan report said `0` images exposed GPS. While reviewing the evidence JSON, several entries contained coordinate-looking values even though `hasGps` was false. A focused rescan showed the earlier JSON parser mishandled `mdls -raw` output, which separates latitude and longitude with a NUL byte instead of a newline.

This report supersedes the GPS count in:

- `reports/image_exif_gps_scan_2026-05-12.md`
- `reports/image_exif_gps_scan_2026-05-12.json`

## Corrected Result

Tooling:

```text
mdls -raw -name kMDItemLatitude -name kMDItemLongitude
```

Correct parsing: split raw output on the NUL separator.

Reusable scanner added after this correction:

```bash
node scripts/scan-image-gps-metadata.mjs --json=reports/image_gps_scan_YYYY-MM-DD.json --manifest=reports/image_gps_located_files_manifest_YYYY-MM-DD.md
```

Verification after adding the reusable scanner:

```bash
npx eslint scripts/scan-image-gps-metadata.mjs
node scripts/scan-image-gps-metadata.mjs --json=/tmp/steves-image-gps-scan.json --manifest=/tmp/steves-image-gps-manifest.md
```

Result: ESLint passed; script output was `87` total, `24` located, `63` not located.

| Files scanned | Files with macOS latitude/longitude metadata | Files without macOS latitude/longitude metadata |
| ---: | ---: | ---: |
| 87 | 24 | 63 |

Follow-up EXIF verification:

```bash
exiftool -ver
find public/blog-images public/images public/jobs public/seo-images -type f \( -iname '*.jpg' -o -iname '*.jpeg' -o -iname '*.webp' -o -iname '*.png' \) -print0 | xargs -0 exiftool -n -csv -GPSLatitude -GPSLongitude > /tmp/steves-exiftool-gps.csv
awk -F, 'NR==1 {next} {total++} $2 != "" && $3 != "" {located++} END {printf "total=%d located=%d notLocated=%d\n", total, located+0, total-(located+0)}' /tmp/steves-exiftool-gps.csv
```

Result: `exiftool` `13.55` matched the corrected count: `87` total, `24` located, `63` not located. The scan emitted one warning for an empty JPEG placeholder (`public/jobs/2024-04-06-concrete-slab-finishing-3.jpeg`) but still read all `87` image paths. The coordinate CSV was kept in `/tmp` and intentionally not committed.

## Located Groups

| Group | Located files | Coordinate handling |
| --- | ---: | --- |
| `public/blog-images/lacy-lake-view-circle-k-concrete-flatwork` | 4 | Withheld from this report |
| `public/blog-images/melody-grove-concrete-paving-prep` | 2 | Withheld from this report |
| `public/jobs/2024-02-13-foundation-excavation` | 12 | Withheld from this report |
| `public/jobs/2024-03-27-concrete-formwork` | 4 | Withheld from this report |
| `public/jobs/2024-04-06-concrete-slab-finishing` | 2 | Withheld from this report |

## Interpretation

- The earlier `0 GPS` conclusion was incorrect.
- Some public JPEG originals expose project-location GPS metadata.
- The newer optimized WebP client/project image set still appears to have no macOS latitude/longitude metadata.
- Because these coordinates can point near real job locations, issue `#9` is now a privacy/permission decision, not just an implementation task.

## Required Owner Decision

Before changing image metadata, the owner should decide:

1. Keep current location metadata on the located JPEG originals.
2. Strip location metadata from customer/jobsite originals for privacy.
3. Add approved approximate metadata only to selected public project photos.
4. Leave all images unchanged and document that no additional GPS metadata should be added.

If metadata changes are approved, use `exiftool` for final EXIF verification and rerun a dated scan after changes.
