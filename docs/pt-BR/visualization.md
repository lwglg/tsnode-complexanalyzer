# Visualização com nodeplotlib

**Idioma:** [English](../en/visualization.md) · [Português (Brasil)](visualization.md)

[← Início da documentação](README.md)

## Visão geral

Os resultados empíricos (JSON `AnalysisResult` ou objetos em memória) são plotados como **gráficos 2D interativos** com [nodeplotlib](https://www.npmjs.com/package/nodeplotlib) (Plotly.js servido a partir do Node, sem front-end separado).

Isto substitui o protótipo anterior em Three.js: séries de complexidade são naturalmente 2D (\(n\) vs custo ou \(k\)), e o Plotly oferece eixos log, legendas e zoom com menos cerimônia.

## Gráficos gerados

Para cada resultado, abrem-se até três figuras:

| Gráfico | Séries |
|---------|--------|
| **Tempo** | Tempo mediano medido (ms) vs tempo teórico |
| **Espaço** | Heap medido (KiB) vs espaço teórico |
| **Razões** | \( k_{\mathrm{time}}(n) \) e \( k_{\mathrm{space}}(n) \) |

Por padrão o **eixo \(n\) é logarítmico**.

### Como ler o gráfico de razões

| Forma de \( k(n) \) | Interpretação |
|--------------------|---------------|
| Estabiliza em constante positiva | Ordem da hipótese é plausível |
| Cai em direção a 0 | Hipótese subestima o crescimento |
| Sobe sem limite | Hipótese superestima o crescimento |

Ver [Fundamento matemático](method.md).

## Uso

### Após a suíte (variável de ambiente)

```bash
PLOT=1 pnpm start
# ou
PLOT=1 node --expose-gc --import tsx src/index.ts --only=merge-sort
```

Com `PLOT=1` (ou `true`), `exportResults` também chama `plotAnalysisResult`.

### A partir de JSON salvo

```bash
pnpm plot -- results/merge-sort_2026-….json
pnpm plot -- results/*.json
```

(`pnpm viz` é alias de `pnpm plot`.)

### API programática

```ts
import { plotAnalysisResult } from './core/plot.js';

plotAnalysisResult(result, {
  time: true,
  space: true,
  ratios: true,
  logN: true,
});
```

Implementação: `src/core/plot.ts` · CLI: `src/plot-cli.ts`.

## Dependência

```json
"dependencies": {
  "nodeplotlib": "^1.1.2"
}
```

O nodeplotlib sobe um servidor local e abre o navegador. Em CI headless, deixe `PLOT` indefinido.

## Por que não Three.js aqui?

| Abordagem | Adequação |
|-----------|-----------|
| **nodeplotlib / Plotly 2D** | Combina com séries \(n\)–custo e \(k(n)\); eixos log nativos |
| Three.js 3D | Melhor para exploração volumétrica; mais pesado para curvas clássicas |

## Próximos passos

- [Referência da API](api.md)  
- [Primeiros passos](getting-started.md)
