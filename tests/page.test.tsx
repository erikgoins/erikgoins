import { existsSync } from "node:fs";
import { join } from "node:path";
import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import Home from "../app/page";
import {
  bio,
  mobileApps,
  portfolio,
  roles,
  socials,
  speaking,
} from "../app/content";

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

  it("has the conference photo on disk, so it renders rather than falling back", () => {
    // SpeakingPhoto degrades to a bare caption when the file is missing; this
    // asserts the real photo is present so the degraded path is not shipped.
    expect(
      existsSync(join(process.cwd(), "public", speaking.photo.src)),
    ).toBe(true);
  });
});
