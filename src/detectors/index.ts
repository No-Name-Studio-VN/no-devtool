import { createConsoleFormatDetector } from "./console-format";
import { createDebuggerPauseDetector } from "./debugger-pause";
import { createDebugLibrariesDetector } from "./debug-libraries";
import { createSizeDetector } from "./size";
import { createTimingDetector } from "./timing";
import type { BuiltInDetectorId, Detector } from "../type";

const builtInDetectors: Record<BuiltInDetectorId, () => Detector> = {
  size: createSizeDetector,
  "console-format": createConsoleFormatDetector,
  timing: createTimingDetector,
  "debugger-pause": createDebuggerPauseDetector,
  "debug-libraries": createDebugLibrariesDetector,
};

export function createDetectors(detectors: Array<BuiltInDetectorId | Detector>): Detector[] {
  return detectors.map((detector) => {
    if (typeof detector !== "string") return detector;
    const createDetector = builtInDetectors[detector];
    if (!createDetector) throw new Error(`Unknown detector: ${detector}`);
    return createDetector();
  });
}

export { builtInDetectors };
