# State

_Last updated: 2026-09-30_

## In Progress

- **`www` → apex redirect** — blocked. The Worker `erikgoins-www-redirect`
  (`workers/www-redirect/`) was uploaded on 2026-09-27 with no domain or route, so it
  serves nothing. Attaching `www.erikgoins.com` failed: the zone already has a DNS record
  for `www` (the one that returns 522). The API override
  (`override_existing_dns_record: true`) was refused too, with the same error: Wrangler's
  OAuth login has no DNS edit scope. Next step: delete that record in the dashboard, then run
  `npx wrangler deploy -c workers/www-redirect/wrangler.jsonc`. This Worker deploys by hand;
  Workers Builds deploys only the site Worker at the repo root.

## Completed

| Feature | Shipped | Doc |
| --- | --- | --- |
| Personal site rebuilt on Next.js 16 | 2026-08-04 | [features/personal-site.md](./features/personal-site.md) |
| Monochrome editorial redesign | 2026-08-17 | [decisions/003](./decisions/003-monochrome-redesign.md) |
| Static export for Cloudflare Workers | 2026-08-17 | [decisions/004](./decisions/004-static-export-on-cloudflare.md) |
| Portrait moved into the label column; newsletter role and Instagram removed | 2026-08-18 | [decisions/005](./decisions/005-trim-roles-and-socials.md) |
| Location timeline with a generated world map | 2026-09-16 | [features/location-timeline.md](./features/location-timeline.md) |
| Webinars in Speaking; Flywheel's YouTube channel in Elsewhere | 2026-09-27 | [decisions/007](./decisions/007-webinars-and-youtube.md) |
| Mileage summary removed from Location | 2026-09-30 | [decisions/008](./decisions/008-drop-mileage-summary.md) |
| Substack in Elsewhere and in the README | 2026-09-30 | [features/personal-site.md](./features/personal-site.md) |

## Verification status

Verified on 2026-09-30 after adding Substack, in place: `vitest run` passes 26/26,
`eslint .` and `npx tsc --noEmit` exit 0, and `next build` exits 0. `out/index.html` carries
the `erikgoins.substack.com` link in the footer, and the URL returns 200.

Verified on 2026-09-27 after adding the webinars and the YouTube link, from a copy of the
repo on local disk: `vitest run` passes 26/26, `eslint .` exits 0, and `next build` exits 0
with `/`, `/_not-found` and `/opengraph-image` all prerendered static. `npx tsc --noEmit`
exits 0 once the build has generated `.next/types`; before that it fails on the
Next-generated global `LayoutProps` in `app/layout.tsx`, which this change did not touch.

`out/index.html` carries all three `youtube.com/watch` URLs and the
`youtube.com/@FlywheelStudio` link, and `out/images/` holds the three webinar thumbnails.
The export was served with `python3 -m http.server -d out` and measured through the
DevTools protocol in headless Chrome at 375px and 1280px, light and dark. Webinar
thumbnails draw 78.2×44 from 176×99 files and podcast artwork 44×44. There is no
horizontal overflow at 375px (`scrollWidth` === `clientWidth`), and the four footer links
fit on one line. On hover, the thumbnail filter goes from `grayscale(1) contrast(1.02)` to
`none` and the row picks up `--hover`.

Verified on 2026-09-16 after adding the Location section: `vitest run` passes 24/24 and
`next build` exits 0 with `/`, `/_not-found` and `/opengraph-image` all prerendered static
(TypeScript passes inside that build) — both from a copy of the repo on local disk.
`eslint .` and `npx tsc --noEmit` exit 0 in place.

The export was served with `python3 -m http.server -d out` and read in headless Chrome in
both colour schemes. The map was checked against the geography rather than by eye: Buenos
Aires sits on the Argentine coast, Hong Kong on the South China coast, and the
Charlotte → Hong Kong leg leaves the left edge and re-enters at the right instead of
drawing a bar across the map. One land ring did draw as a bar — Fiji, which crosses the
antimeridian — and the generator now unwraps rings and draws them on both sides of the
seam. Geometry was measured through the DevTools protocol, not judged from the screenshot:
at 375px there is no horizontal overflow (`scrollWidth` === `clientWidth` === 375) and all
six timeline dots share one centre line at x=29 despite three different dot sizes.

Payload: the built HTML goes from 5 KB to 12 KB gzipped (66 KB raw), all of it the inlined
map path. Nothing else on the page changed.

Verified on 2026-08-18 after moving the portrait into the label column and trimming the
newsletter role and the Instagram link: `next build` exits 0 with `/`, `/_not-found` and
`/opengraph-image` all prerendered static (TypeScript passes inside that build), and
`eslint` exits 0 in place. `vitest run` passes 9/9 — but only from a copy of the repo on
local disk; in place it dies with `Timeout waiting for worker to respond`, the iCloud
failure described below.

The export was served with `python3 -m http.server -d out` and read in a browser. The
portrait's geometry was measured from the rendered page rather than judged by eye: its left
edge sits at the same x as every section label, and its top is 0.7px from the cap height of
"Erik Goins". Roles renders two lines and Elsewhere renders Twitter, LinkedIn and Email.

Verified on 2026-08-17 after the move to a static export, from a copy of the repo outside iCloud: `next build` exits 0 with `/`, `/_not-found` and `/opengraph-image` all prerendered static; `npx tsc --noEmit` and `eslint` exit 0; `vitest run` passes 9/9. The export was then served through `wrangler dev` — the same asset server Cloudflare runs — where `/` returns 200 `text/html`, `/opengraph-image` returns 200 `image/png`, `/_next/static/*` returns `max-age=31536000, immutable`, and an unknown path returns 404 with the exported `404.html`. The page was checked in a browser at that URL, including the re-encoded photos.

Payload on the wire: 5 KB HTML, 4.5 KB CSS, 63 KB of woff2, 232 KB of images, and 178 KB of gzipped JavaScript that only hydrates a page with no interactivity.

Verified on 2026-08-17 after the redesign: `vitest run` 9/9 passing, `eslint .` exits 0, `next build` succeeds with `/` and `/opengraph-image` both prerendered as static.

Checked in a real browser across desktop and mobile widths in both colour schemes: dark mode inverts with no light gutter; mobile reflows with no horizontal overflow. Hover states were read from computed styles rather than judged by eye — podcast artwork goes `grayscale(1) contrast(1.02)` → `none`, the row picks up `--hover`, and the title underline goes to `--fg`. The generated share card serves 200 `image/png` at 1200×630 and is referenced by `og:image` in the built HTML.

These were run from a copy of the project outside `~/Documents` — see the environment note below.

## Environment: iCloud Drive blocks tooling here

This project lives under `~/Documents`, which is synced by iCloud Drive. Node's `readFileSync` intermittently fails with `ETIMEDOUT` against `node_modules`, which kills `vitest` outright and inflates `next build` from ~3 seconds to over 5 minutes.

Fix (user's call): either exclude this directory from iCloud sync, or move the repo to a non-synced path such as `~/Development/erikgoins.com`. Until then, local `npm run test` / `npm run build` may fail for reasons unrelated to the code.

## Backlog

- `www.erikgoins.com` returns HTTP 522 (checked 2026-09-27): Cloudflare has no origin for it. Attach `www` to the Worker as a custom domain, or add a redirect rule from `www` to the apex. The apex `erikgoins.com` already serves the Worker, and Cloudflare Workers Builds deploys it on every push to `main`.
- Legacy paths from the old host were never checked. Redirects for any that matter belong in `public/_redirects`.
- Open question: drop React and hand-write the HTML? It would remove 178 KB of gzipped JavaScript from a page with no interactivity, at the cost of `content.ts`, the render tests, the font pipeline and the generated share card. See [decisions/004](./decisions/004-static-export-on-cloudflare.md).
- Optional: replace `card.jpg` with an OG image reflecting the new copy (the current one carries over from the old site).
