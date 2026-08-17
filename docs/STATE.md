# State

_Last updated: 2026-08-17_

## In Progress

Nothing.

## Completed

| Feature | Shipped | Doc |
| --- | --- | --- |
| Personal site rebuilt on Next.js 16 | 2026-08-04 | [features/personal-site.md](./features/personal-site.md) |
| Monochrome editorial redesign | 2026-08-17 | [decisions/003](./decisions/003-monochrome-redesign.md) |

## Verification status

Verified on 2026-08-17 after the redesign: `vitest run` 9/9 passing, `eslint .` exits 0, `next build` succeeds with `/` and `/opengraph-image` both prerendered as static.

Checked in a real browser across desktop and mobile widths in both colour schemes: dark mode inverts with no light gutter; mobile reflows with no horizontal overflow. Hover states were read from computed styles rather than judged by eye — podcast artwork goes `grayscale(1) contrast(1.02)` → `none`, the row picks up `--hover`, and the title underline goes to `--fg`. The generated share card serves 200 `image/png` at 1200×630 and is referenced by `og:image` in the built HTML.

These were run from a copy of the project outside `~/Documents` — see the environment note below.

## Environment: iCloud Drive blocks tooling here

This project lives under `~/Documents`, which is synced by iCloud Drive. Node's `readFileSync` intermittently fails with `ETIMEDOUT` against `node_modules`, which kills `vitest` outright and inflates `next build` from ~3 seconds to over 5 minutes.

Fix (user's call): either exclude this directory from iCloud sync, or move the repo to a non-synced path such as `~/Development/erikgoins.com`. Until then, local `npm run test` / `npm run build` may fail for reasons unrelated to the code.

## Backlog

- Not deployed. The Vercel project has not been created or linked, and the `erikgoins.com` domain still points at the old static site.
- Optional: replace `card.jpg` with an OG image reflecting the new copy (the current one carries over from the old site).
