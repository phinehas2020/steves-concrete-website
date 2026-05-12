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

Authenticated Chrome profile check:

```text
https://search.google.com/search-console/sitemaps?resource_id=sc-domain%3Aconcretewaco.com
```

Result:

```text
The normal Google Chrome profile opened the Search Console sitemaps page for concretewaco.com. The existing sitemap row was visible with status Success, submitted Mar 2, 2026, last read May 11, 2026, and 43 discovered pages. The "Add a new sitemap" field and Submit button were visible.
```

Authenticated Chrome UI submit:

```text
Submitted at: 2026-05-12 16:53 CDT
Account shown in Chrome: phinehasmadams031@gmail.com
Sitemap submitted: https://www.concretewaco.com/sitemap.xml
```

Result:

```text
Sitemap submitted successfully
Google will periodically process it and look for changes. You will be notified if anything goes wrong with it in the future.
```

Post-submit table state:

```text
Sitemap: https://www.concretewaco.com/sitemap.xml
Type: Sitemap
Submitted: May 12, 2026
Last read: May 12, 2026
Status: Success
Discovered pages: 43
Discovered videos: 0
```

## Status

The sitemap exists in GSC, has no reported warnings or errors, and was manually resubmitted successfully through the authenticated normal Chrome Search Console UI on 2026-05-12. API resubmission remains blocked by OAuth scope, but it is no longer needed for issue `#6`.

Follow-up runbook:

- `reports/gsc_write_scope_runbook_2026-05-12.md`
