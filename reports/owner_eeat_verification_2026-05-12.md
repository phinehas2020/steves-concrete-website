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

User clarification on 2026-05-12 approved the owner/operator name already on the site. Keep the current public wording, Steve / `Stephen Alexander, Owner`, unless the owner later requests a correction. Schema owner-name alignment, owner photo/bio/years approval, and stronger EEAT claims still require separate approval or proof.

## Conclusion

The owner bio/photo portion of the EEAT requirement is already represented in source, and the public owner/operator name should remain the current site wording after the 2026-05-12 user clarification. The remaining gaps are schema-name confirmation, owner photo/bio/years approval if stronger EEAT treatment is desired, and specific verified credentials or certifications; no credential claim should be added until the owner provides exact wording and proof.
