# Image EXIF GPS Scan - 2026-05-12

Correction: this first-pass report is superseded by `reports/image_gps_rescan_2026-05-12.md`. The original JSON parser mishandled `mdls -raw` NUL-separated output and incorrectly counted `0` located files. The corrected rescan and follow-up `exiftool` verification found `24` files with latitude/longitude metadata out of `87` scanned files.

Goal item: add EXIF GPS to Waco coordinates where photo permits.

Tracking issue: `#9` - `Confirm image GPS metadata permissions`

Permission form: `reports/image_gps_permission_form_2026-05-12.md`

## Scope

Scanned image files under:

- `public/jobs`
- `public/blog-images`
- `public/images`
- `public/seo-images`

File extensions scanned: `.jpg`, `.jpeg`, `.webp`, `.png`

Evidence JSON: `reports/image_exif_gps_scan_2026-05-12.json`

Privacy note: the current JSON artifact is sanitized. It preserves summary counts and links to the corrected report/manifest, but does not retain the raw coordinate values that appeared in the superseded first-pass output.

## Original Result

| Files scanned | Files with GPS latitude/longitude metadata |
| ---: | ---: |
| 86 | 0 |

Tooling: macOS `mdls` metadata fields `kMDItemLatitude` and `kMDItemLongitude`.

## Original Conclusion

This original conclusion was incorrect. The current evidence is in `reports/image_gps_rescan_2026-05-12.md` and the no-coordinate located-file manifest is `reports/image_gps_located_files_manifest_2026-05-12.md`.

Do not add synthetic GPS metadata until the owner confirms:

- The photo was taken at or near the project location being represented.
- Publishing approximate GPS metadata is acceptable for that project/customer.
- Whether the GPS should be exact, approximate Waco/Elm Mott coordinates, or omitted for privacy.

Until that policy is confirmed, the EXIF GPS requirement remains blocked by permission/source uncertainty rather than implementation.
