import {
  MAX_UTIL,
  MAX_WAIT_MIN,
  MIN_UTIL,
  queueLength,
  sampleCurve,
  spareCapacity,
  waitMinutes,
} from "./queue-model";

const CHART_WIDTH = 300;
const CHART_HEIGHT = 160;
const CHART_PADDING = 10;
const MAX_QUEUE_DOTS = 24;
const HOT_THRESHOLD_PERCENT = 90;
const WARNING_THRESHOLD_PERCENT = 70;

const slider = document.querySelector<HTMLInputElement>("#utilisation");
const valueOutput = document.querySelector<HTMLOutputElement>("#utilisation-value");
const waitValue = document.querySelector<HTMLElement>("#wait-value");
const queueValue = document.querySelector<HTMLElement>("#queue-value");
const queueNoun = document.querySelector<HTMLElement>("#queue-noun");
const spareValue = document.querySelector<HTMLElement>("#spare-value");
const queueRow = document.querySelector<HTMLElement>("#queue-row");
const queueOverflow = document.querySelector<HTMLElement>("#queue-overflow");
const chartPath = document.querySelector<SVGPathElement>("#chart-path");
const chartMarker = document.querySelector<SVGCircleElement>("#chart-marker");
const chartHotBand = document.querySelector<SVGRectElement>("#chart-hot-band");

function formatMinutes(minutes: number): string {
  const rounded = minutes < 10 ? Math.round(minutes * 10) / 10 : Math.round(minutes);
  return `${rounded} minute${rounded === 1 ? "" : "s"}`;
}

function xFor(u: number): number {
  return CHART_PADDING + ((u - MIN_UTIL) / (MAX_UTIL - MIN_UTIL)) * (CHART_WIDTH - 2 * CHART_PADDING);
}

function yFor(wait: number): number {
  return CHART_HEIGHT - CHART_PADDING - (wait / MAX_WAIT_MIN) * (CHART_HEIGHT - 2 * CHART_PADDING);
}

function drawCurve(): void {
  if (!chartPath) return;
  const d = sampleCurve()
    .map((point, i) => `${i === 0 ? "M" : "L"} ${xFor(point.u).toFixed(1)} ${yFor(point.wait).toFixed(1)}`)
    .join(" ");
  chartPath.setAttribute("d", d);
}

function drawHotBand(): void {
  if (!chartHotBand) return;
  const xStart = xFor(HOT_THRESHOLD_PERCENT / 100);
  chartHotBand.setAttribute("x", xStart.toFixed(1));
  chartHotBand.setAttribute("y", CHART_PADDING.toFixed(1));
  chartHotBand.setAttribute("width", (CHART_WIDTH - CHART_PADDING - xStart).toFixed(1));
  chartHotBand.setAttribute("height", (CHART_HEIGHT - 2 * CHART_PADDING).toFixed(1));
}

function renderQueue(rawCount: number): void {
  if (!queueRow) return;
  const count = Math.min(MAX_QUEUE_DOTS, Math.round(rawCount));
  const overflow = Math.max(0, Math.round(rawCount) - MAX_QUEUE_DOTS);

  while (queueRow.children.length > count) {
    queueRow.lastElementChild?.remove();
  }
  while (queueRow.children.length < count) {
    const dot = document.createElement("span");
    dot.className = "queue-dot";
    queueRow.appendChild(dot);
  }

  if (queueOverflow) {
    queueOverflow.hidden = overflow <= 0;
    if (overflow > 0) queueOverflow.textContent = `+${overflow} more waiting`;
  }
}

function render(percent: number): void {
  const u = percent / 100;
  const wait = waitMinutes(u);
  const queue = Math.max(1, Math.round(queueLength(u)));
  const waitText = formatMinutes(wait);

  if (valueOutput) valueOutput.textContent = `${percent}%`;
  if (waitValue) waitValue.textContent = waitText;
  if (queueValue) queueValue.textContent = `${queue}`;
  if (queueNoun) queueNoun.textContent = queue === 1 ? "person" : "people";
  if (spareValue) spareValue.textContent = `${Math.round(spareCapacity(u) * 100)}`;

  renderQueue(queue);

  if (chartMarker) {
    chartMarker.setAttribute("cx", xFor(u).toFixed(1));
    chartMarker.setAttribute("cy", yFor(wait).toFixed(1));
  }

  if (slider) {
    slider.setAttribute("aria-valuetext", `${percent} percent utilisation, estimated wait ${waitText}`);
    const min = Number(slider.min);
    const max = Number(slider.max);
    slider.style.setProperty("--slider-fill", `${((percent - min) / (max - min)) * 100}%`);
  }

  document.body.classList.toggle(
    "is-warm",
    percent >= WARNING_THRESHOLD_PERCENT && percent < HOT_THRESHOLD_PERCENT,
  );
  document.body.classList.toggle("is-hot", percent >= HOT_THRESHOLD_PERCENT);
}

if (slider) {
  drawCurve();
  drawHotBand();
  render(Number(slider.value));
  slider.addEventListener("input", () => render(Number(slider.value)));
}
