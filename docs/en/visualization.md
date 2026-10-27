# Visualization with nodeplotlib

**Language:** [English](visualization.md) · [Português (Brasil)](../pt-BR/visualization.md)

[← Documentation home](README.md)

## Overview

Empirical results (`AnalysisResult` JSON / in-memory objects) are plotted as **interactive 2D charts** using [nodeplotlib](https://www.npmjs.com/package/nodeplotlib) (Plotly.js served from Node, no separate front-end build).

This replaces the earlier Three.js prototype: complexity series are naturally 2D (\(n\) vs cost or \(k\)), and Plotly gives log axes, legends, and zoom with less ceremony.

## Charts produced

For each result, up to three figures are opened:

| Chart | Series |
|-------|--------|
| **Time** | Measured median time (ms) vs theoretical time |
| **Space** | Measured heap (KiB) vs theoretical space |
| **Ratios** | \( k_{\mathrm{time}}(n) \) and \( k_{\mathrm{space}}(n) \) |

By default the **\(n\) axis is logarithmic**, which matches how asymptotic growth is read.

### Reading the ratio chart

| Shape of \( k(n) \) | Interpretation |
|--------------------|----------------|
| Flattens toward a positive constant | Guess order is plausible |
| Drifts toward 0 | Guess under-estimates growth |
| Climbs without bound | Guess over-estimates growth |

See [Mathematical foundation](method.md).

## Usage

### After a suite run (environment flag)

```bash
PLOT=1 pnpm start
# or
PLOT=1 node --expose-gc --import tsx src/index.ts --only=merge-sort
```

When `PLOT=1` (or `true`), `exportResults` also calls `plotAnalysisResult`.

### From saved JSON

```bash
pnpm plot -- results/merge-sort_2026-….json
pnpm plot -- results/*.json
```

(`pnpm viz` is an alias of `pnpm plot`.)

### Programmatic API

```ts
import { plotAnalysisResult } from './core/plot.js';

plotAnalysisResult(result, {
  time: true,
  space: true,
  ratios: true,
  logN: true,
});
```

Implementation: `src/core/plot.ts` · CLI: `src/plot-cli.ts`.

## Dependency

```json
"dependencies": {
  "nodeplotlib": "^1.1.2"
}
```

nodeplotlib starts a small local server and opens the system browser. Firewall or headless CI environments may need to skip plotting (`PLOT` unset).

## Why not Three.js here?

| Approach | Fit for this project |
|----------|----------------------|
| **nodeplotlib / Plotly 2D** | Direct match for \(n\)–cost and \(k(n)\) series; log axes built-in |
| Three.js 3D | Better for joint volumetric exploration; heavier for standard complexity curves |

## Next

- [API reference](api.md) — `exportResults` / result shape  
- [Getting started](getting-started.md)
