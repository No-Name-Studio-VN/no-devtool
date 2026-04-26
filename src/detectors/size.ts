import type { Detector } from "../type";

export function createSizeDetector(): Detector {
  return {
    id: "size",
    support: ({ window }) =>
      typeof window.outerWidth === "number" && typeof window.innerWidth === "number",
    sample: ({ window, now }) => {
      const widthGap = Math.abs(window.outerWidth - window.innerWidth);
      const heightGap = Math.abs(window.outerHeight - window.innerHeight);
      if (widthGap > 240 || heightGap > 320) {
        return {
          detector: "size",
          confidence: 0.72,
          reason: "Viewport and outer window sizes diverged",
          timestamp: now(),
        };
      }
      return null;
    },
  };
}
