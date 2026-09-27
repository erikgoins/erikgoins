# 006 — The location map is a generated silhouette, not a map service

_2026-09-16._

## Context

Erik asked for the Location card from
[michaelmcroskey.com/experience](https://michaelmcroskey.com/experience): a small world map
with a dot per city, a timeline of moves under it, and a one-line summary. The site is a
static export with no backend, no API keys and no runtime JavaScript worth the name, and it
is strictly monochrome.

A map is the one element on the page that normally arrives with a vendor attached.

## Decision

Draw the map ourselves.

`scripts/build-world-map.mjs` downloads world-atlas 110m land (Natural Earth, public
domain), decodes the TopoJSON by hand, simplifies it and writes `app/world-map.ts` — one SVG
path, 13 KB, committed. The page inlines that path and draws its own dots and route lines
over it.

Path coordinates are degrees, not pixels: `x = lon`, `y = -lat`, and the SVG `viewBox` does
the scaling. The dots use the same two lines in `app/lib/geo.ts`, so land and dots cannot
disagree about where a place is.

The nomadic years (2020–2023) have no single point, so they get a row in the timeline and no
dot on the map. The line that spans them is dashed.

## Alternatives considered

- **A tile service (Mapbox, Google, Apple).** Needs a key, a network request per view, an
  attribution line and a terms-of-service relationship, in exchange for detail no one will
  read at 180px tall. It would also be the only third-party call on the page.
- **A static PNG of a world map.** Cheaper to build, but it cannot invert for dark mode
  without shipping a second image, and the dots would have to be positioned against it by
  eye.
- **`topojson-client` as a dependency.** The decode is about 25 lines — delta-decode the
  arcs, apply `transform`, treat a negative index as a reversed arc. Not worth a dependency
  in a project with four.
- **No map, just the timeline.** Still the fallback if the map ever becomes a maintenance
  cost. The list carries every fact the map shows, which is why the SVG is `aria-hidden`.

## Consequences

- The built HTML goes from 5 KB to 12 KB gzipped. Everything else on the page is unchanged.
- The map is regenerable but not automatic: change the crop or the simplification and you
  must run `node scripts/build-world-map.mjs` and commit the result.
- Two hazards are now covered by tests, because both fail silently and look plausible:
  a leg that crosses the antimeridian is split at the seam instead of drawn straight across
  the map, and a land ring that crosses the seam is drawn on both sides of it rather than as
  a bar across the map at its latitude. Fiji found the second one.
- Adding a city is a row in `app/content.ts`. The dot, the route, the mileage and the tests
  all follow from it.
