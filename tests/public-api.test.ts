import { describe, expect, it, vi } from "vitest";

describe("modern public API", () => {
  it("exports createNoDevtool and creates an instance controller", async () => {
    const { createNoDevtool } = await import("../src/index");

    const guard = createNoDevtool({ interval: 250, detectors: [] });

    expect(typeof createNoDevtool).toBe("function");
    expect(guard.getState()).toMatchObject({ running: false, suspended: false, open: false });
    expect(typeof guard.start).toBe("function");
    expect(typeof guard.stop).toBe("function");
    expect(typeof guard.suspend).toBe("function");
    expect(typeof guard.resume).toBe("function");
  });

  it("runs callback reactions after detectors emit a confident signal", async () => {
    vi.useFakeTimers();
    const { createNoDevtool } = await import("../src/index");
    const onDetect = vi.fn();

    const guard = createNoDevtool({
      interval: 50,
      threshold: 0.7,
      detectors: [
        {
          id: "custom",
          sample: () => ({
            detector: "custom",
            confidence: 0.9,
            reason: "test signal",
            timestamp: Date.now(),
          }),
        },
      ],
      reaction: { mode: "callback", onDetect },
    });

    guard.start();
    vi.advanceTimersByTime(60);

    expect(onDetect).toHaveBeenCalledTimes(1);
    expect(onDetect.mock.calls[0][0]).toMatchObject({ open: true, confidence: 0.9 });
    expect(guard.getState().open).toBe(true);

    guard.stop();
    vi.useRealTimers();
  });

  it("does not expose the removed singleton default API", async () => {
    const api = await import("../src/index");

    expect((api as Record<string, unknown>).default).toBeUndefined();
    expect("NoDevtool" in api).toBe(false);
  });
});
