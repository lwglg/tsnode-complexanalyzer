import type {
  AggregatedMeasurement,
  AnalysisResult,
  MeasurementConfig,
  RunnerOptions,
} from '../types/index.js';
import { getEnvironmentInfo } from '../utils/env.js';
import { mean, median, stdDev } from '../utils/stats.js';

import { collectSamples } from './measure.js';

const DEFAULT_CONFIG: MeasurementConfig = {
  problemSizes: [1_000, 2_000, 5_000, 10_000, 20_000, 50_000, 100_000, 200_000, 500_000],
  repetitions: 9,
  warmups: 2,
  forceGc: true,
};

/**
 * Run the full empirical analysis for time + space ratios.
 */
export async function runAnalysis(options: RunnerOptions): Promise<AnalysisResult> {
  const override = options.config ?? {};
  const config: MeasurementConfig = {
    problemSizes: override.problemSizes ?? DEFAULT_CONFIG.problemSizes,
    repetitions: override.repetitions ?? DEFAULT_CONFIG.repetitions,
    warmups: override.warmups ?? DEFAULT_CONFIG.warmups,
    forceGc: override.forceGc ?? DEFAULT_CONFIG.forceGc,
    seed: override.seed ?? DEFAULT_CONFIG.seed,
  };

  const { algorithm, algorithmName, timeGuess, timeGuessName, spaceGuess, spaceGuessName } =
    options;

  console.log(`\n▶ Analyzing "${algorithmName}"`);
  console.log(`  Time guess : ${timeGuessName}`);
  console.log(`  Space guess: ${spaceGuessName}`);
  console.log(
    `  Sizes: ${config.problemSizes.join(', ')} | reps=${config.repetitions} | warmups=${config.warmups}`,
  );
  console.log('─'.repeat(60));

  const measurements: AggregatedMeasurement[] = [];

  for (const n of config.problemSizes) {
    process.stdout.write(`  n = ${n.toLocaleString()} … `);

    const samples = collectSamples(
      algorithm,
      n,
      config.repetitions,
      config.warmups,
      config.forceGc,
      config.seed,
    );

    const times = samples.map((s) => s.timeMs);
    const heapDeltas = samples.map((s) => s.heapDeltaBytes);
    const peaks = samples.map((s) => s.peakHeapBytes);

    const timeMsMedian = median(times);
    const heapDeltaMedian = median(heapDeltas);
    const peakHeapMedian = median(peaks);
    const theoreticalTime = timeGuess(n);
    const theoreticalSpace = spaceGuess(n);

    // Guard against division by zero / negative deltas (GC can make delta negative)
    const safeTime = Math.max(timeMsMedian, 1e-9);
    // Prefer a positive observed cost for the ratio; fall back to peak or 1 byte
    const observedSpace = Math.max(heapDeltaMedian, peakHeapMedian * 0.1, 1);

    const agg: AggregatedMeasurement = {
      n,
      timeMsMedian,
      timeMsMean: mean(times),
      timeMsStd: stdDev(times),
      heapDeltaBytesMedian: heapDeltaMedian,
      peakHeapBytesMedian: peakHeapMedian,
      theoreticalTime,
      theoreticalSpace,
      timeRatio: theoreticalTime / safeTime,
      spaceRatio: theoreticalSpace / observedSpace,
      rawTimes: times,
      rawHeapDeltas: heapDeltas,
    };

    measurements.push(agg);

    console.log(
      `time=${timeMsMedian.toFixed(2)} ms  ` +
        `heapΔ=${(heapDeltaMedian / 1024).toFixed(1)} KiB  ` +
        `kₜ=${agg.timeRatio.toFixed(3)}  kₛ=${agg.spaceRatio.toFixed(3)}`,
    );
  }

  const env = getEnvironmentInfo();

  return {
    algorithmName,
    timeGuessName,
    spaceGuessName,
    config,
    measurements,
    generatedAt: new Date().toISOString(),
    environment: {
      nodeVersion: env.nodeVersion,
      platform: env.platform,
      arch: env.arch,
      cpuModel: env.cpuModel,
    },
  };
}
