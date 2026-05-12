# GitHub Issue Tracking - 2026-05-12

Purpose: document the GitHub issue labels and milestones now used for the remaining `goal.md` work.

## Labels

| Label | Meaning |
| --- | --- |
| `seo-rerun` | Scheduled SEO rerun checkpoint |
| `blocked-account` | Requires external account or authenticated dashboard access |
| `blocked-owner` | Requires owner input, proof, approval, or permission |
| `decision-needed` | Requires a documented owner or project decision |
| `audit-reconstruction` | Audit-only reconstruction PR; do not merge into main |

## Tracked Issues

| Issue | Title | Labels | Milestone / status |
| --- | --- | --- | --- |
| `#3` | `30-day SEO rerun - 2026-06-11` | `seo-rerun` | `30-day SEO rerun - 2026-06-11` |
| `#4` | `60-day SEO rerun - 2026-07-11` | `seo-rerun` | `60-day SEO rerun - 2026-07-11` |
| `#5` | `90-day SEO rerun - 2026-08-10` | `seo-rerun` | `90-day SEO rerun - 2026-08-10` |
| `#6` | `Resolve GSC sitemap resubmission permission` | `blocked-account`, `decision-needed` | closed after authenticated Chrome GSC UI submit on 2026-05-12 |
| `#7` | `Collect owner trust proof for EEAT claims` | `blocked-owner`, `decision-needed` | none |
| `#8` | `Complete GBP and citation cleanup` | `blocked-account`, `decision-needed` | none |
| `#9` | `Confirm image GPS metadata permissions` | `blocked-owner`, `decision-needed` | none |
| `#10` | `Decide service-page PR workflow exception` | `decision-needed` | closed after audit reconstruction PRs `#11`-`#15` were created |

## Notes

- Issues `#3` through `#5` also have dated GitHub milestones.
- Issue `#6` is closed because authenticated Chrome Search Console UI resubmission succeeded and GSC showed `Submitted: May 12, 2026`, `Last read: May 12, 2026`, `Status: Success`, and `43` discovered pages.
- Issues `#7` through `#9` remain open because they require owner proof/permission, GBP/citation dashboard work, or an explicit decision.
- Issue `#10` is closed because reconstruction PRs `#11` through `#15` now exist.
- PRs `#11` through `#15` are open audit artifacts and have the `audit-reconstruction` label.
