# 003 — Monochrome editorial redesign

_Date: 2026-08-17 · Status: accepted · Supersedes the visual half of [001](./001-nextjs-rewrite.md)_

## Context

[001](./001-nextjs-rewrite.md) deliberately preserved the old site's visual identity: a translucent dark card floating on a fixed photographic background, centred, roughly 26–34rem wide. That was the right call for a port — it kept the rewrite honest by changing only the technology.

Once the content grew (roles, five portfolio companies, three apps, a conference photo, three podcast cards), the centred card stopped working. Centred text is hard to scan past a few lines, the busy background competed with the content, and the format read as a link-in-bio page rather than the site of someone who builds products.

## Decision

Redesign the site as a monochrome editorial page. Specifically:

- **Strictly one neutral ramp, no hue anywhere.** Five tokens (`--bg`, `--fg`, `--muted`, `--rule`, `--hover`) defined in `globals.css`. Dark mode is a straight inversion of the same five, so there is no second set of component styles.
- **Photography is desaturated** (`filter: grayscale(1)`) so images obey the same constraint as the type. Podcast artwork is the single exception: it returns to colour on hover, which doubles as the affordance for those rows.
- **Delete the background image and the translucent card.** The page sits directly on the canvas.
- **One left edge.** A hanging-label grid (`7rem` label column + content column) runs through the masthead, every section, and the footer, so labels sit in the margin and all real content shares a single alignment.
- **Instrument Serif for the name, Inter for everything else.** A single serif moment carries the editorial tone; everything else is quiet sans. Micro-labels are 11px uppercase with wide tracking.
- **Social links became text**, replacing the ported SVG icon sprite — more typographic and consistent with the monochrome rule.
- **The share card is generated** by `app/opengraph-image.tsx` from the same palette and wording, replacing the old site's `card.jpg`.

## Alternatives considered

- **Restyle the card in black and white.** Cheapest option, but it keeps the centred link-in-bio structure that was the actual problem.
- **Full-bleed cards for every link.** Rejected in conversation on 2026-08-04 — see [002](./002-no-invented-links.md) context; only the speaking section uses imagery.
- **Dark-only.** A single dark palette is striking but ignores half of readers' system preference; the token inversion costs almost nothing.

## Consequences

- `SocialIcon.tsx`, `public/images/bg.jpg` and `public/images/card.jpg` are deleted. The `SocialLabel` type went with the icons.
- `assets/InstrumentSerif-Regular.ttf` is vendored, because Satori needs a real TTF/OTF/WOFF file and cannot use WOFF2 or `next/font`.
- Two layout constraints are now load-bearing and easy to break by accident; both are recorded as gotchas in the feature doc and `AGENTS.md`.
- The old site's visual identity is gone. This reverses the preservation goal in 001; 001 stands as the record of why the port was done that way first.
