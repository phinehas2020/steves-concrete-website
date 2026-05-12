# Service Page PR Reconstruction Runbook - 2026-05-12

Status: completed. The audit reconstruction path below was executed after the original direct-to-main service-page work. GitHub issue `#10` is closed, and audit PRs `#11` through `#15` now exist.

Purpose: preserve the exact reconstruction method used for GitHub issue `#10`.

This should not be treated as normal development. The service-page changes were already on `main`; the reconstruction PRs are review artifacts for audit history, not mergeable feature work.

## Outcome

Audit reconstruction PRs created:

| PR | Title | Original commit |
| --- | --- | --- |
| `#11` | `Audit reconstruction: driveway service rewrite` | `6a10f33` |
| `#12` | `Audit reconstruction: remaining service page depth pass` | `fad7f1d` |
| `#13` | `Audit reconstruction: service project galleries` | `cea0e5e` |
| `#14` | `Audit reconstruction: hardscape quick-win pages` | `7f49224` |
| `#15` | `Audit reconstruction: Hewitt and Woodway location pages` | `cac277b` |

## Recommendation

Keep the documented direct-to-main exception in `reports/service_page_pr_workflow_exception_2026-05-12.md` and keep PRs `#11` through `#15` as audit artifacts.

Do not repeat this reconstruction unless a future audit explicitly requires a different slice of already-completed work.

## Evidence commits

| Work item | Commit | Parent / audit base |
| --- | --- | --- |
| Driveway service rewrite | `6a10f33` | `32df9ba` |
| Remaining service-page depth pass | `fad7f1d` | `6a10f33` |
| Service project galleries | `cea0e5e` | `fad7f1d` |
| Hardscape quick-win pages | `7f49224` | `61079d8` |
| Hewitt/Woodway location pages | `cac277b` | `d2f59b6` |

## Reconstruction strategy used

Because `main` already contains these commits, do not create fake no-op PRs against `main`. Instead:

1. Create explicit audit base branches at the pre-change parent commits.
2. Create matching audit head branches from those bases.
3. Cherry-pick the original commit onto each head branch.
4. Open PRs from each head branch into its audit base branch.
5. Label every PR title and body as `audit reconstruction - do not merge`.

## Example commands used

Run from a clean worktree or a temporary clone/worktree.

```sh
git fetch origin main

git branch audit/base-driveway-service 32df9ba
git switch -c audit/pr-driveway-service audit/base-driveway-service
git cherry-pick 6a10f33
git push -u origin audit/base-driveway-service audit/pr-driveway-service
gh pr create \
  --base audit/base-driveway-service \
  --head audit/pr-driveway-service \
  --title "Audit reconstruction: driveway service rewrite" \
  --body "Audit reconstruction for goal.md PR-per-service-page requirement. Original direct-to-main commit: 6a10f33. Do not merge."

git switch main
git branch audit/base-service-depth 6a10f33
git switch -c audit/pr-service-depth audit/base-service-depth
git cherry-pick fad7f1d
git push -u origin audit/base-service-depth audit/pr-service-depth
gh pr create \
  --base audit/base-service-depth \
  --head audit/pr-service-depth \
  --title "Audit reconstruction: remaining service page depth pass" \
  --body "Audit reconstruction for goal.md PR-per-service-page requirement. Original direct-to-main commit: fad7f1d. Do not merge."

git switch main
git branch audit/base-service-galleries fad7f1d
git switch -c audit/pr-service-galleries audit/base-service-galleries
git cherry-pick cea0e5e
git push -u origin audit/base-service-galleries audit/pr-service-galleries
gh pr create \
  --base audit/base-service-galleries \
  --head audit/pr-service-galleries \
  --title "Audit reconstruction: service project galleries" \
  --body "Audit reconstruction for goal.md PR-per-service-page requirement. Original direct-to-main commit: cea0e5e. Do not merge."

git switch main
git branch audit/base-hardscape-quick-wins 61079d8
git switch -c audit/pr-hardscape-quick-wins audit/base-hardscape-quick-wins
git cherry-pick 7f49224
git push -u origin audit/base-hardscape-quick-wins audit/pr-hardscape-quick-wins
gh pr create \
  --base audit/base-hardscape-quick-wins \
  --head audit/pr-hardscape-quick-wins \
  --title "Audit reconstruction: hardscape quick-win pages" \
  --body "Audit reconstruction for goal.md PR-per-service-page requirement. Original direct-to-main commit: 7f49224. Do not merge."

git switch main
git branch audit/base-location-quick-wins d2f59b6
git switch -c audit/pr-location-quick-wins audit/base-location-quick-wins
git cherry-pick cac277b
git push -u origin audit/base-location-quick-wins audit/pr-location-quick-wins
gh pr create \
  --base audit/base-location-quick-wins \
  --head audit/pr-location-quick-wins \
  --title "Audit reconstruction: Hewitt and Woodway location pages" \
  --body "Audit reconstruction for goal.md PR-per-service-page requirement. Original direct-to-main commit: cac277b. Do not merge."
```

## Cleanup completed

- PR URLs are linked in `reports/service_page_pr_workflow_exception_2026-05-12.md`.
- PR references are linked in `reports/completion_audit_2026-05-12.md`.
- GitHub issue `#10` is closed.
