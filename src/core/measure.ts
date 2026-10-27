import { performance } from 'node:perf_hooks';

import type { AlgorithmFn, SingleRunResult } from '../types/index.js';
import { tryForceGc } from '../utils/env.js';
import { createSeededRandom, randomArray } from '../utils/random.js';

/**
 * Perform a single timed + memory measurement of the algorithm.
 * Memory is measured via process.memoryUsage().heapUsed deltas.
 * Peak is a simple high-water mark of heapUsed sampled after the run
 * (more accurate peak tracking would require sampling or a custom allocator).
 */
export function measureOnce(
  algorithm: AlgorithmFn,
  n: number,
  random: () => number,
  forceGc: boolean,
): SingleRunResult {
  if (forceGc) tryForceGc();

  const before = process.memoryUsage();
  const input = randomArray(n, n, random);

  const t0 = performance.now();

  algorithm(input);
  const t1 = performance.now();

  const after = process.memoryUsage();

  return {
    timeMs: t1 - t0,
    heapDeltaBytes: after.heapUsed - before.heapUsed,
    peakHeapBytes: Math.max(before.heapUsed, after.heapUsed),
  };
}

/**
 * Run warm-ups then collect `repetitions` measurements.
 */
export function collectSamples(
  algorithm: AlgorithmFn,
  n: number,
  repetitions: number,
  warmups: number,
  forceGc: boolean,
  seed?: number,
): SingleRunResult[] {
  const random = createSeededRandom(seed ?? Date.now() + n);

  // Warm-up (discarded) – helps V8 JIT and reduces first-run noise
  for (let i = 0; i < warmups; i++) {
    measureOnce(algorithm, Math.min(n, 10_000), random, forceGc);
  }

  const samples: SingleRunResult[] = [];

  for (let i = 0; i < repetitions; i++) {
    samples.push(measureOnce(algorithm, n, random, forceGc));
  }

  return samples;
}
