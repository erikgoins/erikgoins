# 004 — Ship a static export to Cloudflare Workers

_Date: 2026-08-17_

## Context

The first Cloudflare deploy failed. The build ran `npm run build`, then `npx wrangler deploy`.
Wrangler found no Wrangler config in the repo, detected Next.js, and ran the OpenNext Cloudflare
adapter setup on its own. That setup wrote `wrangler.jsonc`, `open-next.config.ts`, `.dev.vars` and
`public/_headers` inside the build container, installed 252 extra packages, bundled a Worker, and
then failed:

```
Service binding 'WORKER_SELF_REFERENCE' references Worker 'erikgoinscom' which was not found.
```

The generated config named the Worker `erikgoinscom`; the Cloudflare project's Worker is
`erikgoins`. The deploy stopped there, so the site never went up.

The deeper point: OpenNext exists to run Next.js server features on Workers. This site has no server
features. It is one route, no backend, no database, no auth, and every page already prerendered as
static content in both build logs.

## Decision

Build the site with `output: "export"` and serve `out/` from Cloudflare Workers static assets. Keep
Next.js as the site generator.

`wrangler.jsonc` is committed at the repo root with `name: "erikgoins"`, `assets.directory: "./out"`
and no `main`. Committing it is what stops Wrangler from running the OpenNext auto-setup — that path
only runs when a project has no Wrangler config. No Cloudflare dashboard change is needed: the build
command is still `npm run build` and the deploy command is still `npx wrangler deploy`.

## Alternatives considered

**Fix the OpenNext binding name.** Renaming the Worker in the generated config would have made the
deploy pass, but it keeps a Node.js server, an adapter, a Cloudflare Images binding, and 252
packages in the deploy path — to serve one HTML file.

**Drop Next.js for hand-written HTML/CSS.** Tempting, because the exported page ships about 178 KB
of gzipped JavaScript to hydrate a page with no interactivity. It would cost `app/content.ts` as the
single source of truth, the nine render tests, the `next/font` self-hosting pipeline, and the
generated share card. Not taken now; the export output is already plain HTML/CSS/JS on the wire, and
the JavaScript is a separate, reversible decision. Revisit if the payload matters more than the
authoring setup.

**Cloudflare Pages.** Same static hosting, but the project is already wired as a Workers Build, and
Workers static assets is where Cloudflare is putting its effort.

## Consequences

Gone, and not coming back without reversing this record:

- No image optimizer. `images.unoptimized` is `true`, so files in `/public` ship at their source
  size. Source dimensions are now a delivery decision — the images were re-encoded down from 1.2 MB
  to 232 KB total, and `width`/`height` props were updated to match the real files.
- No ISR, no revalidation, no Server Actions, no route handlers that read the request, no redirects
  or headers from `next.config.ts`. Redirect and header rules go in `public/_headers` and
  `public/_redirects` instead.
- `next start` no longer works. `npm run preview` (`wrangler dev`) serves the real thing — the same
  asset server Cloudflare runs.

Two build-time details this forced:

- `app/opengraph-image.tsx` needs `export const dynamic = "force-static"`. A metadata image route is
  a route handler, and `output: export` fails the build without it. It fails loudly, so the share
  card cannot silently disappear.
- Next writes that card to `out/opengraph-image` with no file extension, and Workers then serves it
  with **no `Content-Type` header at all** (verified against `wrangler dev`). `public/_headers` sets
  `Content-Type: image/png` for that path. Without the rule, scrapers get an untyped body.

## Verification

Run against the export served by `wrangler dev`, from a copy of the repo outside iCloud:

- `next build` exits 0; `/`, `/_not-found` and `/opengraph-image` all prerender as static.
- `npx tsc --noEmit` exits 0, `eslint` exits 0, `vitest run` passes 9/9.
- `/` returns 200 `text/html`, `/opengraph-image` returns 200 `image/png` at 1200×630,
  `/_next/static/*` returns `Cache-Control: public, max-age=31536000, immutable`, an unknown path
  returns 404 with the exported `404.html`.
- The page renders correctly in a browser, including the re-encoded photos.
