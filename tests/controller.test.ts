import { describe, expect, it, vi } from "vitest";
import { createNoDevtool } from "../src/index";

describe("NoDevtool controller", () => {
  it("starts, suspends, resumes, and stops without leaking timers", () => {
    vi.useFakeTimers();
    const sample = vi.fn(() => null);
    const guard = createNoDevtool({ interval: 100, detectors: [{ id: "custom", sample }] });

    guard.start();
    vi.advanceTimersByTime(110);
    expect(sample).toHaveBeenCalledTimes(1);
    expect(guard.getState()).toMatchObject({ running: true, suspended: false });

    guard.suspend();
    vi.advanceTimersByTime(110);
    expect(sample).toHaveBeenCalledTimes(1);
    expect(guard.getState().suspended).toBe(true);

    guard.resume();
    vi.advanceTimersByTime(110);
    expect(sample).toHaveBeenCalledTimes(2);

    guard.stop();
    vi.advanceTimersByTime(110);
    expect(sample).toHaveBeenCalledTimes(2);
    expect(guard.getState()).toMatchObject({ running: false, suspended: false });

    vi.useRealTimers();
  });
});
