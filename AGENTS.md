<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

# erikgoins.com

Erik Goins' personal one-page site: a single static Next.js route with bio, portfolio, mobile apps, speaking, and social links. Monochrome editorial design, light and dark. No backend, no database, no auth.

## Commands

```
npm run dev        # local dev server (Turbopack)
npm run build      # production build
npm run start      # serve the production build
npm run lint       # ESLint (eslint-config-next)
npm run test       # Vitest render tests
npx tsc --noEmit   # typecheck
```

## Codebase map

```
app/
  content.ts               single source of truth for all copy and links
  layout.tsx               fonts, metadata, viewport colour-scheme hint
  page.tsx                 the entire page: hanging-label grid, Section, LinkRow
  globals.css              design tokens, @layer base elements, label/photo utilities
  opengraph-image.tsx      generated 1200x630 share card
  components/
    SpeakingPhoto.tsx      renders the conference photo only if the file exists in /public
    PodcastRow.tsx         podcast row: artwork, episode title, show name, duration
assets/
  InstrumentSerif-Regular.ttf   vendored for the share card only (Satori cannot use next/font)
public/images/
  erik-goins.jpg           avatar
  speaking-flutterflow-2026.jpg
  podcast-*.jpg            episode artwork mirrored from Apple
tests/page.test.tsx        asserts every section, link and href
docs/                      INDEX.md, STATE.md, features/, decisions/
```

## Design

Monochrome: five tokens (`--bg`, `--fg`, `--muted`, `--rule`, `--hover`) in `globals.css`, one neutral ramp, no hue. Dark mode is a straight inversion of the same five. Instrument Serif for the name only; Inter everywhere else. One hanging-label grid (`7rem` label + content) shared by masthead, sections and footer. Images are grayscale; podcast artwork returns to colour on hover. Full rationale in `docs/decisions/003-monochrome-redesign.md`.

## Editing content

Change `app/content.ts` — nothing else. Adding a link there adds it to the page and to the test's coverage automatically.

## Environment variables

None. There is no `.env` file and none is needed.

## Gotchas

- `app/components/SpeakingPhoto.tsx` does a server-side `existsSync` check so a missing photo degrades to a caption instead of a broken image. Do not convert it to a static import — that would fail the build when the file is absent.
- **Do not add height or overflow utilities to `<html>` or `<body>`** — that makes body a nested scroll container. `overflow-x` lives on `<html>` because setting overflow on one axis forces the other to compute as `auto`.
- Element styles in `globals.css` must stay inside `@layer base`, or they will outrank every Tailwind utility. This already broke `no-underline` once; any hover override of a `@utility` has the same hazard, so verify from computed styles rather than by eye.
- **The share card has no static fallback.** If `opengraph-image.tsx` fails, the site has no OG image at all. Check `og:image` in the built HTML after touching it.
- Podcast artwork is mirrored into `public/images/`, not hotlinked from Apple.
- Mobile apps are intentionally plain text: no public URLs have been provided for them.
- **iCloud Drive breaks tooling here.** This directory is under `~/Documents`, which iCloud syncs; Node hits `ETIMEDOUT` reading `node_modules`, killing `vitest` and slowing `next build` from ~3s to 5+ minutes. See the environment note in `docs/STATE.md`. If a test or build fails with `ETIMEDOUT`, it is the filesystem, not the code.
