/**
 * Insertion Sort – O(n²) time average/worst, O(n) best (already sorted).
 * O(1) extra space.
 */

export function insertionSort(array: number[]): number[] {
  const a = [...array];

  for (let i = 1; i < a.length; i++) {
    const key = a[i]!;
    let j = i - 1;

    while (j >= 0 && a[j]! > key) {
      a[j + 1] = a[j]!;
      j--;
    }

    a[j + 1] = key;
  }

  return a;
}

export default insertionSort;
