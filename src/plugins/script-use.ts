import type { BuiltInDetectorId, HardeningConfig, NoDevtoolConfig, ReactionConfig } from "../type";

const detectorIds: BuiltInDetectorId[] = [
  "size",
  "console-format",
  "timing",
  "debugger-pause",
  "debug-libraries",
];

export function checkScriptUse(): NoDevtoolConfig | null {
  if (typeof window === "undefined" || !window.document) return null;
  const dom = document.querySelector("[nodevtool-auto]");
  if (!dom) return null;

  const config: NoDevtoolConfig = {};
  const threshold = numberAttr(dom, "threshold");
  const interval = numberAttr(dom, "interval");
  const detectors = detectorAttr(dom);
  const reaction = reactionAttr(dom);
  const hardening = hardeningAttrs(dom);

  if (threshold !== undefined) config.threshold = threshold;
  if (interval !== undefined) config.interval = interval;
  if (detectors !== undefined) config.detectors = detectors;
  if (reaction !== undefined) config.reaction = reaction;
  if (Object.keys(hardening).length > 0) config.hardening = hardening;

  return config;
}

function numberAttr(dom: Element, name: string) {
  const value = dom.getAttribute(name);
  if (value === null) return undefined;
  const parsed = Number(value);
  return Number.isNaN(parsed) ? undefined : parsed;
}

function boolAttr(dom: Element, name: string) {
  const value = dom.getAttribute(name);
  if (value === null) return undefined;
  return value === "false" ? false : true;
}

function detectorAttr(dom: Element) {
  const value = dom.getAttribute("detectors");
  if (value === null) return undefined;
  return value
    .split(/\s+/)
    .filter((id): id is BuiltInDetectorId => detectorIds.includes(id as BuiltInDetectorId));
}

function reactionAttr(dom: Element): ReactionConfig | undefined {
  const mode = dom.getAttribute("reaction");
  if (mode === "redirect") {
    const redirectUrl = dom.getAttribute("redirect-url");
    return redirectUrl ? { mode, redirectUrl } : undefined;
  }
  if (mode === "rewrite") {
    const rewriteHTML = dom.getAttribute("rewrite-html");
    return rewriteHTML ? { mode, rewriteHTML } : undefined;
  }
  if (mode === "none") return { mode };
  return undefined;
}

function hardeningAttrs(dom: Element): HardeningConfig {
  return stripUndefined({
    disableContextMenu: boolAttr(dom, "disable-context-menu"),
    disableShortcuts: boolAttr(dom, "disable-shortcuts"),
    disableSelection: boolAttr(dom, "disable-selection"),
    disableCopy: boolAttr(dom, "disable-copy"),
    console: consoleAttr(dom),
  });
}

function consoleAttr(dom: Element): HardeningConfig["console"] | undefined {
  const value = dom.getAttribute("console");
  return value === "none" || value === "clear" || value === "proxy" ? value : undefined;
}

function stripUndefined<T extends Record<string, unknown>>(value: T) {
  return Object.fromEntries(
    Object.entries(value).filter((entry) => entry[1] !== undefined),
  ) as Partial<T>;
}
