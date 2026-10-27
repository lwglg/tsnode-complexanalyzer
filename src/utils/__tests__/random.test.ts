import { describe, expect, it } from 'vitest';

import { createSeededRandom, randomArray } from '../random.js';

describe('createSeededRandom', () => {
  it('is deterministic for the same seed', () => {
    const a = createSeededRandom(123);
    const b = createSeededRandom(123);
    const seqA = Array.from({ length: 20 }, () => a());
    const seqB = Array.from({ length: 20 }, () => b());

    expect(seqA).toEqual(seqB);
  });

  it('produces different sequences for different seeds', () => {
    const a = createSeededRandom(1);
    const b = createSeededRandom(2);
    const seqA = Array.from({ length: 10 }, () => a());
    const seqB = Array.from({ length: 10 }, () => b());

    expect(seqA).not.toEqual(seqB);
  });

  it('returns values in [0, 1)', () => {
    const rng = createSeededRandom(99);

    for (let i = 0; i < 100; i++) {
      const v = rng();

      expect(v).toBeGreaterThanOrEqual(0);
      expect(v).toBeLessThan(1);
    }
  });
});

describe('randomArray', () => {
  it('returns an array of the requested length', () => {
    expect(randomArray(5, 10, () => 0.5)).toHaveLength(5);
  });

  it('uses the provided RNG', () => {
    // Math.floor(0 * max) + 1 = 1 for every element
    const arr = randomArray(4, 100, () => 0);

    expect(arr).toEqual([1, 1, 1, 1]);
  });

  it('values are in [1, max]', () => {
    const rng = createSeededRandom(7);
    const arr = randomArray(50, 20, rng);

    for (const v of arr) {
      expect(v).toBeGreaterThanOrEqual(1);
      expect(v).toBeLessThanOrEqual(20);
    }
  });
});
