# GSC Write Scope Runbook - 2026-05-12

Purpose: document how GitHub issue `#6` was unblocked by completing the authenticated Search Console UI submit, and preserve the API write-scope fallback for future sitemap submissions.

Official references:

- Google Search Console API `sitemaps.submit`: `https://developers.google.com/webmaster-tools/v1/sitemaps/submit`
- Google Search Console API authorization scopes: `https://developers.google.com/webmaster-tools/v1/how-tos/authorizing`

The submit endpoint requires OAuth authorization with:

```text
https://www.googleapis.com/auth/webmasters
```

Google documents that `https://www.googleapis.com/auth/webmasters` is the read/write scope, while `https://www.googleapis.com/auth/webmasters.readonly` is read-only.

## Final result

- Authenticated normal Chrome Search Console UI submitted `https://www.concretewaco.com/sitemap.xml` on 2026-05-12.
- Success dialog text: `Sitemap submitted successfully`.
- Post-submit GSC table showed `Submitted: May 12, 2026`, `Last read: May 12, 2026`, `Status: Success`, `Discovered pages: 43`, and `Discovered videos: 0`.
- GitHub issue `#6` was closed from this evidence.

## API scope blocker preserved for reference

Known working:

- `list_sites` returns `sc-domain:concretewaco.com` with permission level `siteOwner`.
- `list_sitemaps` returns `https://www.concretewaco.com/sitemap.xml`.
- GSC reports `0` sitemap warnings and `0` sitemap errors.

Known API blocked:

- MCP `submit_sitemap` returns `403 Insufficient Permission`.
- Direct API submit with the active `gcloud auth print-access-token` token returns `403 Request had insufficient authentication scopes`.
- In-app browser UI attempt redirected to Google sign-in.

## Completed manual UI path

The already-authenticated normal Chrome profile was used:

```text
https://search.google.com/search-console/sitemaps?resource_id=sc-domain%3Aconcretewaco.com
```

Submit:

```text
https://www.concretewaco.com/sitemap.xml
```

Record:

- new `lastSubmitted` date: `May 12, 2026`
- `lastRead` date: `May 12, 2026`
- status: `Success`
- discovered pages: `43`

Use the API retry path below only for a future automation cleanup, not for current issue `#6`.

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
- GitHub issue `#6` closed
