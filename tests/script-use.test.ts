import { beforeEach, describe, expect, it } from "vitest";
import { checkScriptUse } from "../src/plugins/script-use";

describe("script-tag configuration", () => {
  beforeEach(() => {
    document.body.innerHTML = "";
  });

  it("reads nodevtool-auto attributes for the modern controller", () => {
    document.body.innerHTML = `
      <script
        nodevtool-auto
        threshold="0.75"
        interval="250"
        detectors="size timing debug-libraries"
        reaction="redirect"
        redirect-url="https://example.test/blocked"
        disable-context-menu="true"
        disable-shortcuts="true"
        console="proxy"
      ></script>
    `;

    expect(checkScriptUse()).toEqual({
      threshold: 0.75,
      interval: 250,
      detectors: ["size", "timing", "debug-libraries"],
      reaction: { mode: "redirect", redirectUrl: "https://example.test/blocked" },
      hardening: { disableContextMenu: true, disableShortcuts: true, console: "proxy" },
    });
  });

  it("ignores the previous auto-start attribute", () => {
    const legacyAttribute = ["disable", "devtool-auto"].join("-");
    document.body.innerHTML = `<script ${legacyAttribute} interval="250"></script>`;

    expect(checkScriptUse()).toBeNull();
  });
});
