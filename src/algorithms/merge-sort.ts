/**
 * Classic top-down merge sort (stable, O(n log n) time, O(n) extra space).
 * Taken / adapted from the original empirical-tc-ts project.
 */

type CompareFn = (a: number, b: number) => number;

const defaultCompare: CompareFn = (a, b) => (a === b ? 0 : a < b ? -1 : 1);

function merge(left: number[], right: number[], compare: CompareFn): number[] {
  let i = 0;
  let j = 0;
  const result: number[] = [];

  while (i < left.length && j < right.length) {
    result.push(compare(left[i]!, right[j]!) <= 0 ? left[i++]! : right[j++]!);
  }

  return result.concat(i < left.length ? left.slice(i) : right.slice(j));
}

export function mergeSort(array: number[], compare: CompareFn = defaultCompare): number[] {
  if (array.length <= 1) return array;

  const mid = Math.floor(array.length / 2);
  const left = mergeSort(array.slice(0, mid), compare);
  const right = mergeSort(array.slice(mid), compare);

  return merge(left, right, compare);
}

export default mergeSort;
