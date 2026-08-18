# Personal site

## What it does

Serves `erikgoins.com` as a single statically-prerendered page: name, bio, roles, portfolio companies, mobile apps, public speaking, and social links — as a monochrome editorial page that works in light and dark.

## How it works

**Architecture.** One App Router route (`app/page.tsx`), no client components, no data fetching. Fully prerendered at build time. A second static route, `app/opengraph-image.tsx`, renders the share card.

**Content model.** Every string and URL lives in `app/content.ts` and is imported by the page. Adding an entry to `portfolio`, `roles`, or `speaking.podcasts` renders it and brings it under test coverage without touching JSX.

**Key files**

| File | Role |
| --- | --- |
| `app/content.ts` | All copy and links |
| `app/layout.tsx` | Inter + Instrument Serif, `metadata`, and the `viewport` colour-scheme hint |
| `app/page.tsx` | Layout, the hanging-label grid, `Section` and `LinkRow` |
| `app/globals.css` | Design tokens, base element styles, the `label` and `photo` utilities |
| `app/components/SpeakingPhoto.tsx` | Conditional render of the conference photo |
| `app/components/PodcastRow.tsx` | Podcast row: artwork, episode title, show, duration |
| `app/opengraph-image.tsx` | Generated 1200×630 share card |
| `assets/InstrumentSerif-Regular.ttf` | Vendored for the share card only — Satori cannot use `next/font` |

## Design system

See [decisions/003](../decisions/003-monochrome-redesign.md) for why.

**Colour.** Five tokens, one neutral ramp, no hue:

| Token | Light | Dark |
| --- | --- | --- |
| `--bg` | `#ffffff` | `#0b0b0b` |
| `--fg` | `#0a0a0a` | `#f2f2f2` |
| `--muted` | `#6f6f6f` | `#8c8c8c` |
| `--rule` | `#e7e7e7` | `#222222` |
| `--hover` | `#f4f4f4` | `#151515` |

Dark mode is a straight inversion under `prefers-color-scheme`; no component carries a second set of styles. `viewport.colorScheme = "light dark"` makes the browser paint its own chrome to match.

**Type.** Instrument Serif 400 for the name only — `clamp(2.5rem, 9vw, 3.5rem)`, leading `0.95`, tracking `-0.02em`. Inter for everything else. Micro-labels are 11px uppercase, `0.16em` tracking, muted.

**Grid.** One hanging-label grid, `sm:grid-cols-[7rem_1fr]` with a `2.5rem` gutter, shared by the masthead, every section, and the footer, so labels hang in the left margin and all content shares one left edge. Below `sm` it collapses to a stack. Column caps at `40rem`.

The masthead spends its label column on the portrait rather than a label: 112px square, which is the column width exactly, so the portrait's left edge lands on the label left edge and its right edge on the gutter. `sm:mt-1` drops its top onto the cap height of the name instead of the taller line box (measured, not guessed — 0.7px off at the widths where the grid applies).

**Imagery.** The `photo` utility applies `grayscale(1) contrast(1.02)`. Podcast artwork overrides it to `none` on hover. The portrait renders a 192px source at 112px, so it stays sharp on a 2x display.

**Interaction.** Links carry a hairline underline in `--rule` that goes to `--fg` on hover. External-link arrows are hidden until hover or keyboard focus. `:focus-visible` draws a 1px outline at 3px offset.

## Hosting

`next build` runs with `output: "export"` and writes `out/` — HTML, CSS, JS, fonts, images, plus the share card and `404.html`. Cloudflare serves that folder from Workers static assets: `wrangler.jsonc` declares the Worker `erikgoins` with `assets.directory: "./out"` and no `main`, so no code runs on a request. Cloudflare's build runs `npm run build` then `npx wrangler deploy` on push. `public/_headers` carries the two response rules the export needs — `Content-Type` for the extension-less share card, and immutable caching for `/_next/static/*`. Reasoning and what this gives up: [decisions/004](../decisions/004-static-export-on-cloudflare.md).

## Data model

None. No database, no RLS, no external services.

## Testing

`tests/page.test.tsx` (Vitest + Testing Library, jsdom) renders the page and asserts the `h1` and bio, all five section headings, every role/portfolio href, that mobile apps have no anchor ancestor, every social link, the podcast card structure (artwork present with `alt=""`, show and duration in the text, real `podcasts.apple.com` hrefs), and that the conference photo exists on disk so the degraded caption-only path cannot ship unnoticed.

Playwright was deliberately skipped: no interaction, no navigation, no client JS. Design-level properties — the token inversion, hover states, the grid — were verified in a real browser instead, from computed styles rather than by eye.

## Gotchas

- **Never put height or overflow utilities on `<html>` or `<body>`.** The scaffold shipped `h-full` / `min-h-full`; combined with `overflow-x: hidden` that made body a nested scroll container. `overflow-x` lives on `<html>` because setting overflow on one axis forces the other to compute as `auto`.
- **Base element styles must sit in `@layer base`.** Unlayered CSS outranks every Tailwind 4 utility, so an unlayered `a { text-decoration: underline }` silently defeated `no-underline`. Any hover override of a `@utility` (like the podcast artwork's `group-hover:[filter:none]`) is exposed to the same hazard — verify from computed styles, not by eye.
- **The share card has no static fallback.** `card.jpg` is gone, so if `opengraph-image.tsx` fails the site has no OG image at all. Check `og:image` in the built HTML after touching it.
- **Satori needs a real TTF/OTF/WOFF** — not WOFF2, and it cannot read `next/font`. That is why the font is vendored under `assets/`.
- **Conference photo fallback.** `SpeakingPhoto` checks `existsSync(public/<src>)` on the server and falls back to a plain caption. A static `import` would break the build when the file is absent. The check runs at prerender, so adding the file requires a rebuild.
- **Images ship at source size.** The static export has no optimizer (`images.unoptimized: true`), so `sizes` props do nothing and a 2000px photo is a 1 MB download. Files in `public/images/` are pre-sized to what the layout needs — 1200px photo, 192px avatar, 176px artwork — and the `width`/`height` props must match the real files.
- Podcast artwork is mirrored into `public/images/`, not hotlinked from Apple.
- Mobile apps are intentionally plain text — see [decisions/002](../decisions/002-no-invented-links.md).
