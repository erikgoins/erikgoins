import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { ImageResponse } from "next/og";
import { bio } from "./content";

// Satori needs a real font file (TTF/OTF/WOFF — not WOFF2). Vendoring the same
// display face the page uses keeps the share card on-brand instead of falling
// back to a generic sans.
const instrumentSerif = await readFile(
  join(process.cwd(), "assets/InstrumentSerif-Regular.ttf"),
);

// A metadata image route is a route handler, so `output: export` refuses to
// build it until the route says it is static. Without this the whole build
// fails — it does not silently drop the card.
export const dynamic = "force-static";

export const alt = "Erik Goins — I help mobile apps make more money.";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

/**
 * The share card is generated from the same palette and wording as the page, so
 * a link preview looks like the site rather than a stale screenshot.
 */
export default function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          background: "#ffffff",
          color: "#0a0a0a",
          padding: "80px",
          fontFamily: "sans-serif",
        }}
      >
        <div
          style={{
            display: "flex",
            fontSize: 22,
            letterSpacing: "0.16em",
            textTransform: "uppercase",
            color: "#6f6f6f",
          }}
        >
          erikgoins.com
        </div>
        <div style={{ display: "flex", flexDirection: "column" }}>
          <div
            style={{
              display: "flex",
              fontFamily: "Instrument Serif",
              fontSize: 128,
              letterSpacing: "-0.03em",
            }}
          >
            Erik Goins
          </div>
          <div
            style={{
              display: "flex",
              marginTop: 24,
              fontSize: 42,
              color: "#6f6f6f",
            }}
          >
            {bio}
          </div>
        </div>
        <div
          style={{
            display: "flex",
            gap: 32,
            fontSize: 24,
            color: "#6f6f6f",
          }}
        >
          <span>Flywheel Studio</span>
          <span>·</span>
          <span>MIG Real Estate</span>
        </div>
      </div>
    ),
    {
      ...size,
      fonts: [
        {
          name: "Instrument Serif",
          data: instrumentSerif,
          style: "normal",
          weight: 400,
        },
      ],
    },
  );
}
