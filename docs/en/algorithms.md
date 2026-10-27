# Algorithms

**Language:** [English](algorithms.md) · [Português (Brasil)](../pt-BR/algorithms.md)

[← Documentation home](README.md)

Built-in algorithms live under `src/algorithms/`. Each is exercised by the suite in `src/index.ts` with matching theoretical guesses.

## Comparison sorts

| Name | Module | Time (expected) | Extra space | Notes |
|------|--------|-----------------|-------------|-------|
| merge-sort | `merge-sort.ts` | \( O(n \log n) \) | \( O(n) \) | Stable top-down mergesort |
| quick-sort | `quick-sort.ts` | \( O(n \log n) \) avg | \( O(\log n) \) stack | Lomuto partition; copy-on-entry |
| heap-sort | `heap-sort.ts` | \( O(n \log n) \) | \( O(1) \) | In-place heapify |
| bubble-sort | `bubble-sort.ts` | \( O(n^2) \) | \( O(1) \) | Classic adjacent swaps |
| insertion-sort | `insertion-sort.ts` | \( O(n^2) \) | \( O(1) \) | Adaptive on nearly sorted data |
| selection-sort | `selection-sort.ts` | \( O(n^2) \) | \( O(1) \) | ~\( n^2/2 \) comparisons always |

## Linear / special

| Name | Module | Time (expected) | Extra space | Notes |
|------|--------|-----------------|-------------|-------|
| counting-sort | `counting-sort.ts` | \( O(n + k) \approx O(n) \) | \( O(n + k) \) | Demo uses values in \( [1, n] \) |
| array-sum | `linear-scan.ts` | \( O(n) \) | \( O(1) \) | Baseline |
| find-max | `linear-scan.ts` | \( O(n) \) | \( O(1) \) | Baseline |
| array-copy | `linear-scan.ts` | \( O(n) \) | \( O(n) \) | Forces allocation |

## Size presets

| Preset | Typical use | Example sizes |
|--------|-------------|---------------|
| `efficient` | \( O(n \log n) \) sorts | 1k … 100k |
| `quadratic` | \( O(n^2) \) sorts | 500 … 8k |
| `linear` | Linear scans | 10k … 1M |

## Correctness tests

Unit tests in `src/algorithms/__tests__/` assert sorting invariants (empty, singleton, shuffled, sorted, reverse, duplicates) and linear-scan behaviour.

## Next

- [API reference](api.md)
- [Extending with your algorithm](extending.md)
