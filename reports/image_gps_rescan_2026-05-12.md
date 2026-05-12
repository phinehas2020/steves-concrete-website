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

| Files scanned | Files with macOS latitude/longitude metadata | Files without macOS latitude/longitude metadata |
| ---: | ---: | ---: |
| 87 | 24 | 63 |

`exiftool` is not installed locally. A spot check with `sips -g gpsLatitude -g gpsLongitude` returned `<nil>` for sampled files that `mdls` showed as located, so this should be treated as macOS metadata evidence first, not final proof of normalized writable EXIF GPS tags.

## Located Groups

| Group | Located files | Sample coordinates |
| --- | ---: | --- |
| `public/blog-images/lacy-lake-view-circle-k-concrete-flatwork` | 4 | `31.63815, -97.0975195` |
| `public/blog-images/melody-grove-concrete-paving-prep` | 2 | `31.58283, -97.13390283333334` |
| `public/jobs/2024-02-13-foundation-excavation` | 12 | `31.57203666666667, -97.14776116666667` |
| `public/jobs/2024-03-27-concrete-formwork` | 4 | `31.57216666666667, -97.1474695` |
| `public/jobs/2024-04-06-concrete-slab-finishing` | 2 | `31.93646666666667, -97.43986333333334` |

## Interpretation

- The earlier `0 GPS` conclusion was incorrect for macOS metadata.
- Some public JPEG originals appear to expose project-location coordinates through Spotlight metadata.
- The newer optimized WebP client/project image set still appears to have no macOS latitude/longitude metadata.
- Because these coordinates can point near real job locations, issue `#9` is now a privacy/permission decision, not just an implementation task.

## Required Owner Decision

Before changing image metadata, the owner should decide:

1. Keep current location metadata on the located JPEG originals.
2. Strip location metadata from customer/jobsite originals for privacy.
3. Add approved approximate metadata only to selected public project photos.
4. Leave all images unchanged and document that no additional GPS metadata should be added.

If metadata changes are approved, install or use `exiftool` for final EXIF verification and rerun a dated scan after changes.
