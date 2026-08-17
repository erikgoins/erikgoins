# 002 — Mobile apps render as plain text, not guessed store URLs

_Date: 2026-08-04 · Status: accepted_

## Context

The content brief lists three mobile apps — Primus Fitness, QuitAnything, BettorTogether — with no URLs. Every other item in the brief (portfolio domains, podcasts) came with an explicit link.

## Decision

Render the three apps as plain list items. Do not construct App Store, Play Store, or marketing-site URLs from the names.

## Alternatives considered

- **Guess App Store URLs.** A wrong or dead link on a personal site is worse than no link, and app store slugs are not derivable from a display name.
- **Omit the section.** The brief explicitly asked for it.

## Consequences

- The section reads as a list of credits rather than a directory.
- Adding real links later is a one-line change per app in `app/content.ts` — convert the string entries to `{ label, href }` and reuse the existing `LinkList` component. The render test already asserts the apps have no anchor ancestor, so that assertion must be updated at the same time.
