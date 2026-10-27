/**
 * Simple statistical helpers (no external deps).
 */

export function median(values: number[]): number {
  if (values.length === 0) return NaN;

  const sorted = [...values].sort((a, b) => a - b);
  const mid = Math.floor(sorted.length / 2);

  return sorted.length % 2 === 0 ? (sorted[mid - 1]! + sorted[mid]!) / 2 : sorted[mid]!;
}

export function mean(values: number[]): number {
  if (values.length === 0) return NaN;

  return values.reduce((a, b) => a + b, 0) / values.length;
}

export function stdDev(values: number[]): number {
  if (values.length < 2) return 0;

  const m = mean(values);
  const variance = values.reduce((acc, v) => acc + (v - m) ** 2, 0) / (values.length - 1);

  return Math.sqrt(variance);
}

/** Trimmed mean: drop lowest and highest fraction. */
export function trimmedMean(values: number[], trimFraction = 0.1): number {
  if (values.length === 0) return NaN;

  const sorted = [...values].sort((a, b) => a - b);
  const k = Math.floor(sorted.length * trimFraction);
  const trimmed = sorted.slice(k, sorted.length - k || undefined);

  return mean(trimmed.length > 0 ? trimmed : sorted);
}
