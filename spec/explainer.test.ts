import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { JSDOM } from "jsdom";
import { describe, expect, it } from "vitest";

// This deliverable's own contract, alongside the always-on invariants.test.ts.
// Checks the built page for what the brief requires, not how it's built —
// see spec/README.md.
const doc = new JSDOM(readFileSync(resolve("dist/index.html"), "utf8")).window.document;

describe("90% Full Is Almost Broken", () => {
  it("has a single utilisation slider spanning roughly 10% to 99%", () => {
    const sliders = doc.querySelectorAll('input[type="range"]');
    expect(sliders.length).toBe(1);
    const slider = sliders[0];
    expect(Number(slider?.getAttribute("min"))).toBeLessThanOrEqual(10);
    expect(Number(slider?.getAttribute("max"))).toBeGreaterThanOrEqual(99);
  });

  it("has a live region announcing the current result", () => {
    expect(doc.querySelector("[aria-live]")).toBeTruthy();
  });

  it("has a chart element visualising wait time", () => {
    expect(doc.querySelector("svg, canvas")).toBeTruthy();
  });

  it("has a queue visualisation container", () => {
    expect(doc.querySelector(".queue-row")).toBeTruthy();
  });

  it("has the exact takeaway line", () => {
    expect(doc.body.textContent).toContain("A system doesn't need to be full to feel overloaded.");
  });
});
