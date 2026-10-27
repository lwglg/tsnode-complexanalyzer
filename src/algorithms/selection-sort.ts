/**
 * Selection Sort – O(n²) time, O(1) extra space.
 * Always performs ~n²/2 comparisons regardless of input order.
 */

export function selectionSort(array: number[]): number[] {
  const a = [...array];
  const n = a.length;

  for (let i = 0; i < n - 1; i++) {
    let minIdx = i;

    for (let j = i + 1; j < n; j++) {
      if (a[j]! < a[minIdx]!) minIdx = j;
    }

    if (minIdx !== i) {
      [a[i], a[minIdx]] = [a[minIdx]!, a[i]!];
    }
  }

  return a;
}

export default selectionSort;
