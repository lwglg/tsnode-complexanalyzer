import { describe, expect, it } from 'vitest';

import { linear, linearSpace, makeTimeGuess } from '../guesses.js';
import { runAnalysis } from '../runner.js';

const cheapAlgo = (arr: number[]) => {
  let s = 0;

  for (const x of arr) s += x;

  return s;
};

describe('runAnalysis', () => {
  it('produces measurements for each problem size', async () => {
    const result = await runAnalysis({
      algorithm: cheapAlgo,
      algorithmName: 'cheap-sum',
      timeGuess: makeTimeGuess(linear, 1e8),
      timeGuessName: 'O(n)',
      spaceGuess: linearSpace,
      spaceGuessName: 'O(n)',
      config: {
        problemSizes: [100, 200, 400],
        repetitions: 3,
        warmups: 1,
        forceGc: false,
        seed: 1,
      },
    });

    expect(result.algorithmName).toBe('cheap-sum');
    expect(result.measurements).toHaveLength(3);
    expect(result.environment.nodeVersion).toMatch(/^v/);
    expect(result.generatedAt).toBeTruthy();

    for (const m of result.measurements) {
      expect(m.timeMsMedian).toBeGreaterThanOrEqual(0);
      expect(Number.isFinite(m.timeRatio)).toBe(true);
      expect(Number.isFinite(m.spaceRatio)).toBe(true);
      expect(m.rawTimes).toHaveLength(3);
    }
  });
});
