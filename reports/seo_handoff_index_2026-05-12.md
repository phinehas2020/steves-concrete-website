# SEO Handoff Index - 2026-05-12

Purpose: quick entry point for the Concrete Waco SEO parity work driven by `goal.md`.

## Core Deliverables

| Area | Primary artifact |
| --- | --- |
| Completion audit | `reports/completion_audit_2026-05-12.md` |
| Phase 1 crawl CSV | `reports/audit_2026-05-12.csv` |
| Link graph | `reports/link_graph.html` |
| Phase 2 remediation plan | `reports/remediation_plan.md` |
| Phase 3 verification | `reports/phase3_verification_2026-05-12.md` |
| Baseline rankings | `reports/baseline_rankings.md` |
| GSC performance baseline | `reports/gsc_performance_baseline_2026-05-12.md` |
| PageSpeed verification | `reports/pagespeed_api_verification_2026-05-12.md` |
| PageSpeed tuning | `reports/pagespeed_performance_tuning_2026-05-12.md` |
| Mobile render sweep | `reports/mobile_render_sweep_2026-05-12.md` |
| Lighthouse fallback sweep | `reports/lighthouse_sweep_2026-05-12.md` |
| NAP/citation audit | `reports/nap_citation_audit_2026-05-12.md` |
| Owner/account blockers | `reports/owner_blocker_packet_2026-05-12.md` |
| GitHub issue tracking | `reports/github_issue_tracking_2026-05-12.md` |

## Tracked Issues

| Issue | Owner | Artifact |
| --- | --- | --- |
| `#3` 30-day SEO rerun | repo/account follow-up | `reports/seo_rerun_schedule_2026-05-12.md` |
| `#4` 60-day SEO rerun | repo/account follow-up | `reports/seo_rerun_schedule_2026-05-12.md` |
| `#5` 90-day SEO rerun | repo/account follow-up | `reports/seo_rerun_schedule_2026-05-12.md` |
| `#6` GSC sitemap resubmit | authenticated Google account | `reports/gsc_write_scope_runbook_2026-05-12.md` |
| `#7` trust proof | owner | `reports/owner_trust_intake_form_2026-05-12.md` |
| `#8` GBP/citation cleanup | owner/account dashboards | `reports/gbp_citation_cleanup_runbook_2026-05-12.md` |
| `#9` image GPS metadata | owner permission | `reports/image_gps_permission_form_2026-05-12.md` |
| `#10` PR workflow exception | closed; audit reconstruction completed with PRs `#11`-`#15` | `reports/service_page_pr_workflow_exception_2026-05-12.md` |

## Current State

- `main` contains the completed repo-side SEO work and the report/runbook handoff artifacts.
- The site content/schema/performance work is substantially complete.
- The goal is not complete because several remaining requirements depend on account access, owner proof, owner permission, or an explicit PR-workflow decision.

## Resume Order

1. If Google account access is available, resolve issue `#6` first using `reports/gsc_write_scope_runbook_2026-05-12.md`.
2. If owner proof is available, resolve issue `#7` before adding any insurance, BBB, credential, or named-case-study claims.
3. If GBP/citation dashboard access is available, resolve issue `#8` using `reports/gbp_citation_cleanup_runbook_2026-05-12.md`.
4. If image-location permission is available, resolve issue `#9` before writing any EXIF GPS metadata.
5. Keep PRs `#11` through `#15` as audit reconstruction artifacts; future service-page rewrites should use normal PRs before merge.
6. On the milestone dates, run issues `#3`, `#4`, and `#5`.

## Do Not Do

- Do not fabricate insurance, BBB, license, certification, testimonial, or case-study claims.
- Do not add synthetic GPS metadata without owner permission.
- Do not create no-op PRs against `main` for already-merged service-page work.
- Do not change unrelated dirty local files while finishing the SEO goal.
