import type { Detector } from "../type";

export function createTimingDetector(): Detector {
  let last = 0;
  return {
    id: "timing",
    sample: ({ now }) => {
      const current = now();
      const delta = last === 0 ? 0 : current - last;
      last = current;
      if (delta > 1500) {
        return {
          detector: "timing",
          confidence: 0.5,
          reason: "Execution was paused longer than expected",
          timestamp: current,
        };
      }
      return null;
    },
  };
}
