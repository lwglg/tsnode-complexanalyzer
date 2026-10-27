/**
 * In-place QuickSort (Lomuto partition).
 * Average: O(n log n) time, O(log n) stack space.
 * Worst:   O(n²) time (rare with random pivot / random input).
 */

function partition(a: number[], lo: number, hi: number): number {
  const pivot = a[hi]!;
  let i = lo;

  for (let j = lo; j < hi; j++) {
    if (a[j]! <= pivot) {
      [a[i], a[j]] = [a[j]!, a[i]!];
      i++;
    }
  }

  [a[i], a[hi]] = [a[hi]!, a[i]!];

  return i;
}

function qs(a: number[], lo: number, hi: number): void {
  if (lo < hi) {
    const p = partition(a, lo, hi);

    qs(a, lo, p - 1);
    qs(a, p + 1, hi);
  }
}

export function quickSort(array: number[]): number[] {
  const a = [...array]; // copy so we don't mutate caller's data

  if (a.length > 1) qs(a, 0, a.length - 1);

  return a;
}

export default quickSort;
