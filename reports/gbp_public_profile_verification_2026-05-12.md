# GBP Public Profile Verification - 2026-05-12

Purpose: add read-only Google Places evidence for the Google Business Profile items in `goal.md` and GitHub issue `#8`.

## Method

Used the existing local `.env` Google Places configuration without printing the API key.

Requested fields:

```text
id, displayName, formattedAddress, nationalPhoneNumber, internationalPhoneNumber,
websiteUri, businessStatus, types, primaryType, primaryTypeDisplayName,
regularOpeningHours, googleMapsUri, rating, userRatingCount
```

Fetch time:

```text
2026-05-12T21:25:58.950Z
```

## Public GBP / Places Result

| Field | Value |
| --- | --- |
| Place ID | `ChIJzygn_NWDT4YRZPo3Wl4I2JI` |
| Name | `SLA Concrete Works` |
| Address | `1045 W Elm Mott Ln, Elm Mott, TX 76640` |
| National phone | `(254) 230-3102` |
| International phone | `+1 254-230-3102` |
| Website URI | `http://concretewaco.com/` |
| Business status | `OPERATIONAL` |
| Public primary type | `general_contractor` |
| Public primary type display | `General contractor` |
| Public types | `general_contractor`, `point_of_interest`, `service`, `establishment` |
| Rating | `5` |
| User rating count | `33` |
| Google Maps URI present | Yes |

Public opening hours returned:

```text
Monday: 8:00 AM - 6:00 PM
Tuesday: 8:00 AM - 6:00 PM
Wednesday: 8:00 AM - 6:00 PM
Thursday: 8:00 AM - 6:00 PM
Friday: 8:00 AM - 6:00 PM
Saturday: 8:00 AM - 6:00 PM
Sunday: Closed
```

## Findings

- The public profile is live and operational.
- The public NAP matches the canonical address and phone used in the site reports.
- The public website URI is `http://concretewaco.com/`, not the canonical `https://www.concretewaco.com/`. The site redirects correctly, but the GBP dashboard should be updated to the canonical URL if the account allows it.
- The public primary type is `general_contractor`, while `goal.md` calls for primary category `Concrete contractor`. The GBP dashboard should be checked because Places API public types are not always a one-to-one category export, but this is a high-priority account-side verification item.
- Rating and review count match the live Google Reviews API verification path.

## Issue `#8` Action Items

In the Google Business Profile dashboard, verify or update:

1. Primary category: prefer `Concrete contractor` if available and accurate.
2. Secondary category: keep `General contractor` only if accurate.
3. Website: use `https://www.concretewaco.com/`.
4. Hours: confirm the public Monday-Saturday `8:00 AM - 6:00 PM`, Sunday closed schedule with the owner before treating it as final.
5. Service area and services list: still require dashboard access because Places Details did not expose those fields.
