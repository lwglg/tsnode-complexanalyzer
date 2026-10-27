import fs from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';

import { afterEach, describe, expect, it, vi } from 'vitest';

import type { AnalysisResult } from '../../types/index.js';
import { exportResults, printSummary } from '../report.js';

const sampleResult: AnalysisResult = {
  algorithmName: 'test-algo',
  timeGuessName: 'O(n)',
  spaceGuessName: 'O(1)',
  config: {
    problemSizes: [10, 20],
    repetitions: 2,
    warmups: 0,
    forceGc: false,
  },
  measurements: [
    {
      n: 10,
      timeMsMedian: 1.5,
      timeMsMean: 1.6,
      timeMsStd: 0.1,
      heapDeltaBytesMedian: 1024,
      peakHeapBytesMedian: 2048,
      theoreticalTime: 1,
      theoreticalSpace: 1,
      timeRatio: 0.67,
      spaceRatio: 0.001,
      rawTimes: [1.5, 1.7],
      rawHeapDeltas: [1000, 1048],
    },
  ],
  generatedAt: '2026-01-01T00:00:00.000Z',
  environment: {
    nodeVersion: 'v22.0.0',
    platform: 'linux',
    arch: 'x64',
    cpuModel: 'test-cpu',
  },
};

describe('printSummary', () => {
  it('writes a summary to the console', () => {
    const spy = vi.spyOn(console, 'log').mockImplementation(() => {});

    printSummary(sampleResult);
    expect(spy).toHaveBeenCalled();
    const joined = spy.mock.calls.map((c) => String(c[0])).join('\n');

    expect(joined).toContain('test-algo');
    expect(joined).toContain('O(n)');
    spy.mockRestore();
  });
});

describe('exportResults', () => {
  const tmpDirs: string[] = [];

  afterEach(async () => {
    for (const dir of tmpDirs) {
      await fs.rm(dir, { recursive: true, force: true });
    }

    tmpDirs.length = 0;
  });

  it('writes JSON and CSV files', async () => {
    const dir = await fs.mkdtemp(path.join(os.tmpdir(), 'ect-'));

    tmpDirs.push(dir);

    const { jsonPath, csvPath } = await exportResults(sampleResult, dir);

    expect(jsonPath.endsWith('.json')).toBe(true);
    expect(csvPath.endsWith('.csv')).toBe(true);

    const json = JSON.parse(await fs.readFile(jsonPath, 'utf8')) as AnalysisResult;

    expect(json.algorithmName).toBe('test-algo');

    const csv = await fs.readFile(csvPath, 'utf8');

    expect(csv.split('\n')[0]).toContain('timeMsMedian');
    expect(csv).toContain('10,');
  });
});
