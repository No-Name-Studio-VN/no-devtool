import type { BuiltInDetectorId, NoDevtoolConfig, NormalizedNoDevtoolConfig } from "../type";

export const defaultDetectors: BuiltInDetectorId[] = [
  "size",
  "console-format",
  "timing",
  "debug-libraries",
];

export function normalizeConfig(config: NoDevtoolConfig = {}): NormalizedNoDevtoolConfig {
  return {
    threshold: numberInRange(config.threshold, 0.8, 0.1, 1),
    interval: numberInRange(config.interval, 500, 50, 60_000),
    sampleWindow: numberInRange(config.sampleWindow, 1_500, 100, 60_000),
    persistence: Math.max(1, Math.floor(numberInRange(config.persistence, 3, 1, 10))),
    detectors: config.detectors ?? defaultDetectors,
    reaction: config.reaction ?? { mode: "none" },
    hardening: config.hardening ?? {},
    debug: config.debug ?? false,
  };
}

function numberInRange(value: number | undefined, fallback: number, min: number, max: number) {
  if (typeof value !== "number" || Number.isNaN(value)) return fallback;
  return Math.min(max, Math.max(min, value));
}
