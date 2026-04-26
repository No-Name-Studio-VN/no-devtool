import type { HardeningConfig } from "../type";

export function applyInputBlockers(config: HardeningConfig) {
  const cleanups: Array<() => void> = [];
  if (config.disableContextMenu) cleanups.push(addPreventedListener(window, "contextmenu"));
  if (config.disableSelection) cleanups.push(addPreventedListener(window, "selectstart"));
  if (config.disableCopy) cleanups.push(addPreventedListener(window, "copy"));
  if (config.disableShortcuts) cleanups.push(addShortcutBlocker(window));
  return () => cleanups.splice(0).forEach((cleanup) => cleanup());
}

function addPreventedListener(target: Window, type: string) {
  const listener = (event: Event) => event.preventDefault();
  target.addEventListener(type, listener, true);
  return () => target.removeEventListener(type, listener, true);
}

function addShortcutBlocker(target: Window) {
  const listener = (event: KeyboardEvent) => {
    const key = event.key.toLowerCase();
    const devtoolsShortcut =
      event.key === "F12" ||
      ((event.ctrlKey || event.metaKey) && event.shiftKey && ["i", "j", "c"].includes(key));
    const sourceShortcut = (event.ctrlKey || event.metaKey) && ["u", "s"].includes(key);
    if (devtoolsShortcut || sourceShortcut) event.preventDefault();
  };
  target.addEventListener("keydown", listener, true);
  return () => target.removeEventListener("keydown", listener, true);
}
