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
      "Portfolio of businesses",
      "Mobile apps",
      "Public speaking",
    ]) {
      expect(screen.getByRole("heading", { level: 2, name: title })).toBeDefined();
    }
  });

  it("links every role, portfolio company and podcast to the right href", () => {
    renderHome();
    for (const item of [...roles, ...portfolio, ...speaking.podcasts]) {
      const link = screen.getByRole("link", { name: item.label });
      expect(link.getAttribute("href")).toBe(item.href);
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
});
