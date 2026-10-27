import { describe, expect, it } from 'vitest';

import { arrayCopy, arraySum, findMax } from '../linear-scan.js';

describe('arraySum', () => {
  it('returns 0 for empty array', () => {
    expect(arraySum([])).toBe(0);
  });

  it('sums numbers', () => {
    expect(arraySum([1, 2, 3, 4])).toBe(10);
  });
});

describe('findMax', () => {
  it('returns -Infinity for empty array', () => {
    expect(findMax([])).toBe(Number.NEGATIVE_INFINITY);
  });

  it('finds the maximum', () => {
    expect(findMax([1, 9, 3, 7])).toBe(9);
  });
});

describe('arrayCopy', () => {
  it('returns a shallow copy', () => {
    const input = [1, 2, 3];
    const copy = arrayCopy(input);

    expect(copy).toEqual(input);
    expect(copy).not.toBe(input);
  });
});
