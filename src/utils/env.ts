import os from 'node:os';

export function getEnvironmentInfo() {
  const cpus = os.cpus();

  return {
    nodeVersion: process.version,
    platform: process.platform,
    arch: process.arch,
    cpuModel: cpus[0]?.model,
    cpuCount: cpus.length,
    totalMemBytes: os.totalmem(),
  };
}

/** Best-effort GC. Only works when Node is started with --expose-gc. */
export function tryForceGc(): void {
  const g = globalThis as typeof globalThis & { gc?: () => void };

  if (typeof g.gc === 'function') {
    g.gc();
  }
}
