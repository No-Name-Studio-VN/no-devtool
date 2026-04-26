import { describe, expect, it } from "vitest";
import { scoreSignals } from "../src/core/scoring";
import type { DetectionSignal } from "../src/type";

const signal = (detector: string, confidence: number, timestamp = 1000): DetectionSignal => ({
  detector,
  confidence,
  reason: `${detector} signal`,
  timestamp,
});

describe("signal scoring", () => {
  it("opens on a single signal above the threshold", () => {
    const decision = scoreSignals([signal("size", 0.85)], {
      threshold: 0.8,
      sampleWindow: 1000,
      persistence: 3,
    });

    expect(decision).toMatchObject({ open: true, confidence: 0.85 });
    expect(decision.signals).toHaveLength(1);
  });

  it("opens when independent medium signals combine in the sample window", () => {
    const decision = scoreSignals([signal("size", 0.5, 1000), signal("timing", 0.45, 1200)], {
      threshold: 0.8,
      sampleWindow: 1000,
      persistence: 3,
    });

    expect(decision.open).toBe(true);
    expect(decision.confidence).toBeGreaterThanOrEqual(0.8);
  });

  it("opens when one detector persists across samples", () => {
    const decision = scoreSignals(
      [signal("timing", 0.35, 1000), signal("timing", 0.35, 1200), signal("timing", 0.35, 1400)],
      {
        threshold: 0.8,
        sampleWindow: 1000,
        persistence: 3,
      },
    );

    expect(decision.open).toBe(true);
    expect(decision.signals).toHaveLength(3);
  });

  it("stays closed for stale weak signals", () => {
    const decision = scoreSignals([signal("size", 0.3, 0), signal("timing", 0.3, 3000)], {
      threshold: 0.8,
      sampleWindow: 1000,
      persistence: 3,
      now: 3000,
    });

    expect(decision.open).toBe(false);
  });

  it("expires a previously strong signal when current time moves past the sample window", () => {
    const decision = scoreSignals([signal("size", 0.9, 1000)], {
      threshold: 0.8,
      sampleWindow: 1000,
      persistence: 3,
      now: 2501,
    });

    expect(decision.open).toBe(false);
    expect(decision.signals).toHaveLength(0);
  });
});
