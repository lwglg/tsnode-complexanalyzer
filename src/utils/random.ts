/**
 * Seeded PRNG (Mulberry32) for reproducible inputs.
 */

export function createSeededRandom(seed = Date.now()): () => number {
  let s = seed >>> 0;

  return () => {
    s = (s + 0x6d2b79f5) >>> 0;
    let t = Math.imul(s ^ (s >>> 15), 1 | s);

    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;

    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/**
 * Generate an array of `n` random integers in [1, max].
 */
export function randomArray(n: number, max = n, random: () => number = Math.random): number[] {
  const arr = new Array<number>(n);

  for (let i = 0; i < n; i++) {
    arr[i] = Math.floor(random() * max) + 1;
  }

  return arr;
}
