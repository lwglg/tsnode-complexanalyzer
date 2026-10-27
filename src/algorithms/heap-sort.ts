/**
 * HeapSort – O(n log n) time, O(1) extra space (in-place).
 */

function heapify(a: number[], n: number, i: number): void {
  let largest = i;
  const left = 2 * i + 1;
  const right = 2 * i + 2;

  if (left < n && a[left]! > a[largest]!) largest = left;

  if (right < n && a[right]! > a[largest]!) largest = right;

  if (largest !== i) {
    [a[i], a[largest]] = [a[largest]!, a[i]!];
    heapify(a, n, largest);
  }
}

export function heapSort(array: number[]): number[] {
  const a = [...array];
  const n = a.length;

  // Build max-heap
  for (let i = Math.floor(n / 2) - 1; i >= 0; i--) {
    heapify(a, n, i);
  }

  // Extract elements one by one
  for (let i = n - 1; i > 0; i--) {
    [a[0], a[i]] = [a[i]!, a[0]!];
    heapify(a, i, 0);
  }

  return a;
}

export default heapSort;
