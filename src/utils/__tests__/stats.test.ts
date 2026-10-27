import { describe, expect, it } from 'vitest';

import { mean, median, stdDev, trimmedMean } from '../stats.js';

describe('median', () => {
  it('returns NaN for empty input', () => {
    expect(median([])).toBeNaN();
  });

  it('returns the single element', () => {
    expect(median([42])).toBe(42);
  });

  it('returns middle value for odd-length arrays', () => {
    expect(median([3, 1, 2])).toBe(2);
  });

  it('returns average of two middle values for even-length arrays', () => {
    expect(median([1, 2, 3, 4])).toBe(2.5);
  });

  it('does not mutate the input', () => {
    const input = [3, 1, 2];

    median(input);
    expect(input).toEqual([3, 1, 2]);
  });
});

describe('mean', () => {
  it('returns NaN for empty input', () => {
    expect(mean([])).toBeNaN();
  });

  it('computes arithmetic mean', () => {
    expect(mean([1, 2, 3, 4])).toBe(2.5);
  });
});

describe('stdDev', () => {
  it('returns 0 for fewer than 2 samples', () => {
    expect(stdDev([])).toBe(0);
    expect(stdDev([1])).toBe(0);
  });

  it('computes sample standard deviation', () => {
    // population [2, 4, 4, 4, 5, 5, 7, 9] sample std ≈ 2.138
    const values = [2, 4, 4, 4, 5, 5, 7, 9];

    expect(stdDev(values)).toBeCloseTo(2.138, 2);
  });
});

describe('trimmedMean', () => {
  it('returns NaN for empty input', () => {
    expect(trimmedMean([])).toBeNaN();
  });

  it('drops extremes according to trim fraction', () => {
    // 10% of 10 = 1 from each side → mean of middle 8
    const values = [1, 2, 3, 4, 5, 6, 7, 8, 9, 100];

    expect(trimmedMean(values, 0.1)).toBe(mean([2, 3, 4, 5, 6, 7, 8, 9]));
  });

  it('falls back to full mean when trim would empty the array', () => {
    expect(trimmedMean([10, 20], 0.5)).toBe(15);
  });
});
