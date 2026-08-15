// M/M/1-style blowup: expected wait and queue length both scale with
// utilisation / (1 - utilisation), so they stay small across most of the
// range and rise sharply only near full utilisation. A pure function of
// utilisation alone — no separate arrival/service rate inputs — so it maps
// directly onto a single slider.
export const MIN_UTIL = 0.1;
export const MAX_UTIL = 0.99;

const SERVICE_TIME_MIN = 1;

export function waitMinutes(utilisation: number): number {
  return (SERVICE_TIME_MIN * utilisation) / (1 - utilisation);
}

export function queueLength(utilisation: number): number {
  return utilisation / (1 - utilisation);
}

export const MAX_WAIT_MIN = waitMinutes(MAX_UTIL);

export interface CurvePoint {
  u: number;
  wait: number;
}

export function sampleCurve(steps = 90): CurvePoint[] {
  const points: CurvePoint[] = [];
  for (let i = 0; i <= steps; i++) {
    const u = MIN_UTIL + ((MAX_UTIL - MIN_UTIL) * i) / steps;
    points.push({ u, wait: waitMinutes(u) });
  }
  return points;
}
