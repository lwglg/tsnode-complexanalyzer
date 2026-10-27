/**
 * Classic bubble sort – O(n²) time, O(1) extra space.
 * Useful as a contrasting example against merge sort.
 */

export function bubbleSort(array: number[]): number[] {
  const a = [...array]; // work on a copy
  const n = a.length;

  for (let i = 0; i < n - 1; i++) {
    for (let j = 0; j < n - i - 1; j++) {
      if (a[j]! > a[j + 1]!) {
        const tmp = a[j]!;

        a[j] = a[j + 1]!;
        a[j + 1] = tmp;
      }
    }
  }

  return a;
}

export default bubbleSort;
