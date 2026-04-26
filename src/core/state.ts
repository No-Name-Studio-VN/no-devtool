import type { DetectionEvent, NoDevtoolState } from "../type";

export function createInitialState(): NoDevtoolState {
  return {
    running: false,
    suspended: false,
    open: false,
    confidence: 0,
    signals: [],
    lastDetection: null,
  };
}

export function cloneState(state: NoDevtoolState): NoDevtoolState {
  return {
    ...state,
    signals: [...state.signals],
    lastDetection: state.lastDetection ? cloneEvent(state.lastDetection) : null,
  };
}

function cloneEvent(event: DetectionEvent): DetectionEvent {
  return {
    ...event,
    signals: [...event.signals],
    state: { ...event.state, signals: [...event.state.signals] },
  };
}
