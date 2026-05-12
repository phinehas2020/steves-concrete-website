# Image GPS Located Files Manifest - 2026-05-12

Purpose: support GitHub issue `#9` without repeating precise jobsite coordinates in another public report. This manifest lists files that expose latitude/longitude metadata according to the corrected scan and follow-up `exiftool` verification.

Source report:

- `reports/image_gps_rescan_2026-05-12.md`

Tooling:

```text
mdls -raw -name kMDItemLatitude -name kMDItemLongitude
exiftool 13.55 -n -csv -GPSLatitude -GPSLongitude
```

Corrected result:

| Files scanned | Located files | Not located |
| ---: | ---: | ---: |
| 87 | 24 | 63 |

## Located Files

Coordinates are intentionally omitted here. Use the local metadata scan or original photo source only if the owner approves retaining, stripping, normalizing, or adding location metadata.

| File | Owner decision |
| --- | --- |
| `public/blog-images/lacy-lake-view-circle-k-concrete-flatwork/01-a43f360c-8c37-4e38-9619-0409f1c9eda9.jpg` | retain / strip / normalize / leave unchanged |
| `public/blog-images/lacy-lake-view-circle-k-concrete-flatwork/02-af4ec122-bf4b-47c9-880c-78b1100a04f3.jpg` | retain / strip / normalize / leave unchanged |
| `public/blog-images/lacy-lake-view-circle-k-concrete-flatwork/03-fc7356f6-3af3-4c3f-a017-ad245a30d62f.jpg` | retain / strip / normalize / leave unchanged |
| `public/blog-images/lacy-lake-view-circle-k-concrete-flatwork/04-46c4b588-88df-4763-a45c-cb2740537b37.jpg` | retain / strip / normalize / leave unchanged |
| `public/blog-images/melody-grove-concrete-paving-prep/01-bf3b202e-bfc8-4345-9c93-5152dda2d1b3.jpg` | retain / strip / normalize / leave unchanged |
| `public/blog-images/melody-grove-concrete-paving-prep/03-425ca989-75c8-4eb1-a98f-c7ef9ce9f8b2.jpg` | retain / strip / normalize / leave unchanged |
| `public/jobs/2024-02-13-foundation-excavation-10.jpeg` | retain / strip / normalize / leave unchanged |
| `public/jobs/2024-02-13-foundation-excavation-11.jpeg` | retain / strip / normalize / leave unchanged |
| `public/jobs/2024-02-13-foundation-excavation-12.jpeg` | retain / strip / normalize / leave unchanged |
| `public/jobs/2024-02-13-foundation-excavation-13.jpeg` | retain / strip / normalize / leave unchanged |
| `public/jobs/2024-02-13-foundation-excavation-14.jpeg` | retain / strip / normalize / leave unchanged |
| `public/jobs/2024-02-13-foundation-excavation-15.jpeg` | retain / strip / normalize / leave unchanged |
| `public/jobs/2024-02-13-foundation-excavation-16.jpeg` | retain / strip / normalize / leave unchanged |
| `public/jobs/2024-02-13-foundation-excavation-3.jpeg` | retain / strip / normalize / leave unchanged |
| `public/jobs/2024-02-13-foundation-excavation-4.jpeg` | retain / strip / normalize / leave unchanged |
| `public/jobs/2024-02-13-foundation-excavation-5.jpeg` | retain / strip / normalize / leave unchanged |
| `public/jobs/2024-02-13-foundation-excavation-6.jpeg` | retain / strip / normalize / leave unchanged |
| `public/jobs/2024-02-13-foundation-excavation-9.jpeg` | retain / strip / normalize / leave unchanged |
| `public/jobs/2024-03-27-concrete-formwork-3.jpeg` | retain / strip / normalize / leave unchanged |
| `public/jobs/2024-03-27-concrete-formwork-4.jpeg` | retain / strip / normalize / leave unchanged |
| `public/jobs/2024-03-27-concrete-formwork-5.jpeg` | retain / strip / normalize / leave unchanged |
| `public/jobs/2024-03-27-concrete-formwork-6.jpeg` | retain / strip / normalize / leave unchanged |
| `public/jobs/2024-04-06-concrete-slab-finishing-1.jpeg` | retain / strip / normalize / leave unchanged |
| `public/jobs/2024-04-06-concrete-slab-finishing-2.jpeg` | retain / strip / normalize / leave unchanged |

## Required Decision

Before changing any file metadata, complete `reports/image_gps_permission_form_2026-05-12.md`.

Do not add synthetic coordinates. Do not strip existing location metadata unless the owner approves that privacy policy or provides a direct instruction to remove location data from public jobsite/customer originals.

After an approved decision:

1. Use `exiftool` or equivalent EXIF-aware tooling for changes and verification.
2. Rerun a dated GPS scan.
3. Update `reports/completion_audit_2026-05-12.md`.
4. Close GitHub issue `#9`.
