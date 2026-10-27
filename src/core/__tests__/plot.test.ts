import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import type { AnalysisResult } from '../../types/index.js';

const plotMock = vi.fn();

vi.mock('nodeplotlib', () => ({
  plot: (...args: unknown[]) => plotMock(...args),
}));

const sampleResult = (): AnalysisResult => ({
  algorithmName: 'merge-sort',
  timeGuessName: 'O(n log n)',
  spaceGuessName: 'O(n)',
  config: {
    problemSizes: [1000, 2000],
    repetitions: 3,
    warmups: 1,
    forceGc: false,
  },
  measurements: [
    {
      n: 1000,
      timeMsMedian: 1.5,
      timeMsMean: 1.6,
      timeMsStd: 0.1,
      heapDeltaBytesMedian: 8192,
      peakHeapBytesMedian: 16384,
      theoreticalTime: 1.2,
      theoreticalSpace: 8000,
      timeRatio: 0.8,
      spaceRatio: 0.98,
      rawTimes: [1.5, 1.7],
      rawHeapDeltas: [8000, 8384],
    },
    {
      n: 2000,
      timeMsMedian: 3.2,
      timeMsMean: 3.3,
      timeMsStd: 0.2,
      heapDeltaBytesMedian: 16384,
      peakHeapBytesMedian: 32768,
      theoreticalTime: 2.6,
      theoreticalSpace: 16000,
      timeRatio: 0.81,
      spaceRatio: 0.98,
      rawTimes: [3.1, 3.3],
      rawHeapDeltas: [16000, 16768],
    },
  ],
  generatedAt: '2026-01-01T00:00:00.000Z',
  environment: {
    nodeVersion: 'v22.0.0',
    platform: 'linux',
    arch: 'x64',
  },
});

describe('plotAnalysisResult', () => {
  beforeEach(() => {
    plotMock.mockClear();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('opens three charts by default (time, space, ratios)', async () => {
    const { plotAnalysisResult } = await import('../plot.js');

    plotAnalysisResult(sampleResult());
    expect(plotMock).toHaveBeenCalledTimes(3);
  });

  it('skips charts when options disable them', async () => {
    const { plotAnalysisResult } = await import('../plot.js');

    plotAnalysisResult(sampleResult(), { time: false, space: false, ratios: true });
    expect(plotMock).toHaveBeenCalledTimes(1);
    const [traces, layout] = plotMock.mock.calls[0] as [unknown[], { title?: string }];

    expect(layout.title).toContain('ratio');
    expect(Array.isArray(traces)).toBe(true);
    expect(traces).toHaveLength(2);
  });

  it('uses log x-axis by default and linear when logN is false', async () => {
    const { plotAnalysisResult } = await import('../plot.js');

    plotAnalysisResult(sampleResult(), { time: true, space: false, ratios: false, logN: true });
    let layout = plotMock.mock.calls[0]![1] as { xaxis: { type: string; title: string } };

    expect(layout.xaxis.type).toBe('log');
    expect(layout.xaxis.title).toMatch(/log/i);

    plotMock.mockClear();
    plotAnalysisResult(sampleResult(), { time: true, space: false, ratios: false, logN: false });
    layout = plotMock.mock.calls[0]![1] as { xaxis: { type: string; title: string } };
    expect(layout.xaxis.type).toBe('linear');
  });

  it('passes measured and theoretical series for time chart', async () => {
    const { plotAnalysisResult } = await import('../plot.js');
    const result = sampleResult();

    plotAnalysisResult(result, { time: true, space: false, ratios: false });

    const [traces, layout] = plotMock.mock.calls[0] as [
      Array<{ x: number[]; y: number[]; name: string; type: string }>,
      { title: string; yaxis: { title: string } },
    ];

    expect(layout.title).toContain('merge-sort');
    expect(layout.yaxis.title).toContain('ms');
    expect(traces[0]!.x).toEqual([1000, 2000]);
    expect(traces[0]!.y).toEqual([1.5, 3.2]);
    expect(traces[1]!.y).toEqual([1.2, 2.6]);
    expect(traces[0]!.type).toBe('scatter');
  });

  it('converts heap bytes to KiB on the space chart', async () => {
    const { plotAnalysisResult } = await import('../plot.js');

    plotAnalysisResult(sampleResult(), { time: false, space: true, ratios: false });

    const [traces] = plotMock.mock.calls[0] as [Array<{ y: number[]; name: string }>];

    expect(traces[0]!.y[0]).toBeCloseTo(8192 / 1024, 5);
    expect(traces[1]!.y[0]).toBeCloseTo(8000 / 1024, 5);
  });

  it('warns and does not plot when measurements are empty', async () => {
    const { plotAnalysisResult } = await import('../plot.js');
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => {});
    const empty = sampleResult();

    empty.measurements = [];
    plotAnalysisResult(empty);
    expect(plotMock).not.toHaveBeenCalled();
    expect(warn).toHaveBeenCalledWith(expect.stringContaining('No measurements'));
    warn.mockRestore();
  });
});
