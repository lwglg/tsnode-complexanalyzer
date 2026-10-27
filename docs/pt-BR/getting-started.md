# Primeiros passos

**Idioma:** [English](../en/getting-started.md) · [Português (Brasil)](getting-started.md)

[← Início da documentação](README.md)

## Requisitos

- **Node.js** ≥ 20 (recomendado 22 LTS)
- **pnpm** ≥ 12 — ative com `corepack enable`

## Instalação

```bash
pnpm install
```

## Executar a suíte de análise

```bash
pnpm start
# equivalente:
pnpm analyze
```

Para medições de heap mais estáveis, exponha o GC e force coletas entre amostras:

```bash
node --expose-gc --import tsx src/index.ts
```

### Filtrar algoritmos

```bash
node --expose-gc --import tsx src/index.ts --only=merge-sort,heap-sort,array-sum
```

Nomes disponíveis: `merge-sort`, `quick-sort`, `heap-sort`, `bubble-sort`, `insertion-sort`, `selection-sort`, `counting-sort`, `array-sum`, `find-max`, `array-copy`.

## Saídas

| Artefato | Conteúdo |
|----------|----------|
| `results/<algo>_<timestamp>.json` | Resultado completo: medições, ambiente, config |
| `results/<algo>_<timestamp>.csv` | Séries tabulares para planilhas / gráficos |

## Scripts de desenvolvimento

| Script | Propósito |
|--------|-----------|
| `pnpm start` / `pnpm analyze` | Executa a suíte |
| `pnpm dev` | Modo watch via `tsx` |
| `pnpm build` | Compila TypeScript → `dist/` |
| `pnpm typecheck` | `tsc --noEmit` |
| `pnpm lint` / `pnpm lint:fix` | ESLint |
| `pnpm format` / `pnpm format:check` | Prettier |
| `pnpm test` / `pnpm test:coverage` | Vitest (cobertura ≥ 80%) |
| `pnpm check` | typecheck + lint + format + cobertura |

## Resultados e visualização

JSON/CSV em `./results/` podem ser plotados com **nodeplotlib** (Plotly):

```bash
PLOT=1 pnpm start
pnpm plot -- results/merge-sort_*.json
```

Detalhes: [Visualização (nodeplotlib)](visualization.md).

## Próximos passos

- Entender o [fundamento matemático](method.md)
- Ver os [algoritmos embutidos](algorithms.md)
- Explorar a [Visualização](visualization.md)
