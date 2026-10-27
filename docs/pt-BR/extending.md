# Estendendo

**Idioma:** [English](../en/extending.md) · [Português (Brasil)](extending.md)

[← Início da documentação](README.md)

## Adicionar um algoritmo

1. Implemente `(input: number[]) => unknown` em `src/algorithms/`.
2. Prefira não mutar o vetor do chamador (copie na entrada se ordenar in-place).
3. Exporte a função e adicione testes em `src/algorithms/__tests__/`.

## Registrar na suíte

Em `src/index.ts`, inclua uma entrada em `suite`:

```ts
{
  algorithm: myAlgorithm,
  algorithmName: 'my-algorithm',
  timeGuess: makeTimeGuess(nLogN, 4e5),
  timeGuessName: 'O(n log n)',
  spaceGuess: linearSpace,
  spaceGuessName: 'O(n)',
  config: PRESETS.efficient,
}
```

Ou chame `runAnalysis` no seu próprio script (ver [API](api.md)).

## Escolher uma hipótese

Use um formato de `src/core/guesses.ts` ou escreva:

```ts
const myGuess = (n: number) => n * Math.log2(n + 1);
```

Envolva com `makeTimeGuess` se quiser razões na escala de milissegundos.

## Interpretar resultados

Veja [Fundamento matemático](method.md) §3 para ler \( k(n) \). Prefira medianas de tempo, inspecione os CSVs e rode de novo com `--expose-gc` quando as razões de espaço parecerem ruidosas.
