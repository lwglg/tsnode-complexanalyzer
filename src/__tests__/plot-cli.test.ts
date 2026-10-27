import fs from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';

import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

const plotAnalysisResultMock = vi.fn();

vi.mock('../core/plot.js', () => ({
  plotAnalysisResult: (...args: unknown[]) => plotAnalysisResultMock(...args),
}));

const sampleJson = {
  algorithmName: 'array-sum',
  timeGuessName: 'O(n)',
  spaceGuessName: 'O(1)',
  measurements: [
    {
      n: 100,
      timeMsMedian: 0.1,
      timeMsMean: 0.1,
      timeMsStd: 0,
      heapDeltaBytesMedian: 0,
      peakHeapBytesMedian: 1000,
      theoreticalTime: 0.1,
      theoreticalSpace: 1,
      timeRatio: 1,
      spaceRatio: 1,
      rawTimes: [0.1],
      rawHeapDeltas: [0],
    },
  ],
  config: {
    problemSizes: [100],
    repetitions: 1,
    warmups: 0,
    forceGc: false,
  },
  generatedAt: '2026-01-01T00:00:00.000Z',
  environment: { nodeVersion: 'v22', platform: 'linux', arch: 'x64' },
};

describe('runPlotCli', () => {
  let tmpDir: string;

  beforeEach(async () => {
    plotAnalysisResultMock.mockClear();
    tmpDir = await fs.mkdtemp(path.join(os.tmpdir(), 'plot-cli-'));
  });

  afterEach(async () => {
    await fs.rm(tmpDir, { recursive: true, force: true });
    vi.restoreAllMocks();
  });

  it('returns 1 and prints usage when no files are given', async () => {
    const { runPlotCli } = await import('../plot-cli.js');
    const err = vi.spyOn(console, 'error').mockImplementation(() => {});
    const code = await runPlotCli([]);

    expect(code).toBe(1);
    expect(err).toHaveBeenCalled();
    expect(plotAnalysisResultMock).not.toHaveBeenCalled();
    err.mockRestore();
  });

  it('plots a valid result file and returns 0', async () => {
    const file = path.join(tmpDir, 'ok.json');

    await fs.writeFile(file, JSON.stringify(sampleJson), 'utf8');
    const { runPlotCli } = await import('../plot-cli.js');
    const log = vi.spyOn(console, 'log').mockImplementation(() => {});
    const code = await runPlotCli([file]);

    expect(code).toBe(0);
    expect(plotAnalysisResultMock).toHaveBeenCalledTimes(1);
    expect(plotAnalysisResultMock.mock.calls[0]![0]).toMatchObject({
      algorithmName: 'array-sum',
    });
    expect(log).toHaveBeenCalledWith(expect.stringContaining('array-sum'));
    log.mockRestore();
  });

  it('skips files with empty measurements', async () => {
    const file = path.join(tmpDir, 'empty.json');

    await fs.writeFile(file, JSON.stringify({ ...sampleJson, measurements: [] }), 'utf8');
    const { runPlotCli } = await import('../plot-cli.js');
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => {});
    const code = await runPlotCli([file]);

    expect(code).toBe(0);
    expect(plotAnalysisResultMock).not.toHaveBeenCalled();
    expect(warn).toHaveBeenCalledWith(expect.stringContaining('no measurements'));
    warn.mockRestore();
  });

  it('returns 1 when the file cannot be read', async () => {
    const { runPlotCli } = await import('../plot-cli.js');
    const err = vi.spyOn(console, 'error').mockImplementation(() => {});
    const code = await runPlotCli([path.join(tmpDir, 'missing.json')]);

    expect(code).toBe(1);
    expect(plotAnalysisResultMock).not.toHaveBeenCalled();
    err.mockRestore();
  });

  it('returns 1 for invalid JSON', async () => {
    const file = path.join(tmpDir, 'bad.json');

    await fs.writeFile(file, '{ not json', 'utf8');
    const { runPlotCli } = await import('../plot-cli.js');
    const err = vi.spyOn(console, 'error').mockImplementation(() => {});
    const code = await runPlotCli([file]);

    expect(code).toBe(1);
    err.mockRestore();
  });

  it('ignores flag-like argv tokens', async () => {
    const file = path.join(tmpDir, 'ok.json');

    await fs.writeFile(file, JSON.stringify(sampleJson), 'utf8');
    const { runPlotCli } = await import('../plot-cli.js');

    vi.spyOn(console, 'log').mockImplementation(() => {});
    const code = await runPlotCli(['--verbose', file]);

    expect(code).toBe(0);
    expect(plotAnalysisResultMock).toHaveBeenCalledTimes(1);
  });
});
