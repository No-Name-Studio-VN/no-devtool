export type BuiltInDetectorId =
  | "size"
  | "console-format"
  | "timing"
  | "debugger-pause"
  | "debug-libraries";
export type DetectorId = BuiltInDetectorId | string;

export interface DetectionSignal {
  detector: DetectorId;
  confidence: number;
  reason: string;
  timestamp: number;
}

export interface DetectionDecision {
  open: boolean;
  confidence: number;
  signals: DetectionSignal[];
}

export interface DetectionEvent extends DetectionDecision {
  state: NoDevtoolState;
}

export interface DetectionContext {
  now(): number;
  window: Window;
  document: Document;
  debug: boolean;
}

export interface Detector {
  id: DetectorId;
  support?: (ctx: DetectionContext) => boolean;
  sample: (ctx: DetectionContext) => DetectionSignal | null;
}

export type ReactionConfig =
  | { mode: "none" }
  | { mode: "callback"; onDetect: (event: DetectionEvent) => void }
  | { mode: "redirect"; redirectUrl: string }
  | { mode: "rewrite"; rewriteHTML: string };

export interface HardeningConfig {
  disableContextMenu?: boolean;
  disableShortcuts?: boolean;
  disableSelection?: boolean;
  disableCopy?: boolean;
  console?: "none" | "clear" | "proxy";
}

export interface NoDevtoolConfig {
  threshold?: number;
  interval?: number;
  sampleWindow?: number;
  persistence?: number;
  detectors?: Array<BuiltInDetectorId | Detector>;
  reaction?: ReactionConfig;
  hardening?: HardeningConfig;
  debug?: boolean;
}

export interface NormalizedNoDevtoolConfig {
  threshold: number;
  interval: number;
  sampleWindow: number;
  persistence: number;
  detectors: Array<BuiltInDetectorId | Detector>;
  reaction: ReactionConfig;
  hardening: HardeningConfig;
  debug: boolean;
}

export interface NoDevtoolState {
  running: boolean;
  suspended: boolean;
  open: boolean;
  confidence: number;
  signals: DetectionSignal[];
  lastDetection: DetectionEvent | null;
}

export interface NoDevtoolController {
  start(): void;
  stop(): void;
  suspend(): void;
  resume(): void;
  getState(): NoDevtoolState;
}
