import fs from 'node:fs/promises';
import path from 'node:path';

import type { AggregatedMeasurement, AnalysisResult } from '../types/index.js';

/**
 * Pretty-print a summary table to the console.
 */
export function printSummary(result: AnalysisResult): void {
  console.log('\n' + '═'.repeat(78));
  console.log(`Results for ${result.algorithmName}`);
  console.log(`Time model : ${result.timeGuessName}`);
  console.log(`Space model: ${result.spaceGuessName}`);
  console.log(`Generated  : ${result.generatedAt}`);
  console.log(
    `Env        : Node ${result.environment.nodeVersion} / ${result.environment.platform} ${result.environment.arch}`,
  );

  if (result.environment.cpuModel) {
    console.log(`CPU        : ${result.environment.cpuModel}`);
  }

  console.log('─'.repeat(78));
  console.log(
    'n'.padStart(10) +
      '  time(ms)'.padStart(12) +
      '  heapΔ(KiB)'.padStart(12) +
      '  k_time'.padStart(10) +
      '  k_space'.padStart(10),
  );
  console.log('─'.repeat(78));

  for (const m of result.measurements) {
    console.log(
      String(m.n).padStart(10) +
        m.timeMsMedian.toFixed(2).padStart(12) +
        (m.heapDeltaBytesMedian / 1024).toFixed(1).padStart(12) +
        m.timeRatio.toFixed(4).padStart(10) +
        m.spaceRatio.toFixed(4).padStart(10),
    );
  }

  console.log('═'.repeat(78));
  console.log(
    'Interpretation of k (ratio = theoretical / measured):\n' +
      '  → converges to a positive constant  ⇒ guess order is plausible\n' +
      '  → tends toward 0                   ⇒ guess is too low (under-estimate)\n' +
      '  → diverges to ∞                    ⇒ guess is too high (over-estimate)',
  );
}

/**
 * Write full JSON result + a simple CSV for easy plotting elsewhere.
 */
export async function exportResults(
  result: AnalysisResult,
  outDir = 'results',
): Promise<{ jsonPath: string; csvPath: string }> {
  await fs.mkdir(outDir, { recursive: true });

  const stamp = new Date().toISOString().replace(/[:.]/g, '-');
  const base = `${result.algorithmName.replace(/\s+/g, '_')}_${stamp}`;

  const jsonPath = path.join(outDir, `${base}.json`);
  const csvPath = path.join(outDir, `${base}.csv`);

  await fs.writeFile(jsonPath, JSON.stringify(result, null, 2), 'utf8');

  const header =
    'n,timeMsMedian,timeMsMean,timeMsStd,heapDeltaBytesMedian,peakHeapBytesMedian,theoreticalTime,theoreticalSpace,timeRatio,spaceRatio';
  const rows = result.measurements.map((m: AggregatedMeasurement) =>
    [
      m.n,
      m.timeMsMedian,
      m.timeMsMean,
      m.timeMsStd,
      m.heapDeltaBytesMedian,
      m.peakHeapBytesMedian,
      m.theoreticalTime,
      m.theoreticalSpace,
      m.timeRatio,
      m.spaceRatio,
    ].join(','),
  );

  await fs.writeFile(csvPath, [header, ...rows].join('\n'), 'utf8');

  console.log(`\n📁 Exported:\n  ${jsonPath}\n  ${csvPath}`);

  if (process.env.PLOT === '1' || process.env.PLOT === 'true') {
    const { plotAnalysisResult } = await import('./plot.js');

    plotAnalysisResult(result);
  }

  return { jsonPath, csvPath };
}
