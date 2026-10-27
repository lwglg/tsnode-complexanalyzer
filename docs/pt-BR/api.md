# Referência da API

**Idioma:** [English](../en/api.md) · [Português (Brasil)](api.md)

[← Início da documentação](README.md)

## `runAnalysis(options)` — `src/core/runner.ts`

Executa a campanha completa de tempo + espaço para um algoritmo.

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

| Campo | Tipo | Significado |
|-------|------|-------------|
| `problemSizes` | `readonly number[]` | Valores de \( n \) a testar |
| `repetitions` | `number` | Execuções cronometradas por \( n \) (após aquecimento) |
| `warmups` | `number` | Execuções descartadas (JIT / GC) |
| `forceGc` | `boolean` | Chama `global.gc` quando disponível |
| `seed` | `number?` | Semente do PRNG |

### `AnalysisResult`

Contém `measurements[]` (`AggregatedMeasurement`), `environment` (versão do Node, plataforma, modelo de CPU), `generatedAt` e a config resolvida.

Cada medição inclui medianas de tempo e heap, valores teóricos, razões \( k_{\mathrm{time}} \) / \( k_{\mathrm{space}} \) e os vetores brutos de amostras.

## Hipóteses — `src/core/guesses.ts`

| Função | Modelo |
|--------|--------|
| `nLogN(n, c?)` | \( c \cdot n \log_2 n \) |
| `nSquared(n, c?)` | \( c \cdot n^2 \) |
| `linear(n, c?)` | \( c \cdot n \) |
| `logN(n, c?)` | \( c \cdot \log_2 n \) |
| `linearSpace(n, bytes?)` | espaço extra ~ bytes × n |
| `logSpace(n, frame?)` | pilha ~ frame × log₂ n |
| `constantSpace(n)` | \( 1 \) |
| `makeTimeGuess(shape, opsPerMs?)` | `shape(n) / opsPerMs` |

## Medição — `src/core/measure.ts`

- `measureOnce(algorithm, n, random, forceGc)` — uma amostra de tempo + heap  
- `collectSamples(...)` — aquecimentos e depois `repetitions` amostras  

## Relatórios — `src/core/report.ts`

- `printSummary(result)` — tabela no console e legenda de interpretação  
- `exportResults(result, outDir?)` — grava JSON + CSV em `results/` por padrão  

## Tipos — `src/types/index.ts`

`AlgorithmFn`, `GuessFn`, `MeasurementConfig`, `MeasurementConfigOverride`, `RunnerOptions`, `AggregatedMeasurement`, `AnalysisResult`, etc.

O JSON exportado é a entrada da [visualização nodeplotlib](visualization.md) (`viz/`).

## Próximos passos

- [Estendendo](extending.md)
- [Qualidade](quality.md)
- [Visualização](visualization.md)
