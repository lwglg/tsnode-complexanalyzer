import { describe, expect, it } from 'vitest';

import { bubbleSort } from '../bubble-sort.js';
import { countingSort } from '../counting-sort.js';
import { heapSort } from '../heap-sort.js';
import { insertionSort } from '../insertion-sort.js';
import { mergeSort } from '../merge-sort.js';
import { quickSort } from '../quick-sort.js';
import { selectionSort } from '../selection-sort.js';

const cases: Array<{ name: string; fn: (a: number[]) => number[] }> = [
  { name: 'mergeSort', fn: mergeSort },
  { name: 'quickSort', fn: quickSort },
  { name: 'heapSort', fn: heapSort },
  { name: 'bubbleSort', fn: bubbleSort },
  { name: 'insertionSort', fn: insertionSort },
  { name: 'selectionSort', fn: selectionSort },
  { name: 'countingSort', fn: countingSort },
];

function isSorted(arr: number[]): boolean {
  for (let i = 1; i < arr.length; i++) {
    if (arr[i]! < arr[i - 1]!) return false;
  }

  return true;
}

describe.each(cases)('$name', ({ fn }) => {
  it('returns empty array for empty input', () => {
    expect(fn([])).toEqual([]);
  });

  it('returns single-element array unchanged', () => {
    expect(fn([7])).toEqual([7]);
  });

  it('sorts a shuffled array', () => {
    const input = [5, 1, 4, 2, 8, 0, 3];
    const result = fn(input);

    expect(isSorted(result)).toBe(true);
    expect(result).toHaveLength(input.length);
    expect([...result].sort((a, b) => a - b)).toEqual([...input].sort((a, b) => a - b));
  });

  it('does not mutate the original array', () => {
    const input = [3, 1, 2];
    const copy = [...input];

    fn(input);
    expect(input).toEqual(copy);
  });

  it('handles already-sorted input', () => {
    expect(fn([1, 2, 3, 4])).toEqual([1, 2, 3, 4]);
  });

  it('handles reverse-sorted input', () => {
    expect(fn([4, 3, 2, 1])).toEqual([1, 2, 3, 4]);
  });

  it('handles duplicates', () => {
    expect(fn([2, 1, 2, 1, 3])).toEqual([1, 1, 2, 2, 3]);
  });
});
