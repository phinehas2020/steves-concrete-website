# Owner EEAT Verification - 2026-05-12

Goal item: About page owner name, photo, bio, credentials, and years in trade without inventing unverifiable claims.

## Verified in source

| Requirement | Evidence | Status |
| --- | --- | --- |
| Owner name | `src/components/Values.jsx` identifies `Stephen Alexander, Owner`; `src/pages/About.jsx` and `src/components/Testimonials.jsx` use Steve/Stephen owner copy | Present |
| Owner bio | `src/pages/About.jsx`; `src/components/Values.jsx`; `src/components/Testimonials.jsx` describe Steve's estimate process, owner-run communication, prep/drainage focus, and Central Texas concrete experience | Present |
| Owner photo | `src/assets/images/steve-headshot.jpg`; imported in `src/components/Testimonials.jsx` and rendered with alt text `Steve from SLA Concrete Works LLC` | Present |
| Years in trade | `src/pages/About.jsx` states `20+` years pouring concrete around Waco; `src/components/Values.jsx` references the last 20 years | Present in current site copy |
| Credentials/certifications | No verified credential/certification source found in repo | Blocked until owner provides exact claim/source |

## Owner Identity Discrepancy

`goal.md` identifies the target-site owner as `Phinehas Adams`, while the current website source identifies the public business owner/operator as Steve/Stephen and includes `Stephen Alexander, Owner` in `src/components/Values.jsx`.

No owner-name change should be made from either source alone. The owner/trust intake should explicitly confirm which public owner/operator name is correct for the website, schema, owner bio, photo alt text, and any future EEAT claim.

## Conclusion

The owner bio/photo portion of the EEAT requirement is already represented in source, but the public owner/operator name should be explicitly approved because `goal.md` and the site source disagree. The remaining gap is specific verified credentials or certifications; no credential claim should be added until the owner provides exact wording and proof.
