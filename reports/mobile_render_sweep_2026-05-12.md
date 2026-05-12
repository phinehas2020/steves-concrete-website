# Mobile Render Sweep - 2026-05-12

Command:

```sh
node scripts/mobile-render-sweep.mjs --output=reports/mobile_render_sweep_2026-05-12.json
```

Scope: all `43` URLs in `public/sitemap.xml`.

Viewport: `375x812`, mobile user agent, Chrome headless via DevTools Protocol.

Checks per URL:

- HTTP document status is `2xx` or `3xx`.
- No page-level horizontal overflow.
- No visible, user-facing element extends outside the viewport at sampled scroll positions.
- No console errors.
- No page/runtime errors.

## Result

| URLs checked | Passed | Failed |
| ---: | ---: | ---: |
| 43 | 43 | 0 |

Evidence JSON: `reports/mobile_render_sweep_2026-05-12.json`

## Notes

- The verifier samples top, middle, and bottom scroll positions.
- It ignores intentionally hidden or non-user-facing elements such as `aria-hidden` honeypots and pointer-events-disabled decorative layers.
- This replaces the earlier representative-route mobile smoke check with full sitemap coverage for the current production URL set.

