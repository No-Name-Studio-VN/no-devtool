import type { Detector } from "../type";

export function createDebuggerPauseDetector(): Detector {
  return {
    id: "debugger-pause",
    sample: ({ now }) => {
      const start = now();
      debugger;
      const elapsed = now() - start;
      if (elapsed > 100) {
        return {
          detector: "debugger-pause",
          confidence: 0.9,
          reason: "Debugger statement paused execution",
          timestamp: now(),
        };
      }
      return null;
    },
  };
}
