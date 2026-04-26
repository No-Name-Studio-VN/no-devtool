import type { Detector } from "../type";

export function createDebugLibrariesDetector(): Detector {
  return {
    id: "debug-libraries",
    sample: ({ window, document, now }) => {
      const win = window as any;
      const erudaOpen = win.eruda?._devTools?._isShow === true;
      const vConsoleOpen =
        !!win._vcOrigConsole && !!document.querySelector("#__vconsole.vc-toggle");
      if (erudaOpen || vConsoleOpen) {
        return {
          detector: "debug-libraries",
          confidence: 0.95,
          reason: "Known debug library is active",
          timestamp: now(),
        };
      }
      return null;
    },
  };
}
