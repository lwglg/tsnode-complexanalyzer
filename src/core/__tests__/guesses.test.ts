import { describe, expect, it } from 'vitest';

import {
  constantSpace,
  linear,
  linearSpace,
  logN,
  logSpace,
  makeTimeGuess,
  nLogN,
  nSquared,
} from '../guesses.js';

describe('nLogN', () => {
  it('returns 0 for n <= 1', () => {
    expect(nLogN(0)).toBe(0);
    expect(nLogN(1)).toBe(0);
  });

  it('scales with c * n * log2(n)', () => {
    expect(nLogN(8, 1)).toBeCloseTo(8 * 3, 10);
    expect(nLogN(8, 2)).toBeCloseTo(2 * 8 * 3, 10);
  });
});

describe('nSquared', () => {
  it('returns n²', () => {
    expect(nSquared(10)).toBe(100);
    expect(nSquared(10, 2)).toBe(200);
  });
});

describe('linear', () => {
  it('returns c * n', () => {
    expect(linear(50)).toBe(50);
    expect(linear(50, 3)).toBe(150);
  });
});

describe('logN', () => {
  it('returns 0 for n <= 1', () => {
    expect(logN(1)).toBe(0);
  });

  it('returns log2(n)', () => {
    expect(logN(16)).toBe(4);
  });
});

describe('linearSpace', () => {
  it('defaults to 8 bytes per element', () => {
    expect(linearSpace(100)).toBe(800);
  });

  it('accepts custom bytesPerElement', () => {
    expect(linearSpace(100, 4)).toBe(400);
  });
});

describe('logSpace', () => {
  it('returns at least one frame for tiny n', () => {
    expect(logSpace(1)).toBe(64);
  });

  it('grows with log2(n)', () => {
    expect(logSpace(16, 10)).toBe(40);
  });
});

describe('constantSpace', () => {
  it('always returns 1', () => {
    expect(constantSpace(0)).toBe(1);
    expect(constantSpace(1e6)).toBe(1);
  });
});

describe('makeTimeGuess', () => {
  it('divides shape by opsPerMs', () => {
    const g = makeTimeGuess(linear, 100);

    expect(g(50)).toBe(0.5);
  });
});
