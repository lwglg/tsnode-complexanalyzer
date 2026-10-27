/**
 * Counting Sort for non-negative integers in a known range.
 * Time: O(n + k) where k = max value.  Space: O(n + k).
 * In this demo we treat the range as O(n) (values generated in [1, n]),
 * so overall behaviour is expected to be linear.
 */

export function countingSort(array: number[]): number[] {
  if (array.length === 0) return [];

  let max = array[0]!;

  for (const v of array) if (v > max) max = v;

  const count = new Array<number>(max + 1).fill(0);

  for (const v of array) count[v]!++;

  const result: number[] = [];

  for (let i = 0; i <= max; i++) {
    for (let c = 0; c < count[i]!; c++) {
      result.push(i);
    }
  }

  return result;
}

export default countingSort;
