/**
 * Core types for empirical complexity analysis.
 */

/** A generic algorithm that accepts an array of numbers and returns anything. */
export type AlgorithmFn = (input: number[]) => unknown;

/** Guess function g(n) for theoretical complexity (time or space). */
export type GuessFn = (n: number) => number;

export interface MeasurementConfig {
  /** Problem sizes (n) to test. */
  problemSizes: readonly number[];
  /** Number of repetitions per size (after warm-up). */
  repetitions: number;
  /** Warm-up runs discarded per size (helps JIT / GC). */
  warmups: number;
  /** Force GC between runs if --expose-gc is enabled. */
  forceGc: boolean;
  /** Seed for reproducible random inputs. */
  seed?: number;
}

export interface SingleRunResult {
  timeMs: number;
  /** Delta heapUsed in bytes (after - before). Can be negative due to GC. */
  heapDeltaBytes: number;
  /** Peak heapUsed observed during the run (best-effort). */
  peakHeapBytes: number;
}

export interface AggregatedMeasurement {
  n: number;
  /** Median wall-clock time in milliseconds. */
  timeMsMedian: number;
  /** Mean wall-clock time. */
  timeMsMean: number;
  /** Standard deviation of time. */
  timeMsStd: number;
  /** Median heap delta (bytes). */
  heapDeltaBytesMedian: number;
  /** Median peak heap (bytes). */
  peakHeapBytesMedian: number;
  /** Theoretical time from guess (same units as measured after conversion, or raw). */
  theoreticalTime: number;
  /** Theoretical space from guess (bytes scale is user-defined). */
  theoreticalSpace: number;
  /** k_time = theoreticalTime / measuredTimeMedian */
  timeRatio: number;
  /** k_space = theoreticalSpace / measuredHeapMedian */
  spaceRatio: number;
  rawTimes: number[];
  rawHeapDeltas: number[];
}

export interface AnalysisResult {
  algorithmName: string;
  timeGuessName: string;
  spaceGuessName: string;
  config: MeasurementConfig;
  measurements: AggregatedMeasurement[];
  /** Timestamp of the run. */
  generatedAt: string;
  /** Node / platform info for reproducibility. */
  environment: {
    nodeVersion: string;
    platform: string;
    arch: string;
    cpuModel?: string;
  };
}

/** Partial overrides accepted by the runner (arrays may be readonly). */
export type MeasurementConfigOverride = {
  [K in keyof MeasurementConfig]?: MeasurementConfig[K];
};

export interface RunnerOptions {
  algorithm: AlgorithmFn;
  algorithmName: string;
  timeGuess: GuessFn;
  timeGuessName: string;
  spaceGuess: GuessFn;
  spaceGuessName: string;
  config?: MeasurementConfigOverride;
}
