# 001 — Rebuild erikgoins.com on Next.js

_Date: 2026-08-04 · Status: accepted; visual identity superseded by [003](./003-monochrome-redesign.md) on 2026-08-17_

## Context

The existing site is a single hand-rolled static HTML page (Carrd-style export) with inline CSS and an icon sprite. The bio was out of date and the content was growing: portfolio companies, mobile apps, and speaking engagements now need their own sections.

## Decision

Rebuild the site as a Next.js 16 App Router project (TypeScript, Tailwind 4), with all copy and links in a single `app/content.ts` module. Preserve the old site's visual identity — background photo, noise overlay, translucent dark card, Source Sans — and its `<head>` metadata verbatim.

The new bio supplied by Erik ("I help mobile apps make more money.") replaces the old HoldCo line. Two items the new bio did not restate are carried over rather than dropped: the `flywheel.so` link on "Founder, Flywheel Studio," and the "Writing @ I'm the Product" newsletter line.

## Alternatives considered

- **Keep the static HTML and edit it.** Rejected: the user explicitly asked for Next.js, and the content is now structured enough that hand-editing markup invites drift.
- **Astro / plain Vite.** Lighter for a one-pager, but the rest of the portfolio is Next.js on Vercel; matching it costs nothing here.

## Consequences

- Content edits are a one-file change with no markup involved.
- The site is statically prerendered, so hosting characteristics are unchanged from the static original.
- Deployment is a new step: the Vercel project does not exist yet and the domain still points at the old site.
