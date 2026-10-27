/**
 * Empirical Time & Space Complexity Analyzer
 *
 * Modernized successor of the 2022 empirical-tc-ts project.
 * Measures wall-clock time and heap usage for increasing problem sizes,
 * then compares against theoretical guess functions via the ratio method.
 *
 * Usage:
 *   npx tsx src/index.ts
 *   node --expose-gc --import tsx src/index.ts
 *   node --expose-gc --import tsx src/index.ts --only=merge-sort,heap-sort
 */

import { bubbleSort } from './algorithms/bubble-sort.js';
import { countingSort } from './algorithms/counting-sort.js';
import { heapSort } from './algorithms/heap-sort.js';
import { insertionSort } from './algorithms/insertion-sort.js';
import { arrayCopy, arraySum, findMax } from './algorithms/linear-scan.js';
import { mergeSort } from './algorithms/merge-sort.js';
import { quickSort } from './algorithms/quick-sort.js';
import { selectionSort } from './algorithms/selection-sort.js';
import {
  constantSpace,
  linear,
  linearSpace,
  logSpace,
  makeTimeGuess,
  nLogN,
  nSquared,
} from './core/guesses.js';
import { exportResults, printSummary } from './core/report.js';
import { runAnalysis } from './core/runner.js';
import type { MeasurementConfigOverride, RunnerOptions } from './types/index.js';

/** Shared config presets so the suite stays consistent. */
const PRESETS: Record<'efficient' | 'quadratic' | 'linear', MeasurementConfigOverride> = {
  /** Good for O(n log n) algorithms. */
  efficient: {
    problemSizes: [1_000, 2_000, 5_000, 10_000, 20_000, 50_000, 100_000],
    repetitions: 7,
    warmups: 2,
    forceGc: true,
    seed: 42,
  },
  /** Smaller sizes for quadratic algorithms. */
  quadratic: {
    problemSizes: [500, 1_000, 2_000, 3_000, 5_000, 8_000],
    repetitions: 5,
    warmups: 1,
    forceGc: true,
    seed: 42,
  },
  /** Larger sizes OK for pure linear scans. */
  linear: {
    problemSizes: [10_000, 50_000, 100_000, 200_000, 500_000, 1_000_000],
    repetitions: 9,
    warmups: 2,
    forceGc: true,
    seed: 42,
  },
};

type SuiteEntry = RunnerOptions & { enabled?: boolean };

const suite: SuiteEntry[] = [
  // ── Efficient comparison sorts (O(n log n)) ──────────────────────────
  {
    algorithm: mergeSort,
    algorithmName: 'merge-sort',
    timeGuess: makeTimeGuess(nLogN, 4e5),
    timeGuessName: 'O(n log n)',
    spaceGuess: linearSpace,
    spaceGuessName: 'O(n) extra',
    config: PRESETS.efficient,
  },
  {
    algorithm: quickSort,
    algorithmName: 'quick-sort',
    timeGuess: makeTimeGuess(nLogN, 6e5),
    timeGuessName: 'O(n log n) avg',
    spaceGuess: logSpace,
    spaceGuessName: 'O(log n) stack',
    config: PRESETS.efficient,
  },
  {
    algorithm: heapSort,
    algorithmName: 'heap-sort',
    timeGuess: makeTimeGuess(nLogN, 3e5),
    timeGuessName: 'O(n log n)',
    spaceGuess: constantSpace,
    spaceGuessName: 'O(1) extra',
    config: PRESETS.efficient,
  },

  // ── Quadratic sorts ──────────────────────────────────────────────────
  {
    algorithm: bubbleSort,
    algorithmName: 'bubble-sort',
    timeGuess: makeTimeGuess(nSquared, 2e7),
    timeGuessName: 'O(n²)',
    spaceGuess: constantSpace,
    spaceGuessName: 'O(1) extra',
    config: PRESETS.quadratic,
  },
  {
    algorithm: insertionSort,
    algorithmName: 'insertion-sort',
    timeGuess: makeTimeGuess(nSquared, 3e7),
    timeGuessName: 'O(n²)',
    spaceGuess: constantSpace,
    spaceGuessName: 'O(1) extra',
    config: PRESETS.quadratic,
  },
  {
    algorithm: selectionSort,
    algorithmName: 'selection-sort',
    timeGuess: makeTimeGuess(nSquared, 3e7),
    timeGuessName: 'O(n²)',
    spaceGuess: constantSpace,
    spaceGuessName: 'O(1) extra',
    config: PRESETS.quadratic,
  },

  // ── Linear / special ─────────────────────────────────────────────────
  {
    algorithm: countingSort,
    algorithmName: 'counting-sort',
    timeGuess: makeTimeGuess(linear, 2e6),
    timeGuessName: 'O(n + k) ≈ O(n)',
    spaceGuess: linearSpace,
    spaceGuessName: 'O(n + k)',
    config: {
      problemSizes: [1_000, 2_000, 5_000, 10_000, 20_000, 50_000],
      repetitions: 7,
      warmups: 2,
      forceGc: true,
      seed: 42,
    },
  },
  {
    algorithm: arraySum,
    algorithmName: 'array-sum',
    timeGuess: makeTimeGuess(linear, 5e7),
    timeGuessName: 'O(n)',
    spaceGuess: constantSpace,
    spaceGuessName: 'O(1)',
    config: PRESETS.linear,
  },
  {
    algorithm: findMax,
    algorithmName: 'find-max',
    timeGuess: makeTimeGuess(linear, 5e7),
    timeGuessName: 'O(n)',
    spaceGuess: constantSpace,
    spaceGuessName: 'O(1)',
    config: PRESETS.linear,
  },
  {
    algorithm: arrayCopy,
    algorithmName: 'array-copy',
    timeGuess: makeTimeGuess(linear, 2e7),
    timeGuessName: 'O(n)',
    spaceGuess: linearSpace,
    spaceGuessName: 'O(n)',
    config: PRESETS.linear,
  },
];

async function main() {
  console.log('tsnode-complexanalyzer – full algorithm suite\n');

  // Optional filter: --only=merge-sort,quick-sort
  const onlyArg = process.argv.find((a) => a.startsWith('--only='));
  const only = onlyArg
    ? new Set(
        onlyArg
          .slice(7)
          .split(',')
          .map((s) => s.trim().toLowerCase()),
      )
    : null;

  const toRun = suite.filter((entry) => {
    if (entry.enabled === false) return false;

    if (!only) return true;

    return only.has(entry.algorithmName.toLowerCase());
  });

  if (toRun.length === 0) {
    console.error('No algorithms selected. Available:');
    suite.forEach((e) => console.error(`  - ${e.algorithmName}`));
    process.exit(1);
  }

  console.log(`Running ${toRun.length} algorithm(s):\n`);

  for (const entry of toRun) {
    const result = await runAnalysis(entry);

    printSummary(result);
    await exportResults(result);
    console.log();
  }

  console.log('✅ Suite finished. Inspect ./results for CSV/JSON data.');
  console.log(
    'Tip: node --expose-gc --import tsx src/index.ts\n' +
      '     node --expose-gc --import tsx src/index.ts --only=merge-sort,heap-sort',
  );
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
