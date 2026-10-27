# API reference

**Language:** [English](api.md) · [Português (Brasil)](../pt-BR/api.md)

[← Documentation home](README.md)

## `runAnalysis(options)` — `src/core/runner.ts`

Runs the full time + space campaign for one algorithm.

```ts
import { runAnalysis } from './core/runner.js';
import { makeTimeGuess, nLogN, linearSpace } from './core/guesses.js';

const result = await runAnalysis({
  algorithm: myFn,           // (input: number[]) => unknown
  algorithmName: 'my-fn',
  timeGuess: makeTimeGuess(nLogN),
  timeGuessName: 'O(n log n)',
  spaceGuess: linearSpace,
  spaceGuessName: 'O(n)',
  config: {
    problemSizes: [1_000, 10_000, 100_000],
    repetitions: 7,
    warmups: 2,
    forceGc: true,
    seed: 42,
  },
});
```

### `MeasurementConfig`

| Field | Type | Meaning |
|-------|------|---------|
| `problemSizes` | `readonly number[]` | Values of \( n \) to test |
| `repetitions` | `number` | Timed runs per \( n \) (after warm-up) |
| `warmups` | `number` | Discarded runs (JIT / GC) |
| `forceGc` | `boolean` | Call `global.gc` when available |
| `seed` | `number?` | Seed for the PRNG |

### `AnalysisResult`

Contains `measurements[]` (`AggregatedMeasurement`), `environment` (Node version, platform, CPU model), `generatedAt`, and the resolved config.

Each measurement includes medians for time and heap, theoretical values, ratios \( k_{\mathrm{time}} \) / \( k_{\mathrm{space}} \), and raw sample arrays.

## Guesses — `src/core/guesses.ts`

| Function | Model |
|----------|--------|
| `nLogN(n, c?)` | \( c \cdot n \log_2 n \) |
| `nSquared(n, c?)` | \( c \cdot n^2 \) |
| `linear(n, c?)` | \( c \cdot n \) |
| `logN(n, c?)` | \( c \cdot \log_2 n \) |
| `linearSpace(n, bytes?)` | extra space ~ bytes × n |
| `logSpace(n, frame?)` | stack ~ frame × log₂ n |
| `constantSpace(n)` | \( 1 \) |
| `makeTimeGuess(shape, opsPerMs?)` | `shape(n) / opsPerMs` |

## Measurement — `src/core/measure.ts`

- `measureOnce(algorithm, n, random, forceGc)` — single timed + heap sample  
- `collectSamples(...)` — warm-ups then `repetitions` samples  

## Reporting — `src/core/report.ts`

- `printSummary(result)` — console table and interpretation legend  
- `exportResults(result, outDir?)` — writes JSON + CSV under `results/` by default  

## Types — `src/types/index.ts`

`AlgorithmFn`, `GuessFn`, `MeasurementConfig`, `MeasurementConfigOverride`, `RunnerOptions`, `AggregatedMeasurement`, `AnalysisResult`, etc.

Exported JSON is the input for the [nodeplotlib visualization](visualization.md) (`viz/`).

## Next

- [Extending](extending.md)
- [Quality assurance](quality.md)
- [Visualization](visualization.md)
