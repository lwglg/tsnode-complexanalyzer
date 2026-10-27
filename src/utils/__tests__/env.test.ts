import { describe, expect, it, vi } from 'vitest';

import { getEnvironmentInfo, tryForceGc } from '../env.js';

describe('getEnvironmentInfo', () => {
  it('returns node version, platform and arch', () => {
    const info = getEnvironmentInfo();

    expect(info.nodeVersion).toMatch(/^v\d+/);
    expect(info.platform).toBeTruthy();
    expect(info.arch).toBeTruthy();
    expect(typeof info.cpuCount).toBe('number');
    expect(info.cpuCount).toBeGreaterThan(0);
    expect(info.totalMemBytes).toBeGreaterThan(0);
  });
});

describe('tryForceGc', () => {
  it('is a no-op when global.gc is unavailable', () => {
    const g = globalThis as typeof globalThis & { gc?: () => void };
    const original = g.gc;

    delete g.gc;
    expect(() => tryForceGc()).not.toThrow();

    if (original) g.gc = original;
  });

  it('calls global.gc when present', () => {
    const g = globalThis as typeof globalThis & { gc?: () => void };
    const original = g.gc;

    g.gc = vi.fn();
    tryForceGc();
    expect(g.gc).toHaveBeenCalledOnce();

    if (original) g.gc = original;
    else delete g.gc;
  });
});
