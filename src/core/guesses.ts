/**
 * Library of common theoretical complexity functions g(n).
 * Units are arbitrary – the ratio method only cares about the shape.
 *
 * For time we often scale by a constant so that the ratio lands near 1
 * on the current machine (the exact value is not critical).
 */

/** O(n log n) – typical for efficient comparison sorts. */
export function nLogN(n: number, c = 1): number {
  if (n <= 1) return 0;

  return c * n * Math.log2(n);
}

/** O(n²) */
export function nSquared(n: number, c = 1): number {
  return c * n * n;
}

/** O(n) */
export function linear(n: number, c = 1): number {
  return c * n;
}

/** O(log n) */
export function logN(n: number, c = 1): number {
  if (n <= 1) return 0;

  return c * Math.log2(n);
}

/** O(n log n) space is rare; most sorts are O(n) extra. */
export function linearSpace(n: number, bytesPerElement = 8): number {
  // Rough model: each number is ~8 bytes + some overhead.
  // The constant is arbitrary; the ratio shape is what matters.
  return bytesPerElement * n;
}

/** O(log n) extra space (typical QuickSort stack depth on average). */
export function logSpace(n: number, bytesPerFrame = 64): number {
  if (n <= 1) return bytesPerFrame;

  return bytesPerFrame * Math.log2(n);
}

/** O(1) extra space */
export function constantSpace(_n: number): number {
  return 1;
}

/**
 * Helper that turns a pure complexity shape into a time-guess
 * with a rough conversion factor so ratios are order-1.
 * The factor is machine-dependent; users can tune it.
 */
export function makeTimeGuess(
  shape: (n: number) => number,
  opsPerMs = 5e5, // rough default; calibrate on your machine if desired
): (n: number) => number {
  return (n) => shape(n) / opsPerMs;
}
