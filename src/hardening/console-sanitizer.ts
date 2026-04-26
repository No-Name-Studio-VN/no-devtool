import type { HardeningConfig } from "../type";

const original = {
  log: console.log,
  debug: console.debug,
  info: console.info,
  warn: console.warn,
};

let proxyUsers = 0;

export function applyConsoleSanitizer(mode: HardeningConfig["console"]) {
  if (!mode || mode === "none") return () => undefined;
  if (mode === "clear") {
    const timer = window.setInterval(() => console.clear(), 500);
    return () => window.clearInterval(timer);
  }
  proxyUsers += 1;
  if (proxyUsers === 1) {
    console.log = noop;
    console.debug = noop;
    console.info = noop;
    console.warn = noop;
  }
  return () => {
    proxyUsers = Math.max(0, proxyUsers - 1);
    if (proxyUsers > 0) return;
    console.log = original.log;
    console.debug = original.debug;
    console.info = original.info;
    console.warn = original.warn;
  };
}

function noop() {
  return undefined;
}
