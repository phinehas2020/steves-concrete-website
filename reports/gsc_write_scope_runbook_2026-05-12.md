# GSC Write Scope Runbook - 2026-05-12

Purpose: unblock GitHub issue `#6` by completing the staged authenticated Search Console UI submit, or by refreshing Google auth with Search Console write scope and retrying the sitemap submit.

Official references:

- Google Search Console API `sitemaps.submit`: `https://developers.google.com/webmaster-tools/v1/sitemaps/submit`
- Google Search Console API authorization scopes: `https://developers.google.com/webmaster-tools/v1/how-tos/authorizing`

The submit endpoint requires OAuth authorization with:

```text
https://www.googleapis.com/auth/webmasters
```

Google documents that `https://www.googleapis.com/auth/webmasters` is the read/write scope, while `https://www.googleapis.com/auth/webmasters.readonly` is read-only.

## Current blocker

Known working:

- `list_sites` returns `sc-domain:concretewaco.com` with permission level `siteOwner`.
- `list_sitemaps` returns `https://www.concretewaco.com/sitemap.xml`.
- GSC reports `0` sitemap warnings and `0` sitemap errors.

Known blocked:

- MCP `submit_sitemap` returns `403 Insufficient Permission`.
- Direct API submit with the active `gcloud auth print-access-token` token returns `403 Request had insufficient authentication scopes`.
- In-app browser UI attempt redirects to Google sign-in.

Known staged:

- The normal Google Chrome profile opens the authenticated Search Console sitemaps page for `concretewaco.com`.
- The existing sitemap row is visible with status `Success`, submitted `Mar 2, 2026`, last read `May 11, 2026`, and `43` discovered pages.
- The add-sitemap field and Submit button are visible.
- The final Submit click changes account-side state and requires action-time confirmation before performing it.

## Preferred manual UI path

Use the already-authenticated normal Chrome profile if it is still available:

```text
https://search.google.com/search-console/sitemaps?resource_id=sc-domain%3Aconcretewaco.com
```

Submit:

```text
https://www.concretewaco.com/sitemap.xml
```

Record:

- new `lastSubmitted` date
- screenshot or exported sitemap details
- whether warnings/errors remain `0`

If the Chrome session is no longer authenticated, fall back to the API retry path below or sign into a Search Console owner account manually.

## API retry path

Run this only in an interactive terminal where the Google sign-in browser flow can be completed.

```sh
gcloud auth login phinehasmadams031@gmail.com \
  --update-adc \
  --scopes=https://www.googleapis.com/auth/webmasters,https://www.googleapis.com/auth/cloud-platform,openid,https://www.googleapis.com/auth/userinfo.email
```

Then retry the submit:

```sh
TOKEN="$(gcloud auth print-access-token)"

curl -i -X PUT \
  -H "Authorization: Bearer ${TOKEN}" \
  "https://www.googleapis.com/webmasters/v3/sites/sc-domain%3Aconcretewaco.com/sitemaps/https%3A%2F%2Fwww.concretewaco.com%2Fsitemap.xml"
```

Expected successful API result:

- HTTP `204 No Content` or an otherwise empty successful response body.

Then verify:

```sh
curl -s \
  -H "Authorization: Bearer ${TOKEN}" \
  "https://www.googleapis.com/webmasters/v3/sites/sc-domain%3Aconcretewaco.com/sitemaps/https%3A%2F%2Fwww.concretewaco.com%2Fsitemap.xml"
```

## After success

Update:

- `reports/gsc_sitemap_submit_retry_2026-05-12.md` or a new dated GSC retry report
- `reports/completion_audit_2026-05-12.md`
- GitHub issue `#6`
