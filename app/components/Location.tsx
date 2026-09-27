import { places } from "../content";
import {
  VIEW_BOX,
  WORLD_PATH,
  coordinates,
  isLocated,
  project,
  route,
  spell,
  totalMiles,
  years,
} from "../lib/geo";

const miles = new Intl.NumberFormat("en-US");

/**
 * Where Erik lives now and where he lived before: a world map with a dot per
 * city, then the same places as a timeline. The map is decoration — it is
 * hidden from screen readers, and the list carries every fact it shows.
 */
export function Location() {
  const current = places.find(isLocated);
  const stops = places.filter(isLocated);
  const segments = route(places);
  const moves = places.length - 1;
  const travelled = Math.round(totalMiles(places) / 100) * 100;

  return (
    <div>
      {current && (
        <p className="label mb-3 text-right tabular-nums">
          {coordinates(current)}
        </p>
      )}

      <svg
        viewBox={VIEW_BOX}
        className="w-full"
        aria-hidden="true"
        focusable="false"
      >
        <path d={WORLD_PATH} fill="var(--rule)" />

        {segments.map((segment, i) => (
          <line
            key={i}
            x1={segment.x1}
            y1={segment.y1}
            x2={segment.x2}
            y2={segment.y2}
            stroke="var(--muted)"
            strokeWidth={1}
            strokeOpacity={0.4}
            strokeDasharray={segment.dashed ? "4 4" : undefined}
            vectorEffect="non-scaling-stroke"
          />
        ))}

        {stops.map((place) => {
          const { x, y } = project(place.lon, place.lat);
          const here = place === current;
          return (
            <circle
              key={place.label}
              cx={x}
              cy={y}
              r={here ? 3 : 2}
              fill={here ? "var(--fg)" : "var(--muted)"}
              stroke="var(--bg)"
              strokeWidth={1}
              vectorEffect="non-scaling-stroke"
            />
          );
        })}
      </svg>

      <ol className="relative mt-7">
        {/* The rail behind the dots. It stops short at both ends so it reads as
            a spine between them rather than a border. */}
        <span
          aria-hidden="true"
          className="absolute top-4 bottom-4 left-[5px] w-px -translate-x-1/2 bg-rule"
        />
        {places.map((place) => {
          const here = place === current;
          return (
            <li
              key={place.label}
              className="relative flex items-center gap-4 py-2 text-[0.9375rem]"
            >
              <span className="flex w-2.5 shrink-0 justify-center">
                <span
                  className={
                    here
                      ? "h-2.5 w-2.5 rounded-full bg-fg ring-4 ring-bg"
                      : isLocated(place)
                        ? "h-1.5 w-1.5 rounded-full bg-rule ring-4 ring-bg"
                        : // The nomadic years have no fixed point, so the dot
                          // is hollow — and the map has none at all.
                          "h-1.5 w-1.5 rounded-full border border-rule bg-bg ring-4 ring-bg"
                  }
                />
              </span>
              <span className={here ? "font-medium" : "text-muted"}>
                {place.label}
              </span>
              <span className="ml-auto text-[0.8125rem] text-muted tabular-nums">
                {years(place)}
              </span>
            </li>
          );
        })}
      </ol>

      <p className="mt-6 text-[0.8125rem] text-muted">
        {miles.format(travelled)} miles, {spell(moves)} moves
      </p>
    </div>
  );
}
