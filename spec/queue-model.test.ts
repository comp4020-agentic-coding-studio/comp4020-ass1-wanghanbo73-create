import { describe, expect, it } from "vitest";
import { MAX_UTIL, MAX_WAIT_MIN, MIN_UTIL, queueLength, waitMinutes } from "../queue-model";

describe("queue-model", () => {
  it("matches known M/M/1-style sample values", () => {
    expect(waitMinutes(0.5)).toBeCloseTo(1, 3);
    expect(waitMinutes(0.7)).toBeCloseTo(2.333, 3);
    expect(waitMinutes(0.9)).toBeCloseTo(9, 3);
    expect(waitMinutes(0.95)).toBeCloseTo(19, 3);
    expect(waitMinutes(0.98)).toBeCloseTo(49, 3);
    expect(waitMinutes(MAX_UTIL)).toBeCloseTo(99, 3);
  });

  it("exposes its own max as MAX_WAIT_MIN, used to scale the chart", () => {
    expect(MAX_WAIT_MIN).toBeCloseTo(99, 3);
  });

  it("rises far more steeply from 90% to 98% than from 50% to 70%", () => {
    const smallStep = waitMinutes(0.7) - waitMinutes(0.5);
    const bigStep = waitMinutes(0.98) - waitMinutes(0.9);
    expect(bigStep).toBeGreaterThan(smallStep * 10);
  });

  it("is monotonically increasing across the domain", () => {
    const steps = 50;
    let previous = waitMinutes(MIN_UTIL);
    for (let i = 1; i <= steps; i++) {
      const u = MIN_UTIL + ((MAX_UTIL - MIN_UTIL) * i) / steps;
      const current = waitMinutes(u);
      expect(current).toBeGreaterThan(previous);
      previous = current;
    }
  });

  it("is convex: each step rises more than the step before it", () => {
    const steps = 50;
    let previous = waitMinutes(MIN_UTIL);
    let previousDelta = -Infinity;
    for (let i = 1; i <= steps; i++) {
      const u = MIN_UTIL + ((MAX_UTIL - MIN_UTIL) * i) / steps;
      const current = waitMinutes(u);
      const delta = current - previous;
      expect(delta).toBeGreaterThan(previousDelta);
      previousDelta = delta;
      previous = current;
    }
  });

  it("grows queue length alongside wait time", () => {
    expect(queueLength(0.5)).toBeCloseTo(1, 3);
    expect(queueLength(0.9)).toBeCloseTo(9, 3);
    expect(queueLength(MAX_UTIL)).toBeCloseTo(99, 3);
  });
});
