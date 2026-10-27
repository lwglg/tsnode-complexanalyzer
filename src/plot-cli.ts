/**
 * CLI: plot one or more AnalysisResult JSON files with nodeplotlib.
 *
 *   pnpm plot -- results/foo.json
 *   pnpm plot -- results/*.json
 */
import fs from 'node:fs/promises';
import path from 'node:path';

import { plotAnalysisResult } from './core/plot.js';
import type { AnalysisResult } from './types/index.js';

/**
 * Parse CLI args and plot each JSON file. Exported for unit tests.
 * @returns process exit code to apply (0 ok, 1 usage/error)
 */
export async function runPlotCli(argv: string[]): Promise<number> {
  const args = argv.filter((a) => !a.startsWith('-'));

  if (!args.length) {
    console.error('Usage: pnpm plot -- <result.json> [more.json ...]');
    console.error('Example: pnpm plot -- results/merge-sort_*.json');

    return 1;
  }

  for (const file of args) {
    const abs = path.resolve(file);
    let raw: string;

    try {
      raw = await fs.readFile(abs, 'utf8');
    } catch (err) {
      console.error(`Failed to read ${file}:`, err instanceof Error ? err.message : err);

      return 1;
    }

    let data: AnalysisResult;

    try {
      data = JSON.parse(raw) as AnalysisResult;
    } catch (err) {
      console.error(`Invalid JSON in ${file}:`, err instanceof Error ? err.message : err);

      return 1;
    }

    if (!data.measurements?.length) {
      console.warn(`Skip ${file}: no measurements`);
      continue;
    }

    console.log(`Plotting ${data.algorithmName} from ${file}`);
    plotAnalysisResult(data);
  }

  return 0;
}

const isDirectRun =
  process.argv[1]?.includes('plot-cli') ||
  process.argv[1]?.endsWith('plot-cli.ts') ||
  process.argv[1]?.endsWith('plot-cli.js');

if (isDirectRun) {
  runPlotCli(process.argv.slice(2))
    .then((code) => {
      process.exitCode = code;
    })
    .catch((err) => {
      console.error(err);
      process.exitCode = 1;
    });
}
