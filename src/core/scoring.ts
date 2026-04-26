import type { DetectionDecision, DetectionSignal } from "../type";

export interface ScoringOptions {
  threshold: number;
  sampleWindow: number;
  persistence: number;
  now?: number;
}

export function scoreSignals(
  signals: DetectionSignal[],
  options: ScoringOptions,
): DetectionDecision {
  const recent = recentSignals(signals, options.sampleWindow, options.now);
  const strongest = recent.reduce((max, signal) => Math.max(max, signal.confidence), 0);
  const combined = combineIndependentSignals(recent);
  const persistent = hasPersistentSignal(recent, options.persistence);
  const confidence = Math.min(1, Math.max(strongest, combined, persistent ? options.threshold : 0));

  return {
    open: confidence >= options.threshold,
    confidence,
    signals: recent,
  };
}

export function recentSignals(signals: DetectionSignal[], sampleWindow: number, now?: number) {
  if (signals.length === 0) return [];
  const current = now ?? Math.max(...signals.map((signal) => signal.timestamp));
  return signals.filter((signal) => current - signal.timestamp <= sampleWindow);
}

function combineIndependentSignals(signals: DetectionSignal[]) {
  const bestByDetector = new Map<string, number>();
  for (const signal of signals) {
    const current = bestByDetector.get(signal.detector) ?? 0;
    if (signal.confidence > current) bestByDetector.set(signal.detector, signal.confidence);
  }
  if (bestByDetector.size < 2) return 0;
  return Math.min(
    1,
    [...bestByDetector.values()].reduce((sum, confidence) => sum + confidence, 0),
  );
}

function hasPersistentSignal(signals: DetectionSignal[], persistence: number) {
  const counts = new Map<string, number>();
  for (const signal of signals) {
    counts.set(signal.detector, (counts.get(signal.detector) ?? 0) + 1);
  }
  return [...counts.values()].some((count) => count >= persistence);
}
