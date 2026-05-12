# GSC Sitemap Submit Retry - 2026-05-12

Purpose: refresh the sitemap-submission evidence after the GSC MCP tool became available in-session.

## Tool checks

- `list_sites` returned `sc-domain:concretewaco.com` with permission level `siteOwner`.
- `list_sitemaps` returned the existing sitemap `https://www.concretewaco.com/sitemap.xml`.
- Existing sitemap state:
  - Last submitted: `2026-03-02T17:44:02.762Z`
  - Last downloaded: `2026-05-11T09:40:14.335Z`
  - Warnings: `0`
  - Errors: `0`
  - Submitted web URLs: `43`
  - Indexed web URLs: `0`

## Submit result

Attempted:

```text
siteUrl: sc-domain:concretewaco.com
feedpath: https://www.concretewaco.com/sitemap.xml
```

Result:

```text
403: Insufficient Permission
```

## Status

The sitemap exists in GSC and has no reported warnings or errors, but API resubmission remains blocked. Manual GSC UI resubmission or a different API identity/scope is still required.
