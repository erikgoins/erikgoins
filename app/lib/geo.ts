import { LAT_MAX, LAT_MIN, WORLD_PATH } from "../world-map";
import type { Place } from "../content";

/**
 * The map is an equirectangular plate carrée drawn in degrees: x is longitude,
 * y is negative latitude. The generated land path uses the same two lines, so
 * a dot can never land in the ocean because the land and the dots disagreed
 * about the projection.
 */
export function project(lon: number, lat: number) {
  return { x: lon, y: -lat };
}

export const VIEW_BOX = `-180 ${-LAT_MAX} 360 ${LAT_MAX - LAT_MIN}`;
export const MAP_ASPECT = 360 / (LAT_MAX - LAT_MIN);
export { WORLD_PATH };

/** A place that has a point on the map. */
export type Located = Place & { lat: number; lon: number };

export function isLocated(place: Place): place is Located {
  return place.lat !== null && place.lon !== null;
}

export type Segment = {
  x1: number;
  y1: number;
  x2: number;
  y2: number;
  /** True when the leg covers the nomadic years, which get a dashed line. */
  dashed: boolean;
};

/**
 * Draws a leg the short way round. Charlotte to Hong Kong is 195 degrees going
 * east but only 165 going west, so the line has to leave one edge of the map
 * and come back in at the other. Without the split it draws as one bar straight
 * across the map.
 */
export function leg(a: Located, b: Located, dashed: boolean): Segment[] {
  const from = project(a.lon, a.lat);
  const to = project(b.lon, b.lat);
  const delta = to.x - from.x;
  const shortest = delta - 360 * Math.round(delta / 360);

  if (shortest === delta) {
    return [{ x1: from.x, y1: from.y, x2: to.x, y2: to.y, dashed }];
  }

  const edge = shortest > 0 ? 180 : -180;
  const t = (edge - from.x) / shortest;
  const yEdge = from.y + t * (to.y - from.y);

  return [
    { x1: from.x, y1: from.y, x2: edge, y2: yEdge, dashed },
    { x1: -edge, y1: yEdge, x2: to.x, y2: to.y, dashed },
  ];
}

/** Every leg of the route, oldest move first. */
export function route(places: Place[]): Segment[] {
  const oldestFirst = [...places].reverse();
  const segments: Segment[] = [];

  for (let i = 0; i < oldestFirst.length - 1; i++) {
    const from = oldestFirst[i];
    const to = oldestFirst[i + 1];
    // A dot-less row (the nomadic years) is not a stop: the line runs past it
    // to the next place that has coordinates, and is dashed to say so.
    if (!isLocated(from)) continue;
    let j = i + 1;
    let next = to;
    let dashed = false;
    while (j < oldestFirst.length && !isLocated(next)) {
      dashed = true;
      j++;
      next = oldestFirst[j];
    }
    if (!next || !isLocated(next)) continue;
    segments.push(...leg(from, next, dashed));
  }

  return segments;
}

/** "2023 — now", "— 2009", "2015 — 2020". */
export function years(place: Place) {
  const to = place.to === null ? "now" : String(place.to);
  return place.from === null ? `— ${to}` : `${place.from} — ${to}`;
}

/** "34.6°S 58.4°W", the readout above the map. */
export function coordinates({ lat, lon }: Located) {
  const ns = `${Math.abs(lat).toFixed(1)}°${lat < 0 ? "S" : "N"}`;
  const ew = `${Math.abs(lon).toFixed(1)}°${lon < 0 ? "W" : "E"}`;
  return `${ns} ${ew}`;
}
