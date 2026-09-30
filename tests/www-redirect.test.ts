// @vitest-environment node
import { describe, expect, it } from "vitest";
import worker from "../workers/www-redirect/index";

function redirect(url: string) {
  return worker.fetch(new Request(url));
}

describe("www redirect worker", () => {
  it("sends www to the apex with a permanent redirect", () => {
    const res = redirect("https://www.erikgoins.com/");
    expect(res.status).toBe(301);
    expect(res.headers.get("location")).toBe("https://erikgoins.com/");
  });

  it("keeps the path and query string", () => {
    const res = redirect("https://www.erikgoins.com/opengraph-image?utm_source=x");
    expect(res.headers.get("location")).toBe(
      "https://erikgoins.com/opengraph-image?utm_source=x",
    );
  });

  it("upgrades plain http and drops a port", () => {
    const res = redirect("http://www.erikgoins.com:8080/a");
    expect(res.headers.get("location")).toBe("https://erikgoins.com/a");
  });
});
