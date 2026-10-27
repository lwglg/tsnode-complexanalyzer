/**
 * Simple linear scans – useful as O(n) time / O(1) space baselines.
 */

/** Sum of array elements. */
export function arraySum(array: number[]): number {
  let s = 0;

  for (const x of array) s += x;

  return s;
}

/** Find maximum value. */
export function findMax(array: number[]): number {
  if (array.length === 0) return Number.NEGATIVE_INFINITY;

  let m = array[0]!;

  for (let i = 1; i < array.length; i++) {
    if (array[i]! > m) m = array[i]!;
  }

  return m;
}

/** Copy the array (forces O(n) space allocation). */
export function arrayCopy(array: number[]): number[] {
  return array.slice();
}
