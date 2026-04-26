/// <reference types="node" />

import { readFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";

const rootDir = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const packageJson = JSON.parse(readFileSync(resolve(rootDir, "package.json"), "utf8"));

describe("package metadata", () => {
  it("uses the no-devtool package identity and modern entrypoints", () => {
    expect(packageJson.name).toBe("no-devtool");
    expect(packageJson.description).toContain("developer tools");
    expect(packageJson.type).toBe("module");
    expect(packageJson.main).toBe("./dist/index.js");
    expect(packageJson.module).toBe("./dist/index.js");
    expect(packageJson.types).toBe("./dist/index.d.ts");
    expect(packageJson.exports["."]).toEqual({
      types: "./dist/index.d.ts",
      import: "./dist/index.js",
      default: "./dist/index.js",
    });
    expect(packageJson.unpkg).toBe("./dist/nodevtool.global.iife.js");
    expect(packageJson.jsdelivr).toBe("./dist/nodevtool.global.iife.js");
    expect(packageJson.files).toEqual(["dist", "README.md", "LICENSE"]);
  });
});
