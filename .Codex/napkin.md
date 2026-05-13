# Napkin

## Corrections
| Date | Source | What Went Wrong | What To Do Instead |
|------|--------|----------------|-------------------|
| 2026-04-01 | self | `motion` from `motion/react` was flagged as unused by ESLint in this repo even though the JSX used it. | Alias it as `Motion` and use `Motion.div` / `Motion.article` so the linter recognizes the references cleanly. |
| 2026-04-01 | self | Used `mktemp` with a macOS-incompatible suffix template while converting Steve's HEIC photo for inspection. | On this machine, create a plain temp path or explicit output filename before running `sips`. |
| 2026-04-01 | self | Dropped live Google review author/meta text directly into a flex row on the reviews page, which would have laid out the name and metadata side-by-side instead of stacked. | Wrap live review author name and metadata in an inner column div before rendering the optional avatar beside them. |

## User Preferences
- When the user explicitly asks for subagents, split the work into clearly owned parallel tasks instead of doing everything serially.

## Patterns That Work
- Start by searching the React data files and shared components for service names before editing page copy; service terminology is centralized in this repo.
- In this repo, `seoServicePages` and `seoServiceSlugs` need to stay aligned because build-time sitemap and prerender generation depend on the slug list.
- Legacy SEO service URLs can stay alive as redirects by keeping the old slug only in `seoServiceSlugs`; removing it from `seoServicePages` keeps it out of navigation, sitemaps, and generated page content.
- For Google Business reviews, keep the Places API key server-side in `api/google-reviews.js` and let the React components fall back to local testimonials when `GOOGLE_PLACE_ID` / `GOOGLE_PLACE_QUERY` is not configured yet.
- When a homepage section graduates into its own marketing page, update all three layers together: React router/page component, header/footer links, and the build-time sitemap/prerender scripts.

## Patterns That Don't Work
- Assuming a repo already has a napkin file. Create `.Codex/napkin.md` immediately when it's missing.
- Treating `npm run lint` as a change-specific verifier in this repo. The lint baseline currently fails in unrelated admin, API, and existing hook-pattern files, so use the production build for integration verification unless you are fixing the lint backlog.

## Domain Notes
- This is Steve's concrete company website. Current requested content changes from the owner are: remove House Leveling, add Concrete Demolition and Concrete Sawing, and use Steve's photo on the About page for now.
