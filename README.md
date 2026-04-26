# nodevtool

**Detect and discourage browser developer tools.** This package aims to limit DevTools access without compromising the user experience. While no defense is 100% foolproof, this tool gives content owners a reasonable level of security for their intellectual property and copyrighted content.

`nodevtool` is a browser-focused TypeScript package. It is ESM-first and targets modern browsers.

## Install

```bash
npm install nodevtool
```

## Usage

```ts
import { createNoDevtool } from "nodevtool";

const guard = createNoDevtool({
  threshold: 0.8,
  detectors: ["size", "timing", "debug-libraries"],
  reaction: {
    mode: "callback",
    onDetect(event) {
      // Decide how your app should respond.
    },
  },
});

guard.start();
```

The controller is instance-based:

```ts
guard.suspend();
guard.resume();
guard.stop();
guard.getState();
```

## Browser global build

The package also emits a browser bundle for script-tag usage:

```html
<script
  src="./dist/nodevtool.global.iife.js"
  nodevtool-auto
  threshold="0.8"
  interval="500"
  detectors="size timing debug-libraries"
  reaction="redirect"
  redirect-url="https://example.test/blocked"
></script>
```

The global bundle auto-starts only when `nodevtool-auto` is present. Without that attribute, create a controller manually from the global exports exposed by the bundle.

> [!CAUTION]
> The global bundle is not tree-shakeable and includes all built-in detectors. For production use, prefer the ESM package and a bundler with tree-shaking.

## Public API

```ts
createNoDevtool(config?: NoDevtoolConfig): NoDevtoolController;
```

Common options:

- `threshold`: confidence threshold from `0.1` to `1`; default `0.8`
- `interval`: detector sampling interval in milliseconds; default `500`
- `detectors`: built-in detector ids or custom detectors
- `reaction`: `none`, `callback`, `redirect`, or `rewrite`
- `hardening`: optional context-menu, shortcut, selection, copy, and console deterrents
- `debug`: enables internal diagnostics; default `false`

Built-in detector ids:

- `size`
- `console-format`
- `timing`
- `debugger-pause`
- `debug-libraries`

`debugger-pause` is intrusive and should be opt-in.

## Security limitations

Client-side JavaScript cannot truly prevent devtools usage or protect source code from a determined user. This package is a deterrence and signal-detection tool. Keep secrets and sensitive business logic on the server.

## Development

```bash
npm install
npm run lint
npm run format:check
npm run typecheck
npm test
npm run build
```

## License

MIT
