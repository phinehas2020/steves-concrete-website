# GBP Dashboard Access Check - 2026-05-12

Purpose: add read-only dashboard evidence for GitHub issue `#8`. No Google Business Profile fields were changed.

## Method

Opened the normal Chrome profile to:

```text
https://business.google.com/locations
```

Observed signed-in account:

```text
phinehasmadams031@gmail.com
```

## Dashboard Evidence

The Business Profile Manager locations table loaded and showed:

```text
8 businesses
88% verified
```

The table included:

| Business | Address / service area shown | Status | Visible controls |
| --- | --- | --- | --- |
| `SLA Concrete Works` | `1045 W Elm Mott Ln, Elm Mott, TX 76640` | `Verified` | Edit business information, Add photo, Create post, See your profile |

## Interpretation

- The Google account used for the check appears to have dashboard access to `SLA Concrete Works`.
- The profile is verified in Business Profile Manager, not just visible through public Places data.
- Account-side edits still require explicit approval because changes to category, website, services, hours, posts, Q&A, photos, or profile data are externally visible.
- No dashboard fields were opened deeply enough to confirm the private primary category, service area, services list, website field, hours field, or Q&A state.

## Remaining Issue `#8` Actions

With explicit approval, the next dashboard pass should verify or update:

1. Primary category: `Concrete contractor`, if available and accurate.
2. Secondary category: keep `General contractor` only if accurate.
3. Website: `https://www.concretewaco.com/`.
4. Service area: McLennan County.
5. Hours: owner-confirmed current hours.
6. Services list: active concrete services reflected on the site.
7. GBP posts: real project photos only.
8. Q&A: owner-authored answers only.

Before/after screenshots or exports should be saved for any account-side edits.
