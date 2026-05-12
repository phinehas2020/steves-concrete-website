# Image EXIF GPS Scan - 2026-05-12

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

## Result

| Files scanned | Files with GPS latitude/longitude metadata |
| ---: | ---: |
| 86 | 0 |

Tooling: macOS `mdls` metadata fields `kMDItemLatitude` and `kMDItemLongitude`.

## Conclusion

No existing project/gallery/blog image in the scanned public asset set currently exposes GPS metadata through macOS metadata indexing.

Do not add synthetic GPS metadata until the owner confirms:

- The photo was taken at or near the project location being represented.
- Publishing approximate GPS metadata is acceptable for that project/customer.
- Whether the GPS should be exact, approximate Waco/Elm Mott coordinates, or omitted for privacy.

Until that policy is confirmed, the EXIF GPS requirement remains blocked by permission/source uncertainty rather than implementation.
