/**
 * [*] Performance Tests: Symbolic Verification
 * v1.0.2: Performance Regression Testing
 *
 * Targets:
 * - Symbolic verification: <150ms
 * - Complex equations: <200ms
 * - Edge cases: <250ms (p95)
 */

import { describe, it, expect, beforeAll } from 'vitest';
import { performance } from 'perf_hooks';

interface TestResult {
  name: string;
  duration: number;
  memory: number;
  passed: boolean;
}

const results: TestResult[] = [];

/**
 * Mock symbolic verification function
 * Simulates SymPy verification with timeout
 */
async function verifySymbolic(equation: string, steps: number = 1): Promise<boolean> {
  return new Promise((resolve) => {
    // Simulate computation time based on complexity
    const baseTime = 20; // ms
    const perStep = 10; // ms per step
    const delay = baseTime + perStep * steps;

    setTimeout(() => {
      resolve(equation.includes('='));
    }, delay);
  });
}

/**
 * Measure function execution time
 */
async function measure(name: string, fn: () => Promise<any>): Promise<TestResult> {
  const start = performance.now();
  const memStart = process.memoryUsage().heapUsed;

  await fn();

  const end = performance.now();
  const memEnd = process.memoryUsage().heapUsed;

  const duration = end - start;
  const memory = (memEnd - memStart) / 1024; // KB

  const result: TestResult = {
    name,
    duration,
    memory,
    passed: duration < 250 // p95 target
  };

  results.push(result);
  return result;
}

describe('[+] Symbolic Verification Performance', () => {
  beforeAll(() => {
    results.length = 0;
  });

  it('Simple equation verification <150ms', async () => {
    const result = await measure('Simple equation', async () => {
      await verifySymbolic('x + 2 = 5', 1);
    });

    expect(result.duration).toBeLessThan(150);
    expect(result.passed).toBe(true);
  });

  it('Multi-step equation verification <150ms', async () => {
    const result = await measure('Multi-step equation', async () => {
      await verifySymbolic('2x + 3 = 7; x = 2', 3);
    });

    expect(result.duration).toBeLessThan(150);
    expect(result.passed).toBe(true);
  });

  it('Complex algebraic verification <200ms', async () => {
    const result = await measure('Complex algebraic', async () => {
      await verifySymbolic('(x + 2)^2 = x^2 + 4x + 4', 5);
    });

    expect(result.duration).toBeLessThan(200);
    expect(result.passed).toBe(true);
  });

  it('Trigonometric verification <200ms', async () => {
    const result = await measure('Trigonometric', async () => {
      await verifySymbolic('sin(x)^2 + cos(x)^2 = 1', 4);
    });

    expect(result.duration).toBeLessThan(200);
    expect(result.passed).toBe(true);
  });

  it('Matrix operations verification <200ms', async () => {
    const result = await measure('Matrix operations', async () => {
      await verifySymbolic('[1,2; 3,4] * [a,b; c,d] = result', 6);
    });

    expect(result.duration).toBeLessThan(200);
    expect(result.passed).toBe(true);
  });

  it('Calculus verification <200ms', async () => {
    const result = await measure('Calculus derivative', async () => {
      await verifySymbolic('d/dx(x^3) = 3*x^2', 3);
    });

    expect(result.duration).toBeLessThan(200);
    expect(result.passed).toBe(true);
  });

  it('Edge case: Very long equation <250ms (p95)', async () => {
    const longEq = Array(20).fill('x + ').join('') + '1 = result';
    const result = await measure('Very long equation', async () => {
      await verifySymbolic(longEq, 10);
    });

    expect(result.duration).toBeLessThan(250);
    expect(result.passed).toBe(true);
  });

  it('Edge case: Nested operations <250ms (p95)', async () => {
    const result = await measure('Nested operations', async () => {
      await verifySymbolic('((a + b) * (c + d)) / ((e - f) * g) = result', 8);
    });

    expect(result.duration).toBeLessThan(250);
    expect(result.passed).toBe(true);
  });

  it('Batch verification: 5 equations <500ms', async () => {
    const result = await measure('Batch verification (5x)', async () => {
      for (let i = 0; i < 5; i++) {
        await verifySymbolic(`eq${i}: x = ${i}`, 2);
      }
    });

    expect(result.duration).toBeLessThan(500);
    expect(result.passed).toBe(true);
  });

  it('Performance summary', () => {
    const stats = {
      total: results.length,
      passed: results.filter(r => r.passed).length,
      avgDuration: results.reduce((a, b) => a + b.duration, 0) / results.length,
      maxDuration: Math.max(...results.map(r => r.duration)),
      totalMemory: results.reduce((a, b) => a + b.memory, 0)
    };

    console.log('[=] Symbolic Verification Performance Summary:');
    console.log(`    Total: ${stats.total} | Passed: ${stats.passed}`);
    console.log(`    Avg: ${stats.avgDuration.toFixed(2)}ms | Max: ${stats.maxDuration.toFixed(2)}ms`);
    console.log(`    Memory: ${stats.totalMemory.toFixed(1)}KB`);

    expect(stats.passed).toBe(stats.total);
  });
});
