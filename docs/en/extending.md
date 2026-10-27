# Extending

**Language:** [English](extending.md) · [Português (Brasil)](../pt-BR/extending.md)

[← Documentation home](README.md)

## Add an algorithm

1. Implement `(input: number[]) => unknown` under `src/algorithms/`.
2. Prefer not mutating the caller’s array (copy on entry if you sort in place).
3. Export the function and add unit tests under `src/algorithms/__tests__/`.

## Register in the suite

In `src/index.ts`, push an entry onto `suite`:

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

Or call `runAnalysis` from your own script (see [API](api.md)).

## Choose a guess

Pick a shape from `src/core/guesses.ts` or write:

```ts
const myGuess = (n: number) => n * Math.log2(n + 1);
```

Wrap with `makeTimeGuess` if you want millisecond-scale ratios.

## Interpret results

See [Mathematical foundation](method.md) §3 for reading \( k(n) \). Prefer median times, inspect CSV plots, and re-run with `--expose-gc` when space ratios look noisy.
