# NAP and Citation Audit - 2026-05-12

Goal source: `goal.md`, Phase 3 item 7: verify NAP consistency across the site, Google Business Profile, Yelp, BBB, Angi, chamber listing, and other major public citation sources.

## Canonical NAP to use

Use this canonical public NAP unless the owner says otherwise:

- Name: `SLA Concrete Works LLC`
- Address: `1045 W Elm Mott Ln, Elm Mott, TX 76640`
- Phone: `(254) 230-3102`
- Website: `https://www.concretewaco.com/`

Evidence:

- Google Places API lookup for `SLA Concrete Works` returned:
  - Place ID: `ChIJzygn_NWDT4YRZPo3Wl4I2JI`
  - Name: `SLA Concrete Works`
  - Formatted address: `1045 W Elm Mott Ln, Elm Mott, TX 76640, USA`
  - Phone: `(254) 230-3102` / `+1 254-230-3102`
  - Business status: `OPERATIONAL`
  - Website: `http://concretewaco.com/`
  - Coordinates: `31.6637793, -97.1123512`
- Live site schema now uses this address and phone in `LocalBusiness` structured data.

## Citation findings

| Source | Public URL | Name | Address | Phone | Website | Status | Action |
| --- | --- | --- | --- | --- | --- | --- | --- |
| Google Business Profile / Places | Google Places API / GBP maps URL in schema | `SLA Concrete Works` | `1045 W Elm Mott Ln, Elm Mott, TX 76640` | `(254) 230-3102` | `http://concretewaco.com/` | Matches canonical except name omits `LLC` and website is `http` | Consider updating GBP website to `https://www.concretewaco.com/` and name to exact legal/display name if appropriate. |
| Site schema | `https://www.concretewaco.com/concrete-driveways-waco-tx` | `SLA Concrete Works LLC` | `1045 W Elm Mott Ln, Elm Mott, TX 76640` | `+1-254-230-3102` | `https://www.concretewaco.com/` | Matches canonical | No action. |
| Greater Waco Chamber | `https://business.wacochamber.com/directory/Search/construction-engineering-surveying-312549?cid=312550` | `SLA Concrete Works, LLC` | `1045 W Elm Mott Dr, Elm Mott, TX 76640` | `(254) 230-3102` | `concretewaco.com` | Mostly matches; street suffix differs (`Dr` vs `Ln`) | Ask Chamber to change `Dr` to `Ln` if Google Places/legal mail uses `Ln`. |
| BuildZoom | `https://www.buildzoom.com/contractor/sla-concrete-works` | `Sla Concrete Works` | `1045 W ELM MOTT DR, Elm Mott, TX 76640` | Not visible in fetched page | Not visible in fetched page | Mostly matches; street suffix differs (`DR` vs `Ln`) and `LLC` omitted | Claim/update profile; correct street suffix, add canonical phone/site, and keep Texas license language conservative. |
| Porch | `https://pro.porch.com/waco-tx/general-contractors/sla-concrete-works-llc/pp` | `SLA Concrete Works, LLC` | Location shown as `Waco, TX`; no full address visible in fetched profile | Not visible in fetched profile | Not visible in fetched profile | Partial profile; rating/reviews present | Claim/update if possible; add canonical NAP and website. |
| Buzzfile | `https://www.buzzfile.com/business/Sla-Concrete-Works-LLC-254-412-2927` | `Sla Concrete Works LLC` | `757 Shady Ln, Waco, TX 76705` | `(254) 412-2927` | Not visible | Conflicts with canonical address and phone | High-priority correction or suppression. |
| Manta | `https://www.manta.com/c/mhb9pnz/sla-concrete-works-llc` | `Sla Concrete Works LLC` | `757 Shady Lane, Waco, TX 76705` | `(254) 412-2927` | Not visible | Conflicts with canonical address and phone; listing is unclaimed | Claim listing and update address, phone, website, hours, and photos. |
| Levelset | `https://www.levelset.com/subcontractors/texas/waco/concrete/sla-concrete-works/` | `SLA Concrete Works` | Search result showed `757 Shady Ln, Waco, TX 76705` | Search result showed `2542303180` | Not confirmed | Page blocked during fetch; search result indicates old address/phone | Manually verify in browser/account and request correction if the old NAP is present. |
| BBB | Public search | No exact BBB profile found for `SLA Concrete Works` | Not found | Not found | Not found | Not found | If BBB profile exists in owner account, add/correct canonical NAP; otherwise do not claim BBB accreditation on site. |
| Yelp | Public search / Yelp blocked by robots in automated fetch | No exact Yelp profile confirmed | Not confirmed | Not confirmed | Not confirmed | Not confirmed | Manually check Yelp Business dashboard/search and create/correct listing if needed. |
| Angi / HomeAdvisor | Public search | No exact Angi/HomeAdvisor profile confirmed | Not confirmed | Not confirmed | Not confirmed | Not confirmed | Manually check owner dashboard/search and create/correct listing if needed. |

## Priority cleanup list

1. Claim/update Manta because it is unclaimed and has the old `757 Shady Lane` / `(254) 412-2927` NAP.
2. Update Buzzfile because it has the old `757 Shady Ln` / `(254) 412-2927` NAP and the stale phone number is embedded in its URL.
3. Update or suppress Levelset if the old address/phone are confirmed after logging in or viewing manually.
4. Ask the Greater Waco Chamber and BuildZoom to normalize `1045 W Elm Mott Dr` to `1045 W Elm Mott Ln` if the Google Places address is the desired canonical version.
5. Claim or refresh Porch with the canonical full NAP and website.
6. Manually verify BBB, Yelp, and Angi from account dashboards; no exact public profile was confirmed from automated search.

## Notes

- The site should not add BBB, Yelp, or Angi claims until exact public profiles are verified.
- The strongest public citations currently aligned with the site are Google Places and Greater Waco Chamber.
- The biggest NAP risk is stale directory data using `757 Shady Ln, Waco, TX 76705` and `(254) 412-2927`.

