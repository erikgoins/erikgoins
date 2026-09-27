/**
 * Regenerates app/world-map.ts — the land silhouette behind the Location map.
 *
 *   node scripts/build-world-map.mjs
 *
 * Source: world-atlas 110m land (Natural Earth, public domain), decoded here
 * rather than through the topojson-client package so the site keeps its very
 * short dependency list. The decode is the whole of TopoJSON's format: arcs are
 * delta-encoded integers, `transform` turns them back into degrees, and a
 * negative arc index means "that arc, reversed".
 *
 * Path coordinates are degrees, not pixels: x = lon, y = -lat. The SVG viewBox
 * does the scaling, so the dots and the land cannot drift apart — both use the
 * same two-line projection in app/lib/geo.ts.
 */
import { writeFileSync } from "node:fs";

const SOURCE = "https://cdn.jsdelivr.net/npm/world-atlas@2/land-110m.json";

// The crop. Erik's cities run from +43 to -34.6, so this keeps every dot well
// inside the frame while dropping Antarctica and the top of the Arctic.
const LAT_MAX = 75;
const LAT_MIN = -56;

// Douglas-Peucker tolerance and minimum ring area, both in degrees. 0.3 deg is
// about 0.8px once the map is drawn ~1000px wide.
const TOLERANCE = 0.5;
const MIN_AREA = 2;

function decodeArc(arc, transform) {
  const [sx, sy] = transform.scale;
  const [tx, ty] = transform.translate;
  let x = 0;
  let y = 0;
  return arc.map(([dx, dy]) => {
    x += dx;
    y += dy;
    return [x * sx + tx, y * sy + ty];
  });
}

function ringFromArcs(indices, arcs) {
  const points = [];
  for (const index of indices) {
    const arc = index < 0 ? arcs[~index].slice().reverse() : arcs[index];
    // Consecutive arcs share an endpoint.
    points.push(...(points.length ? arc.slice(1) : arc));
  }
  return points;
}

function perpendicularDistance([px, py], [ax, ay], [bx, by]) {
  const dx = bx - ax;
  const dy = by - ay;
  const length = Math.hypot(dx, dy);
  if (length === 0) return Math.hypot(px - ax, py - ay);
  return Math.abs(dy * px - dx * py + bx * ay - by * ax) / length;
}

/** Douglas-Peucker, iterative so a long ring cannot blow the stack. */
function simplify(points, tolerance) {
  if (points.length < 3) return points;
  const keep = new Array(points.length).fill(false);
  keep[0] = true;
  keep[points.length - 1] = true;
  const stack = [[0, points.length - 1]];

  while (stack.length) {
    const [first, last] = stack.pop();
    let worst = 0;
    let index = -1;
    for (let i = first + 1; i < last; i++) {
      const distance = perpendicularDistance(points[i], points[first], points[last]);
      if (distance > worst) {
        worst = distance;
        index = i;
      }
    }
    if (worst > tolerance && index !== -1) {
      keep[index] = true;
      stack.push([first, index], [index, last]);
    }
  }

  return points.filter((_, i) => keep[i]);
}

function area(points) {
  let sum = 0;
  for (let i = 0, j = points.length - 1; i < points.length; j = i++) {
    sum += points[j][0] * points[i][1] - points[i][0] * points[j][1];
  }
  return Math.abs(sum / 2);
}

const round = (n) => Math.round(n * 10) / 10;

const response = await fetch(SOURCE);
if (!response.ok) throw new Error(`${SOURCE} returned ${response.status}`);
const topology = await response.json();

// objects.land is a GeometryCollection holding a single MultiPolygon.
const geometries =
  topology.objects.land.type === "GeometryCollection"
    ? topology.objects.land.geometries
    : [topology.objects.land];
const polygons = geometries.flatMap((geometry) => {
  if (geometry.type === "MultiPolygon") return geometry.arcs;
  if (geometry.type === "Polygon") return [geometry.arcs];
  throw new Error(`unexpected geometry ${geometry.type}`);
});

const arcs = topology.arcs.map((arc) => decodeArc(arc, topology.transform));

let kept = 0;
let dropped = 0;
const commands = [];

/**
 * Longitude is cyclic, so a ring that crosses the antimeridian arrives with a
 * 360 degree jump in the middle of it. Left alone, Fiji draws as a hairline bar
 * straight across the map at its latitude. Unwrapping keeps the ring
 * continuous; the caller then draws it on both sides of the seam.
 */
function unwrap(ring) {
  let offset = 0;
  let previous = ring[0][0];
  return ring.map(([lon, lat], i) => {
    if (i > 0) {
      const step = lon + offset - previous;
      if (step > 180) offset -= 360;
      else if (step < -180) offset += 360;
    }
    const x = lon + offset;
    previous = x;
    return [x, lat];
  });
}

for (const polygon of polygons) {
  for (const ringIndices of polygon) {
    const ring = unwrap(ringFromArcs(ringIndices, arcs));

    const lats = ring.map(([, lat]) => lat);
    if (Math.min(...lats) > LAT_MAX || Math.max(...lats) < LAT_MIN) {
      dropped++;
      continue;
    }
    if (area(ring) < MIN_AREA) {
      dropped++;
      continue;
    }

    const simplified = simplify(ring, TOLERANCE);
    if (simplified.length < 4) {
      dropped++;
      continue;
    }
    kept++;

    const lons = simplified.map(([lon]) => lon);
    const minLon = Math.min(...lons);
    const maxLon = Math.max(...lons);

    // A ring that crosses the seam is drawn on both sides of it; the viewBox
    // clips whatever falls outside. x = lon, y = -lat, and points above or
    // below the crop are clamped to its edge to keep the numbers short.
    for (const shift of [-360, 0, 360]) {
      if (minLon + shift > 180 || maxLon + shift < -180) continue;

      const drawn = simplified.map(([lon, lat]) => [
        round(Math.min(180, Math.max(-180, lon + shift))),
        round(-Math.min(LAT_MAX, Math.max(LAT_MIN, lat))),
      ]);

      // A run of points clamped to the same edge draws as one straight line, so
      // only its ends are worth keeping. Most of a ring that sits off the map
      // collapses to two numbers this way.
      const atEdge = ([x, y]) =>
        Math.abs(x) === 180 || y === -LAT_MAX || y === -LAT_MIN;
      const pruned = drawn.filter((point, i) => {
        const previous = drawn[i - 1];
        const next = drawn[i + 1];
        if (!previous || !next) return true;
        if (!atEdge(point) || !atEdge(previous) || !atEdge(next)) return true;
        const sameX = previous[0] === point[0] && next[0] === point[0];
        const sameY = previous[1] === point[1] && next[1] === point[1];
        return !(sameX || sameY);
      });

      let d = `M${pruned[0][0]} ${pruned[0][1]}`;
      let [lastX, lastY] = pruned[0];
      for (const [x, y] of pruned.slice(1)) {
        if (x === lastX && y === lastY) continue;
        d += `L${x} ${y}`;
        [lastX, lastY] = [x, y];
      }
      commands.push(`${d}Z`);
    }
  }
}

const path = commands.join("");

const file = `/**
 * GENERATED FILE — do not edit by hand.
 * Run \`node scripts/build-world-map.mjs\` to rebuild it.
 *
 * Land silhouette from world-atlas 110m (Natural Earth, public domain),
 * simplified at ${TOLERANCE} deg and cropped to lat [${LAT_MAX}, ${LAT_MIN}].
 * Coordinates are degrees: x = lon, y = -lat.
 */

export const LAT_MAX = ${LAT_MAX};
export const LAT_MIN = ${LAT_MIN};

export const WORLD_PATH =
  "${path}";
`;

writeFileSync(new URL("../app/world-map.ts", import.meta.url), file);

console.log(
  `wrote app/world-map.ts — ${kept} rings kept, ${dropped} dropped, ${(
    path.length / 1024
  ).toFixed(1)} KB of path data`,
);
