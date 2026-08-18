# State

_Last updated: 2026-08-18_

## In Progress

Nothing.

## Completed

| Feature | Shipped | Doc |
| --- | --- | --- |
| Personal site rebuilt on Next.js 16 | 2026-08-04 | [features/personal-site.md](./features/personal-site.md) |
| Monochrome editorial redesign | 2026-08-17 | [decisions/003](./decisions/003-monochrome-redesign.md) |
| Static export for Cloudflare Workers | 2026-08-17 | [decisions/004](./decisions/004-static-export-on-cloudflare.md) |
| Portrait moved into the label column; newsletter role and Instagram removed | 2026-08-18 | [decisions/005](./decisions/005-trim-roles-and-socials.md) |

## Verification status

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

- Not deployed yet. The Cloudflare Worker `erikgoins` builds from this repo on push; the first deploy failed before this change and has not been re-run. The `erikgoins.com` domain still points at the old static site, so a custom domain still has to be attached to the Worker.
- When the domain moves, check what the old host was doing that the Worker will not: `www` → apex, and any legacy paths. Those rules belong in `public/_redirects`. Nothing was written yet because the current DNS setup has not been inspected.
- Open question: drop React and hand-write the HTML? It would remove 178 KB of gzipped JavaScript from a page with no interactivity, at the cost of `content.ts`, the render tests, the font pipeline and the generated share card. See [decisions/004](./decisions/004-static-export-on-cloudflare.md).
- Optional: replace `card.jpg` with an OG image reflecting the new copy (the current one carries over from the old site).
