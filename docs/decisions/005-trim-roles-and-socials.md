# 005 — Drop the newsletter role and the Instagram link

_2026-08-18. Supersedes the newsletter half of [001](./001-nextjs-rewrite.md)._

## Context

[001](./001-nextjs-rewrite.md) carried two items forward from the old site that the
new bio did not restate: the `flywheel.so` link on "Founder, Flywheel Studio," and a
"Writing @ I'm the Product" newsletter line. The Instagram link came over from the old
site's social row at the same time.

## Decision

Remove "Writing @ I'm the Product" from `roles` and Instagram from `socials`. Erik asked
for both. The `flywheel.so` link stays.

Roles is now two lines, and Elsewhere is Twitter, LinkedIn and Email.

The same two items were removed from `README.md`, which mirrors the site's bio, roles and
social row on the GitHub profile.

## Alternatives considered

Keep the newsletter but move it under a separate label. Rejected — Erik asked for the line
gone, not relocated, and a one-item section costs a rule and a label to say less.

## Consequences

`tests/page.test.tsx` iterates `roles`, `portfolio` and `socials` from `content.ts`, so both
removals leave the suite passing with no test edit. If the newsletter comes back, add it to
`roles` in `app/content.ts` and write a record superseding this one.
