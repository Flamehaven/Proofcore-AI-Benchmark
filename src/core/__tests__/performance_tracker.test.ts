/**
 * PerformanceTracker Tests
 */

import { describe, it, expect, beforeEach } from 'vitest';
import {
  PerformanceTracker,
  createPerformanceTracker,
  PERFORMANCE_GATES,
} from '../performance_tracker';

describe('PerformanceTracker', () => {
  let tracker: PerformanceTracker;

  beforeEach(() => {
    tracker = createPerformanceTracker();
  });

  describe('Cold Boot Tracking', () => {
    it('should track cold boot time', () => {
      tracker.startColdBoot();
      // Simulate some delay
      setTimeout(() => {
        tracker.trackColdBoot();
      }, 10);

      // Wait for async completion
      return new Promise((resolve) => {
        setTimeout(() => {
          const report = tracker.getReport();
          expect(report.cold_boot_ms).toBeGreaterThan(0);
          resolve(undefined);
        }, 50);
      });
    });

    it('should mark cold boot as passing if under target', () => {
      tracker.startColdBoot();
      tracker.trackColdBoot(performance.now() + 1000); // 1 second

      const report = tracker.getReport();
      expect(report.gates.cold_boot_pass).toBe(true); // 1000ms < 3500ms
    });

    it('should mark cold boot as failing if over target', () => {
      tracker.startColdBoot();
      tracker.trackColdBoot(performance.now() + 5000); // 5 seconds

      const report = tracker.getReport();
      expect(report.gates.cold_boot_pass).toBe(false); // 5000ms > 3500ms
    });
  });

  describe('Warm Verification Tracking', () => {
    it('should collect warm verify samples', () => {
      tracker.trackWarmVerify(100);
      tracker.trackWarmVerify(120);
      tracker.trackWarmVerify(110);

      const report = tracker.getReport();
      expect(report.warm_verify_samples).toBe(3);
    });

    it('should calculate p95 from samples', () => {
      // Add samples: 100, 110, 120, 130, 140
      const samples = [100, 110, 120, 130, 140];
      samples.forEach((s) => tracker.trackWarmVerify(s));

      const p95 = tracker.getWarmVerifyP95();
      expect(p95).toBeDefined();
      // p95 should be around 140 or 130 depending on implementation
      expect(p95).toBeGreaterThanOrEqual(130);
    });

    it('should pass if p95 is below target', () => {
      // Target is 300ms
      for (let i = 0; i < 20; i++) {
        tracker.trackWarmVerify(200 + Math.random() * 50); // 200-250ms
      }

      const report = tracker.getReport();
      expect(report.gates.warm_verify_pass).toBe(true);
    });

    it('should fail if p95 is above target', () => {
      // Target is 300ms
      for (let i = 0; i < 20; i++) {
        tracker.trackWarmVerify(400 + Math.random() * 50); // 400-450ms
      }

      const report = tracker.getReport();
      expect(report.gates.warm_verify_pass).toBe(false);
    });

    it('should return null p95 if no samples', () => {
      const p95 = tracker.getWarmVerifyP95();
      expect(p95).toBeNull();
    });
  });

  describe('Batch Processing Tracking', () => {
    it('should track batch completion', () => {
      const startTime = performance.now();
      // Simulate batch work
      setTimeout(() => {
        tracker.trackBatch(startTime, 30);
      }, 100);

      return new Promise((resolve) => {
        setTimeout(() => {
          const report = tracker.getReport();
          expect(report.batch_p95_ms).toBeGreaterThan(0);
          resolve(undefined);
        }, 150);
      });
    });

    it('should pass if batch time is below target', () => {
      tracker.trackBatch(performance.now() - 300, 30); // 300ms for 30 proofs

      const report = tracker.getReport();
      expect(report.gates.batch_pass).toBe(true); // 300ms < 500ms
    });

    it('should fail if batch time is above target', () => {
      tracker.trackBatch(performance.now() - 600, 30); // 600ms for 30 proofs

      const report = tracker.getReport();
      expect(report.gates.batch_pass).toBe(false); // 600ms > 500ms
    });
  });

  describe('Statistics', () => {
    it('should calculate warm verify statistics', () => {
      const samples = [100, 150, 120, 200, 110];
      samples.forEach((s) => tracker.trackWarmVerify(s));

      const stats = tracker.getWarmVerifyStats();
      expect(stats).toBeDefined();
      expect(stats?.min).toBe(100);
      expect(stats?.max).toBe(200);
      expect(stats?.avg).toBeCloseTo(136, 0);
      expect(stats?.samples).toBe(5);
    });

    it('should return null stats if no samples', () => {
      const stats = tracker.getWarmVerifyStats();
      expect(stats).toBeNull();
    });
  });

  describe('Report Generation', () => {
    it('should generate complete report', () => {
      tracker.startColdBoot();
      tracker.trackColdBoot(performance.now() + 1000);
      tracker.trackWarmVerify(250);
      tracker.trackWarmVerify(280);
      tracker.trackBatch(performance.now() - 400, 30);

      const report = tracker.getReport();

      expect(report.cold_boot_ms).toBeDefined();
      expect(report.warm_verify_p95_ms).toBeDefined();
      expect(report.warm_verify_samples).toBe(2);
      expect(report.batch_p95_ms).toBeDefined();
      expect(report.gates.cold_boot_pass).toBeDefined();
      expect(report.gates.warm_verify_pass).toBeDefined();
      expect(report.gates.batch_pass).toBeDefined();
      expect(report.overall_pass).toBeDefined();
    });

    it('should mark overall as pass if all gates pass', () => {
      tracker.startColdBoot();
      tracker.trackColdBoot(performance.now() + 1000);
      tracker.trackWarmVerify(250);
      tracker.trackBatch(performance.now() - 400, 30);

      const report = tracker.getReport();
      expect(report.overall_pass).toBe(true);
    });

    it('should mark overall as fail if any gate fails', () => {
      tracker.startColdBoot();
      tracker.trackColdBoot(performance.now() + 5000); // Fails: 5s > 3.5s
      tracker.trackWarmVerify(250);
      tracker.trackBatch(performance.now() - 400, 30);

      const report = tracker.getReport();
      expect(report.overall_pass).toBe(false);
    });
  });

  describe('Reset', () => {
    it('should reset all metrics', () => {
      tracker.trackWarmVerify(100);
      tracker.trackWarmVerify(200);

      let report = tracker.getReport();
      expect(report.warm_verify_samples).toBe(2);

      tracker.reset();

      report = tracker.getReport();
      expect(report.cold_boot_ms).toBeNull();
      expect(report.warm_verify_samples).toBe(0);
      expect(report.batch_p95_ms).toBeNull();
    });
  });

  describe('Performance Gates', () => {
    it('should have correct target values', () => {
      expect(PERFORMANCE_GATES.COLD_BOOT.target).toBe(3500);
      expect(PERFORMANCE_GATES.WARM_VERIFY.target).toBe(300);
      expect(PERFORMANCE_GATES.BATCH_P95.target).toBe(500);
    });

    it('should have descriptive metric names', () => {
      expect(PERFORMANCE_GATES.COLD_BOOT.metric).toContain('Interactive');
      expect(PERFORMANCE_GATES.WARM_VERIFY.metric).toContain('Verification');
      expect(PERFORMANCE_GATES.BATCH_P95.metric).toContain('Batch');
    });
  });

  describe('JSON Export', () => {
    it('should export as JSON', () => {
      tracker.trackWarmVerify(250);
      const json = tracker.toJSON();

      expect(json).toHaveProperty('warm_verify_p95_ms');
      expect(json).toHaveProperty('warm_verify_samples');
      expect(json).toHaveProperty('gates');
      expect(json).toHaveProperty('overall_pass');
    });
  });
});
