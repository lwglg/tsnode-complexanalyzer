# Getting started

**Language:** [English](getting-started.md) · [Português (Brasil)](../pt-BR/getting-started.md)

[← Documentation home](README.md)

## Requirements

- **Node.js** ≥ 20 (22 LTS recommended)
- **pnpm** ≥ 12 — enable with `corepack enable`

## Install

```bash
pnpm install
```

## Run the analysis suite

```bash
pnpm start
# equivalent:
pnpm analyze
```

For more stable heap measurements, expose the GC and force collections between samples:

```bash
node --expose-gc --import tsx src/index.ts
```

### Filter algorithms

```bash
node --expose-gc --import tsx src/index.ts --only=merge-sort,heap-sort,array-sum
```

Available names: `merge-sort`, `quick-sort`, `heap-sort`, `bubble-sort`, `insertion-sort`, `selection-sort`, `counting-sort`, `array-sum`, `find-max`, `array-copy`.

## Outputs

Each run exports:

| Artifact | Content |
|----------|---------|
| `results/<algo>_<timestamp>.json` | Full result: measurements, environment, config |
| `results/<algo>_<timestamp>.csv` | Tabular series for spreadsheets / plotting |

## Development scripts

| Script | Purpose |
|--------|---------|
| `pnpm start` / `pnpm analyze` | Run the suite |
| `pnpm dev` | Watch mode via `tsx` |
| `pnpm build` | Compile TypeScript → `dist/` |
| `pnpm typecheck` | `tsc --noEmit` |
| `pnpm lint` / `pnpm lint:fix` | ESLint |
| `pnpm format` / `pnpm format:check` | Prettier |
| `pnpm test` / `pnpm test:coverage` | Vitest (coverage ≥ 80%) |
| `pnpm check` | typecheck + lint + format + coverage |

## Results and visualization

JSON/CSV under `./results/` can be plotted with **nodeplotlib** (Plotly):

```bash
PLOT=1 pnpm start
pnpm plot -- results/merge-sort_*.json
```

Details: [Visualization (nodeplotlib)](visualization.md).

## Next

- Understand the [mathematical foundation](method.md)
- Browse [built-in algorithms](algorithms.md)
- Explore [Visualization](visualization.md)
