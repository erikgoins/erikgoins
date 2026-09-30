import { describe, expect, it } from "vitest";
import { places } from "../app/content";
import {
  coordinates,
  isLocated,
  leg,
  project,
  route,
  years,
} from "../app/lib/geo";

const CHARLOTTE = { label: "Charlotte", from: 2013, to: 2015, lat: 35.23, lon: -80.84 };
const HONG_KONG = { label: "Hong Kong", from: 2015, to: 2020, lat: 22.32, lon: 114.17 };
const LONDON = { label: "London", from: null, to: null, lat: 51.51, lon: -0.13 };
const NEW_YORK = { label: "New York", from: null, to: null, lat: 40.71, lon: -74.01 };

describe("projection", () => {
  it("puts longitude on x and flips latitude onto y", () => {
    // Buenos Aires: south of the equator and west of Greenwich, so it belongs
    // below the middle of the map and left of centre. A sign flip here is the
    // bug that lands a city in the ocean.
    expect(project(-58.38, -34.6)).toEqual({ x: -58.38, y: 34.6 });
    expect(project(114.17, 22.32)).toEqual({ x: 114.17, y: -22.32 });
    expect(project(0, 0)).toEqual({ x: 0, y: -0 });
  });
});

describe("route", () => {
  it("splits a leg that crosses the antimeridian", () => {
    // Charlotte to Hong Kong is 195 degrees east but 165 west, so the line
    // leaves the left edge and comes back in at the right.
    const segments = leg(CHARLOTTE, HONG_KONG, false);
    expect(segments).toHaveLength(2);
    expect(segments[0].x2).toBe(-180);
    expect(segments[1].x1).toBe(180);
    expect(segments[0].y2).toBe(segments[1].y1);
  });

  it("leaves a short leg in one piece", () => {
    expect(leg(LONDON, NEW_YORK, false)).toHaveLength(1);
  });

  it("runs the line past a place with no coordinates and dashes it", () => {
    const segments = route(places);
    const dashed = segments.filter((segment) => segment.dashed);
    // Hong Kong to Buenos Aires covers the nomadic years.
    expect(dashed.length).toBeGreaterThan(0);
    expect(segments.every((segment) => Number.isFinite(segment.x1))).toBe(true);
  });
});

describe("content", () => {
  it("puts every place inside real coordinate bounds", () => {
    for (const place of places.filter(isLocated)) {
      expect(Math.abs(place.lat)).toBeLessThanOrEqual(90);
      expect(Math.abs(place.lon)).toBeLessThanOrEqual(180);
    }
  });

  it("lists places newest first", () => {
    const starts = places.map((place) => place.from ?? -Infinity);
    expect([...starts].sort((a, b) => b - a)).toEqual(starts);
  });

  it("writes an open start and a current place", () => {
    expect(years({ label: "", from: null, to: 2009, lat: null, lon: null })).toBe("— 2009");
    expect(years({ label: "", from: 2023, to: null, lat: null, lon: null })).toBe("2023 — now");
  });

  it("reads coordinates as degrees with a hemisphere", () => {
    expect(coordinates({ label: "", from: null, to: null, lat: -34.6, lon: -58.38 })).toBe(
      "34.6°S 58.4°W",
    );
    expect(coordinates(HONG_KONG)).toBe("22.3°N 114.2°E");
  });
});
