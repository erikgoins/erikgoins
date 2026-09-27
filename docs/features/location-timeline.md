# Location timeline

The Location section: where Erik lives now, where he lived before, and how far that adds up
to. Modelled on the Location card at
[michaelmcroskey.com/experience](https://michaelmcroskey.com/experience), redrawn in this
site's monochrome system.

## What it does

- A world map, about 180px tall, with a dot for every place that has coordinates and a line
  along the route between them. The current city is a filled `--fg` dot; the rest are
  `--muted`.
- A timeline underneath, newest first, with a rail of dots down the left, the place on the
  left and the years on the right.
- A summary line: **20,400 miles, five moves**, computed from the coordinates.

## How it works

| File | Role |
| --- | --- |
| `app/content.ts` | `places[]` — the only place to edit. `label`, `from`, `to`, `lat`, `lon`. |
| `app/lib/geo.ts` | Projection, haversine, route splitting, and the year and coordinate strings. |
| `app/world-map.ts` | Generated. One SVG path of the world's land. Do not edit. |
| `scripts/build-world-map.mjs` | Regenerates the path from world-atlas 110m. |
| `app/components/Location.tsx` | The SVG and the timeline. |
| `app/page.tsx` | `<Section label="Location">` between Speaking and the footer. |

### The data

```ts
{ label: "Buenos Aires", from: 2023, to: null, lat: -34.6, lon: -58.38 }
```

`from: null` prints an open start (`— 2009`), `to: null` prints `2023 — now`, and
`lat`/`lon` of `null` means the row has no point on the map — the nomadic years. Rows run
newest first; a test asserts that order.

### The projection

The map is an equirectangular plate carrée drawn in degrees: `x = lon`, `y = -lat`. The
`viewBox` (`-180 -75 360 131`) does all the scaling, so the land path and the dots share one
two-line projection and cannot drift apart. The crop — latitude +75 to −56 — drops Antarctica
and most of the Arctic; every city sits well inside it.

### The map path

`node scripts/build-world-map.mjs` downloads world-atlas 110m land, decodes the TopoJSON
(delta-decoded arcs, `transform` back to degrees, a negative index meaning a reversed arc),
drops rings under 2 deg² or outside the crop, simplifies the rest with Douglas-Peucker at
0.3 deg, and writes `app/world-map.ts`. Output: 51 rings, 13 KB of path data.

## Data model and services

None. No database, no API, no third-party request. See
[decisions/006](../decisions/006-location-map.md) for why the map is generated rather than
fetched from a tile service.

## Testing

`tests/geo.test.ts` covers the geometry, `tests/page.test.tsx` covers the render. Vitest's
`include` now matches `tests/**/*.test.{ts,tsx}` — under the old `.tsx`-only glob a `.ts`
test file is collected by nothing and passes by never running.

- `project` puts longitude on x and flips latitude onto y — a sign flip here is the bug that
  lands a city in the ocean.
- `haversine` matches a known distance (London–New York, ~3,459 miles).
- A leg crossing the antimeridian splits into two segments that meet at ±180 at the same
  latitude; a short leg stays in one piece.
- The route runs past a coordinate-less row and dashes that leg.
- Every place and every year range renders; the current row carries `font-medium`; the
  summary reads "20,400 miles, five moves"; there is one `<circle>` per located place and
  the SVG is `aria-hidden`.

## Gotchas

- **Longitude is cyclic and both hazards look plausible when they are wrong.** Charlotte to
  Hong Kong is 195° going east but 165° going west, so the line must leave one edge of the
  map and re-enter at the other — drawn straight, it is a bar across the whole map. A land
  ring that crosses the antimeridian has the same failure: Fiji drew as a hairline bar at
  latitude −17 until the generator started unwrapping rings and drawing them on both sides of
  the seam.
- **`app/world-map.ts` is generated.** Edit the script, not the file.
- **The map is decoration.** It is `aria-hidden`; the list below it carries every fact it
  shows. Keep it that way.
- **Michigan and Ohio are 1.8° apart**, so their dots overlap into one mark at this scale.
  That is honest, not a bug. The `--bg` stroke around each dot keeps the pair legible.
- The mileage counts the Hong Kong → Buenos Aires leg as one hop. The nomadic years in
  between are not measurable, and the dashed line says so.
