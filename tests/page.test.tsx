import { existsSync } from "node:fs";
import { join } from "node:path";
import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import Home from "../app/page";
import {
  bio,
  mobileApps,
  places,
  portfolio,
  roles,
  socials,
  speaking,
} from "../app/content";
import { years } from "../app/lib/geo";

function escapeRegExp(s: string) {
  return s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function renderHome() {
  // Home is a Server Component but performs no async work, so React can render
  // its returned tree directly in jsdom.
  render(Home() as React.ReactElement);
}

describe("home page", () => {
  it("renders the name and bio", () => {
    renderHome();
    expect(
      screen.getByRole("heading", { level: 1, name: "Erik Goins" }),
    ).toBeDefined();
    expect(screen.getByText(bio)).toBeDefined();
  });

  it("renders every section heading", () => {
    renderHome();
    for (const title of [
      "Roles",
      "Portfolio",
      "Mobile apps",
      "Speaking",
      "Location",
      "Elsewhere",
    ]) {
      expect(screen.getByRole("heading", { level: 2, name: title })).toBeDefined();
    }
  });

  it("links every role and portfolio company to the right href", () => {
    renderHome();
    for (const item of [...roles, ...portfolio]) {
      const link = screen.getByRole("link", { name: item.label });
      expect(link.getAttribute("href")).toBe(item.href);
    }
  });

  it("renders each podcast as a card with artwork, title, show and duration", () => {
    renderHome();
    for (const podcast of speaking.podcasts) {
      const link = screen.getByRole("link", {
        name: new RegExp(escapeRegExp(podcast.label)),
      });
      expect(link.getAttribute("href")).toBe(podcast.href);

      // Artwork is decorative — the episode title carries the accessible name.
      const img = link.querySelector("img");
      expect(img).not.toBeNull();
      expect(img?.getAttribute("alt")).toBe("");

      expect(link.textContent).toContain(podcast.show);
      expect(link.textContent).toContain(podcast.meta);
    }
  });

  it("points every podcast at its real episode URL", () => {
    for (const podcast of speaking.podcasts) {
      expect(podcast.href).toMatch(/^https:\/\/podcasts\.apple\.com\//);
      expect(podcast.artwork).toMatch(/^\/images\//);
    }
  });

  it("renders each webinar as a card with artwork, title, host and duration", () => {
    renderHome();
    const list = screen.getByRole("list", { name: "Webinars" });
    for (const webinar of speaking.webinars) {
      const link = screen.getByRole("link", {
        name: new RegExp(escapeRegExp(webinar.label)),
      });
      expect(list.contains(link)).toBe(true);
      expect(link.getAttribute("href")).toBe(webinar.href);

      const img = link.querySelector("img");
      expect(img?.getAttribute("alt")).toBe("");
      // The row sizes the thumbnail from these, so a 16:9 file declared as a
      // square would render squashed.
      expect(img?.getAttribute("width")).toBe(String(webinar.width));
      expect(img?.getAttribute("height")).toBe(String(webinar.height));

      expect(link.textContent).toContain(webinar.show);
      expect(link.textContent).toContain(webinar.meta);
    }
  });

  it("points every webinar at its YouTube video and a mirrored thumbnail", () => {
    for (const webinar of speaking.webinars) {
      expect(webinar.href).toMatch(
        /^https:\/\/www\.youtube\.com\/watch\?v=[A-Za-z0-9_-]{11}$/,
      );
      expect(webinar.artwork).toMatch(/^\/images\//);
      expect(existsSync(join(process.cwd(), "public", webinar.artwork))).toBe(
        true,
      );
    }
  });

  it("lists the mobile apps as plain text (no invented links)", () => {
    renderHome();
    for (const app of mobileApps) {
      const node = screen.getByText(app);
      expect(node.closest("a")).toBeNull();
    }
  });

  it("renders each social link with an accessible label", () => {
    renderHome();
    for (const social of socials) {
      const link = screen.getByRole("link", { name: social.label });
      expect(link.getAttribute("href")).toBe(social.href);
    }
  });

  it("shows the speaking engagement caption", () => {
    renderHome();
    expect(screen.getByText(speaking.photo.caption)).toBeDefined();
  });

  it("renders every place and its years in the location timeline", () => {
    renderHome();
    for (const place of places) {
      expect(screen.getByText(place.label)).toBeDefined();
      expect(screen.getByText(years(place))).toBeDefined();
    }
  });

  it("marks the current place as current", () => {
    renderHome();
    expect(screen.getByText("2023 — now")).toBeDefined();
    expect(screen.getByText(places[0].label).className).toContain("font-medium");
  });

  it("shows no mileage summary under the timeline", () => {
    // Erik removed the "20,400 miles, five moves" line (decision 008).
    renderHome();
    expect(screen.queryByText(/\bmiles\b/)).toBeNull();
    expect(screen.queryByText(/\bmoves\b/)).toBeNull();
  });

  it("draws a map dot for every place that has coordinates", () => {
    const { container } = render(Home() as React.ReactElement);
    const located = places.filter((place) => place.lat !== null);
    expect(container.querySelectorAll("circle")).toHaveLength(located.length);

    // The projection is unit-tested; this asserts the component actually used
    // it, because a transposed cx/cy draws a plausible map of the wrong world.
    const current = container.querySelector("circle");
    expect(Number(current?.getAttribute("cx"))).toBe(places[0].lon);
    expect(Number(current?.getAttribute("cy"))).toBe(-places[0].lat!);

    // The map is decoration; the list beneath it carries the same facts.
    expect(container.querySelector("svg")?.getAttribute("aria-hidden")).toBe("true");
  });

  it("has the conference photo on disk, so it renders rather than falling back", () => {
    // SpeakingPhoto degrades to a bare caption when the file is missing; this
    // asserts the real photo is present so the degraded path is not shipped.
    expect(
      existsSync(join(process.cwd(), "public", speaking.photo.src)),
    ).toBe(true);
  });
});
