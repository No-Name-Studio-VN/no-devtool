import { defineConfig } from "tsdown";

export default defineConfig([
  {
    entry: {
      index: "src/index.ts",
    },
    format: ["esm"],
    platform: "browser",
    target: "es2020",
    dts: {
      sourcemap: true,
    },
    clean: true,
    minify: true,
    sourcemap: true,
  },
  {
    entry: {
      "nodevtool.global": "src/browser.ts",
    },
    format: ["iife"],
    platform: "browser",
    target: "es2020",
    globalName: "NoDevtool",
    clean: false,
    minify: true,
    sourcemap: true,
  },
]);
