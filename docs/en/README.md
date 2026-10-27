# tsnode-complexanalyzer

**Language:** [English](README.md) · [Português (Brasil)](../pt-BR/README.md)

Empirical analysis of asymptotic **time** and **space** complexity for algorithms written in TypeScript / Node.js.

This project modernizes the 2022 PoC [`empirical-tc-ts`](https://github.com/guligon90/empirical-tc-ts) and the article [*Determining Time Complexity of Algorithms Experimentally*](https://medium.com/better-programming/determining-time-complexity-of-algorithms-experimentally-4f844a5080ec).

## Documentation map

| Section | Description |
|---------|-------------|
| [Getting started](getting-started.md) | Install, run the suite, CLI options |
| [Mathematical foundation](method.md) | Asymptotic notation and the ratio method |
| [Algorithms](algorithms.md) | Built-in algorithms and expected complexities |
| [API reference](api.md) | Runner, guesses, measurement, export |
| [Quality assurance](quality.md) | Lint, format, tests, coverage, CI |
| [Extending](extending.md) | Plug in your own algorithm |
| [Visualization](visualization.md) | nodeplotlib (Plotly) 2D plots of time / space / \( k(n) \) |

## At a glance

```bash
pnpm install
pnpm start
# optional filter:
node --expose-gc --import tsx src/index.ts --only=merge-sort,heap-sort
```

Results are written under `./results/` as JSON and CSV.

## License

MIT — see [LICENSE](../../LICENSE).
