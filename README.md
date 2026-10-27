# tsnode-complexanalyzer

Empirical analysis of asymptotic **time** and **space** complexity for algorithms in TypeScript / Node.js.

Modernization of the 2022 [`empirical-tc-ts`](https://github.com/guligon90/empirical-tc-ts) project.

---

## Documentation / Documentação

| Language | Entry point |
|----------|-------------|
| **English** | [docs/en/README.md](docs/en/README.md) |
| **Português (Brasil)** | [docs/pt-BR/README.md](docs/pt-BR/README.md) |

Each documentation page links to its counterpart in the other language (toggle at the top of the page).

### English sections

- [Getting started](docs/en/getting-started.md)
- [Mathematical foundation](docs/en/method.md) — asymptotic analysis & the ratio method
- [Algorithms](docs/en/algorithms.md)
- [API reference](docs/en/api.md)
- [Quality assurance](docs/en/quality.md)
- [Extending](docs/en/extending.md)
- [Visualization (nodeplotlib)](docs/en/visualization.md)

### Seções em português

- [Primeiros passos](docs/pt-BR/getting-started.md)
- [Fundamento matemático](docs/pt-BR/method.md) — análise assintótica e o método das razões
- [Algoritmos](docs/pt-BR/algorithms.md)
- [Referência da API](docs/pt-BR/api.md)
- [Qualidade](docs/pt-BR/quality.md)
- [Estendendo](docs/pt-BR/extending.md)
- [Visualização (nodeplotlib)](docs/pt-BR/visualization.md)

---

## Quick start

```bash
pnpm install
pnpm start
node --expose-gc --import tsx src/index.ts --only=merge-sort,heap-sort
```

## Visualization

```bash
pnpm start                              # generates results/*.json
PLOT=1 pnpm start                       # also open Plotly charts
pnpm plot -- results/some-result.json   # plot saved JSON
```

See [docs/en/visualization.md](docs/en/visualization.md) / [docs/pt-BR/visualization.md](docs/pt-BR/visualization.md).

## Quality gates

```bash
pnpm format:check && pnpm lint && pnpm test:coverage && pnpm typecheck
# or:
pnpm check
```

## License

MIT
