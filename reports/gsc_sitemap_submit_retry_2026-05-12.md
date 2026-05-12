# GSC Sitemap Submit Retry - 2026-05-12

Purpose: refresh the sitemap-submission evidence after the GSC MCP tool became available in-session.

## Tool checks

- `list_sites` returned `sc-domain:concretewaco.com` with permission level `siteOwner`.
- `list_sitemaps` returned the existing sitemap `https://www.concretewaco.com/sitemap.xml`.
- A second in-session retry after commit `74d5f81` produced the same read/write split: list access still worked as `siteOwner`, while `submit_sitemap` still returned `403 Insufficient Permission`.
- Existing sitemap state:
  - Last submitted: `2026-03-02T17:44:02.762Z`
  - Last downloaded: `2026-05-11T09:40:14.335Z`
  - Warnings: `0`
  - Errors: `0`
  - Submitted web URLs: `43`
  - Indexed web URLs: `0`

## Submit result

MCP attempt:

```text
siteUrl: sc-domain:concretewaco.com
feedpath: https://www.concretewaco.com/sitemap.xml
```

Result:

```text
403: Insufficient Permission
```

Second MCP retry result:

```text
403: Insufficient Permission
```

Direct Search Console API attempt with the active `gcloud auth print-access-token` token:

```text
PUT https://www.googleapis.com/webmasters/v3/sites/sc-domain%3Aconcretewaco.com/sitemaps/https%3A%2F%2Fwww.concretewaco.com%2Fsitemap.xml
```

Result:

```text
403: Request had insufficient authentication scopes.
```

Manual UI path attempt:

```text
https://search.google.com/search-console/sitemaps?resource_id=sc-domain%3Aconcretewaco.com
```

Result:

```text
The in-app browser redirected to Google sign-in for Google Search Console, so manual UI resubmission could not be completed from this unauthenticated browser session.
```

## Status

The sitemap exists in GSC and has no reported warnings or errors, but API resubmission remains blocked by OAuth scope. Manual GSC UI resubmission from an authenticated browser or a Google auth flow with Search Console write scope is still required.

Follow-up runbook:

- `reports/gsc_write_scope_runbook_2026-05-12.md`
