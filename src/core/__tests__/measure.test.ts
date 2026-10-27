import { describe, expect, it } from 'vitest';

import { collectSamples, measureOnce } from '../measure.js';

const identity = (arr: number[]) => arr;

describe('measureOnce', () => {
  it('returns non-negative timeMs', () => {
    const result = measureOnce(identity, 100, () => 0.5, false);

    expect(result.timeMs).toBeGreaterThanOrEqual(0);
    expect(typeof result.heapDeltaBytes).toBe('number');
    expect(result.peakHeapBytes).toBeGreaterThan(0);
  });
});

describe('collectSamples', () => {
  it('returns the requested number of samples', () => {
    const samples = collectSamples(identity, 50, 5, 1, false, 42);

    expect(samples).toHaveLength(5);

    for (const s of samples) {
      expect(s.timeMs).toBeGreaterThanOrEqual(0);
    }
  });

  it('is reproducible with a fixed seed (same length)', () => {
    const a = collectSamples(identity, 30, 3, 0, false, 99);
    const b = collectSamples(identity, 30, 3, 0, false, 99);

    expect(a).toHaveLength(b.length);
  });
});
