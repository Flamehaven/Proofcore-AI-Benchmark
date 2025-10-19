/**
 * ProofCore Performance Tracking System
 *
 * Three-tier performance monitoring for:
 * 1. Cold Boot: First load with Pyodide initialization
 * 2. Warm Verify: Typical proof verification (p95)
 * 3. Batch Processing: Multiple proofs (p95)
 */

export interface PerformanceGate {
  target: number;      // milliseconds
  metric: string;      // human-readable metric
  threshold: number;   // percentile (0-100)
}

export const PERFORMANCE_GATES = {
  COLD_BOOT: {
    target: 3500,
    metric: 'Time To Interactive (TTI)',
    threshold: 100,  // max value
  } as PerformanceGate,

  WARM_VERIFY: {
    target: 300,
    metric: 'Proof Verification Latency (p95)',
    threshold: 95,   // 95th percentile
  } as PerformanceGate,

  BATCH_P95: {
    target: 500,
    metric: 'Batch Processing (30 proofs, p95)',
    threshold: 95,   // 95th percentile
  } as PerformanceGate,
} as const;

export interface PerformanceMetrics {
  coldBoot: number | null;        // ms (only once per session)
  warmVerify: number[];           // ms array for p95 calculation
  batchP95: number | null;        // ms (batch processing)
  timestamp: number;              // when measured
}

export interface PerformanceReport {
  cold_boot_ms: number | null;
  warm_verify_p95_ms: number | null;
  warm_verify_samples: number;
  batch_p95_ms: number | null;
  gates: {
    cold_boot_pass: boolean;
    warm_verify_pass: boolean;
    batch_pass: boolean;
  };
  overall_pass: boolean;
}

/**
 * PerformanceTracker: Centralized performance monitoring
 */
export class PerformanceTracker {
  private metrics: PerformanceMetrics;
  private coldBootStart: number | null = null;

  constructor() {
    this.metrics = {
      coldBoot: null,
      warmVerify: [],
      batchP95: null,
      timestamp: Date.now(),
    };
  }

  /**
   * Mark the start of cold boot phase
   */
  startColdBoot(): void {
    this.coldBootStart = performance.now();
    console.log('[PERF] Cold Boot: started');
  }

  /**
   * Track cold boot completion (first interactive state)
   */
  trackColdBoot(endTime?: number): void {
    if (!this.coldBootStart) {
      console.warn('[PERF] Cold Boot: startColdBoot not called');
      return;
    }

    const duration = (endTime || performance.now()) - this.coldBootStart;
    this.metrics.coldBoot = duration;
    this.coldBootStart = null;

    const pass = duration <= PERFORMANCE_GATES.COLD_BOOT.target;
    console.log(
      `[PERF] Cold Boot: ${duration.toFixed(0)}ms (${pass ? 'PASS' : 'FAIL'})`
    );
  }

  /**
   * Track individual proof verification latency
   */
  trackWarmVerify(duration: number): void {
    this.metrics.warmVerify.push(duration);

    // Log every 10th verification for debugging
    if (this.metrics.warmVerify.length % 10 === 0) {
      const p95 = this.calculatePercentile(
        this.metrics.warmVerify,
        PERFORMANCE_GATES.WARM_VERIFY.threshold
      );
      console.log(
        `[PERF] Warm Verify p95: ${p95.toFixed(0)}ms (${this.metrics.warmVerify.length} samples)`
      );
    }
  }

  /**
   * Track batch processing completion
   */
  trackBatch(startTime: number, proofCount: number): void {
    const duration = performance.now() - startTime;
    this.metrics.batchP95 = duration;

    const avgPerProof = duration / proofCount;
    console.log(
      `[PERF] Batch: ${proofCount} proofs in ${duration.toFixed(0)}ms (${avgPerProof.toFixed(0)}ms/proof)`
    );
  }

  /**
   * Calculate percentile from array of values
   * @param values Array of numeric values
   * @param percentile 0-100
   * @returns Value at percentile
   */
  private calculatePercentile(values: number[], percentile: number): number {
    if (values.length === 0) return 0;

    const sorted = [...values].sort((a, b) => a - b);
    const index = Math.ceil((percentile / 100) * sorted.length) - 1;
    return sorted[Math.max(0, index)];
  }

  /**
   * Get p95 of warm verification times
   */
  getWarmVerifyP95(): number | null {
    if (this.metrics.warmVerify.length === 0) return null;
    return this.calculatePercentile(
      this.metrics.warmVerify,
      PERFORMANCE_GATES.WARM_VERIFY.threshold
    );
  }

  /**
   * Get min/max/avg of warm verification times
   */
  getWarmVerifyStats(): {
    min: number;
    max: number;
    avg: number;
    p95: number;
    samples: number;
  } | null {
    if (this.metrics.warmVerify.length === 0) return null;

    const values = this.metrics.warmVerify;
    const sum = values.reduce((a, b) => a + b, 0);

    return {
      min: Math.min(...values),
      max: Math.max(...values),
      avg: sum / values.length,
      p95: this.getWarmVerifyP95() || 0,
      samples: values.length,
    };
  }

  /**
   * Generate performance report
   */
  getReport(): PerformanceReport {
    const warmVerifyP95 = this.getWarmVerifyP95();

    const coldBootPass =
      this.metrics.coldBoot !== null &&
      this.metrics.coldBoot <= PERFORMANCE_GATES.COLD_BOOT.target;

    const warmVerifyPass =
      warmVerifyP95 !== null &&
      warmVerifyP95 <= PERFORMANCE_GATES.WARM_VERIFY.target;

    const batchPass =
      this.metrics.batchP95 !== null &&
      this.metrics.batchP95 <= PERFORMANCE_GATES.BATCH_P95.target;

    const overallPass = coldBootPass && warmVerifyPass && batchPass;

    return {
      cold_boot_ms: this.metrics.coldBoot,
      warm_verify_p95_ms: warmVerifyP95,
      warm_verify_samples: this.metrics.warmVerify.length,
      batch_p95_ms: this.metrics.batchP95,
      gates: {
        cold_boot_pass: coldBootPass,
        warm_verify_pass: warmVerifyPass,
        batch_pass: batchPass,
      },
      overall_pass: overallPass,
    };
  }

  /**
   * Display performance report in console
   */
  logReport(): void {
    const report = this.getReport();

    console.table({
      'Metric': ['Cold Boot', 'Warm Verify (p95)', 'Batch (p95)'],
      'Target (ms)': [
        PERFORMANCE_GATES.COLD_BOOT.target,
        PERFORMANCE_GATES.WARM_VERIFY.target,
        PERFORMANCE_GATES.BATCH_P95.target,
      ],
      'Actual (ms)': [
        report.cold_boot_ms?.toFixed(0) || '-',
        report.warm_verify_p95_ms?.toFixed(0) || '-',
        report.batch_p95_ms?.toFixed(0) || '-',
      ],
      'Status': [
        report.gates.cold_boot_pass ? '✅ PASS' : '❌ FAIL',
        report.gates.warm_verify_pass ? '✅ PASS' : '❌ FAIL',
        report.gates.batch_pass ? '✅ PASS' : '❌ FAIL',
      ],
    });

    console.log(`\nOverall Status: ${report.overall_pass ? '✅ PASS' : '❌ FAIL'}`);
  }

  /**
   * Export metrics as JSON for CI/reports
   */
  toJSON(): PerformanceReport {
    return this.getReport();
  }

  /**
   * Reset all metrics (useful for testing multiple phases)
   */
  reset(): void {
    this.metrics = {
      coldBoot: null,
      warmVerify: [],
      batchP95: null,
      timestamp: Date.now(),
    };
    this.coldBootStart = null;
  }
}

// Global singleton instance
export const globalPerformanceTracker = new PerformanceTracker();

/**
 * Helper: Get global performance tracker
 */
export function getPerformanceTracker(): PerformanceTracker {
  return globalPerformanceTracker;
}

/**
 * Helper: Create isolated tracker for testing
 */
export function createPerformanceTracker(): PerformanceTracker {
  return new PerformanceTracker();
}
