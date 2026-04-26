import { normalizeConfig } from "./config";
import { runReaction } from "./reaction";
import { createScheduler } from "./scheduler";
import { scoreSignals } from "./scoring";
import { cloneState, createInitialState } from "./state";
import { createDetectors } from "../detectors";
import { applyConsoleSanitizer } from "../hardening/console-sanitizer";
import { applyInputBlockers } from "../hardening/input-blockers";
import type {
  DetectionContext,
  DetectionEvent,
  DetectionSignal,
  NoDevtoolConfig,
  NoDevtoolController,
} from "../type";

export function createNoDevtool(config: NoDevtoolConfig = {}): NoDevtoolController {
  const options = normalizeConfig(config);
  const state = createInitialState();
  const signals: DetectionSignal[] = [];
  const detectors = createDetectors(options.detectors);
  const cleanup: Array<() => void> = [];
  const scheduler = createScheduler(options.interval, sample);

  function start() {
    if (state.running) return;
    state.running = true;
    state.suspended = false;
    cleanup.push(
      applyInputBlockers(options.hardening),
      applyConsoleSanitizer(options.hardening.console),
    );
    scheduler.start();
  }

  function stop() {
    if (!state.running) return;
    scheduler.stop();
    while (cleanup.length > 0) cleanup.pop()?.();
    state.running = false;
    state.suspended = false;
    state.open = false;
    state.confidence = 0;
    state.signals = [];
    state.lastDetection = null;
    signals.length = 0;
  }

  function suspend() {
    if (state.running) state.suspended = true;
  }

  function resume() {
    if (state.running) state.suspended = false;
  }

  function sample() {
    if (!state.running || state.suspended) return;
    const ctx = createContext(options.debug);
    for (const detector of detectors) {
      if (detector.support && !detector.support(ctx)) continue;
      const signal = detector.sample(ctx);
      if (signal) signals.push(signal);
    }
    const decision = scoreSignals(signals, { ...options, now: ctx.now() });
    const wasOpen = state.open;
    state.open = decision.open;
    state.confidence = decision.confidence;
    state.signals = decision.signals;
    if (decision.open && !wasOpen) {
      const event: DetectionEvent = { ...decision, state: cloneState(state) };
      state.lastDetection = event;
      runReaction(options.reaction, event, options.debug);
    }
  }

  return { start, stop, suspend, resume, getState: () => cloneState(state) };
}

function createContext(debug: boolean): DetectionContext {
  return {
    now: () => Date.now(),
    window,
    document,
    debug,
  };
}
