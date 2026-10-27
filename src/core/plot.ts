/**
 * 2D plotting of AnalysisResult via nodeplotlib (Plotly in the browser).
 */
import type { Layout, Plot } from 'nodeplotlib';
import { plot } from 'nodeplotlib';

import type { AnalysisResult } from '../types/index.js';

export interface PlotOptions {
  /** Open time (measured vs theoretical) chart. Default true. */
  time?: boolean;
  /** Open space (measured vs theoretical) chart. Default true. */
  space?: boolean;
  /** Open k_time / k_space convergence chart. Default true. */
  ratios?: boolean;
  /** Use log scale on the n axis. Default true. */
  logN?: boolean;
}

const defaultOptions: Required<PlotOptions> = {
  time: true,
  space: true,
  ratios: true,
  logN: true,
};

function baseLayout(title: string, yTitle: string, logN: boolean): Layout {
  return {
    title,
    xaxis: {
      title: logN ? 'n (log scale)' : 'n',
      type: logN ? 'log' : 'linear',
    },
    yaxis: { title: yTitle },
    legend: { orientation: 'h' },
    margin: { t: 48, r: 24, b: 48, l: 64 },
  };
}

/**
 * Open interactive Plotly windows for the given analysis result.
 * Relies on nodeplotlib's local server + browser.
 */
export function plotAnalysisResult(result: AnalysisResult, options: PlotOptions = {}): void {
  const opts = { ...defaultOptions, ...options };
  const ms = result.measurements;

  if (!ms.length) {
    console.warn('[plot] No measurements to plot.');

    return;
  }

  const n = ms.map((m) => m.n);
  const algo = result.algorithmName;

  if (opts.time) {
    const traces: Plot[] = [
      {
        x: n,
        y: ms.map((m) => m.timeMsMedian),
        type: 'scatter',
        mode: 'lines+markers',
        name: 'Measured time (median ms)',
      },
      {
        x: n,
        y: ms.map((m) => m.theoreticalTime),
        type: 'scatter',
        mode: 'lines+markers',
        name: `Theoretical (${result.timeGuessName})`,
      },
    ];

    plot(traces, baseLayout(`${algo} — time`, 'time (ms)', opts.logN));
  }

  if (opts.space) {
    const heapKiB = ms.map(
      (m) => Math.max(m.heapDeltaBytesMedian, m.peakHeapBytesMedian * 0.1, 0) / 1024,
    );
    const theoKiB = ms.map((m) => Math.max(m.theoreticalSpace, 0) / 1024);
    const traces: Plot[] = [
      {
        x: n,
        y: heapKiB,
        type: 'scatter',
        mode: 'lines+markers',
        name: 'Measured heap (KiB)',
      },
      {
        x: n,
        y: theoKiB,
        type: 'scatter',
        mode: 'lines+markers',
        name: `Theoretical (${result.spaceGuessName})`,
      },
    ];

    plot(traces, baseLayout(`${algo} — space`, 'memory (KiB)', opts.logN));
  }

  if (opts.ratios) {
    const traces: Plot[] = [
      {
        x: n,
        y: ms.map((m) => m.timeRatio),
        type: 'scatter',
        mode: 'lines+markers',
        name: 'k_time = theory / measured',
      },
      {
        x: n,
        y: ms.map((m) => m.spaceRatio),
        type: 'scatter',
        mode: 'lines+markers',
        name: 'k_space = theory / measured',
      },
    ];

    plot(traces, baseLayout(`${algo} — ratio convergence k(n)`, 'k(n)', opts.logN));
  }
}
