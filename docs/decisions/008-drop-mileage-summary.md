# 008 — Drop the mileage summary from Location

_2026-09-27. Supersedes the summary line in [006](./006-location-map.md)._

## Context

[006](./006-location-map.md) shipped the Location section with a one-line summary under
the timeline: "20,400 miles, five moves", computed from the coordinates in `places`.

## Decision

Remove the summary line. Erik asked for it gone. The map and the timeline stay as they are.

The code that only served the line goes with it: `haversine`, `totalMiles` and `spell` in
`app/lib/geo.ts`, and their three tests in `tests/geo.test.ts`. The page test that asserted
the summary text now asserts that no "miles" or "moves" text renders.

## Alternatives considered

Keep the helpers for a future return of the line. Rejected: nothing else calls them, and
git history holds them if the line comes back.

## Consequences

A new row in `places` still adds a dot and a route leg, but no longer changes any number
on the page. To bring the summary back, restore the helpers from the commit before this
one and write a record superseding this one.
