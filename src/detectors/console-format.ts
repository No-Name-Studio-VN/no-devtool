import type { Detector } from "../type";

export function createConsoleFormatDetector(): Detector {
  let inspected = false;
  const probe = /./;
  probe.toString = () => {
    inspected = true;
    return "";
  };

  return {
    id: "console-format",
    support: ({ debug }) => debug,
    sample: ({ now }) => {
      inspected = false;
      console.debug(probe);
      if (!inspected) return null;
      return {
        detector: "console-format",
        confidence: 0.45,
        reason: "Console formatter inspected a probe object",
        timestamp: now(),
      };
    },
  };
}
