# tsnode-complexanalyzer

**Idioma:** [English](../en/README.md) · [Português (Brasil)](README.md)

Análise empírica de complexidade assintótica de **tempo** e **espaço** para algoritmos em TypeScript / Node.js.

Este projeto moderniza o PoC de 2022 [`empirical-tc-ts`](https://github.com/guligon90/empirical-tc-ts) e o artigo [*Determining Time Complexity of Algorithms Experimentally*](https://medium.com/better-programming/determining-time-complexity-of-algorithms-experimentally-4f844a5080ec).

## Mapa da documentação

| Seção | Descrição |
|-------|-----------|
| [Primeiros passos](getting-started.md) | Instalação, execução da suíte, opções de CLI |
| [Fundamento matemático](method.md) | Notação assintótica e o método das razões |
| [Algoritmos](algorithms.md) | Algoritmos embutidos e complexidades esperadas |
| [Referência da API](api.md) | Runner, guesses, medição, exportação |
| [Qualidade](quality.md) | Lint, formatação, testes, cobertura, CI |
| [Estendendo](extending.md) | Como plugar o seu próprio algoritmo |
| [Visualização](visualization.md) | Gráficos 2D nodeplotlib (Plotly) de tempo / espaço / \( k(n) \) |

## Visão rápida

```bash
pnpm install
pnpm start
# filtro opcional:
node --expose-gc --import tsx src/index.ts --only=merge-sort,heap-sort
```

Os resultados são gravados em `./results/` (JSON e CSV).

## Licença

MIT — ver [LICENSE](../../LICENSE).
