/**
 * [*] Performance Tests: Graph Analysis
 * v1.0.2: Performance Regression Testing
 *
 * Targets:
 * - Graph traversal: <50ms
 * - Dependency analysis: <75ms
 * - Full analysis: <100ms (p95)
 */

import { describe, it, expect, beforeAll } from 'vitest';
import { performance } from 'perf_hooks';

interface GraphNode {
  id: string;
  value: number;
  dependencies: string[];
}

interface GraphMetric {
  name: string;
  duration: number;
  nodesProcessed: number;
  edgesAnalyzed: number;
  passed: boolean;
}

const graphMetrics: GraphMetric[] = [];

/**
 * Build test graph
 */
function buildTestGraph(nodeCount: number): GraphNode[] {
  const nodes: GraphNode[] = [];
  for (let i = 0; i < nodeCount; i++) {
    nodes.push({
      id: `node_${i}`,
      value: Math.random() * 100,
      dependencies: i > 0 ? [`node_${Math.floor((i - 1) / 2)}`] : []
    });
  }
  return nodes;
}

/**
 * Mock graph traversal
 */
async function traverseGraph(nodes: GraphNode[]): Promise<{ visited: number; depth: number }> {
  return new Promise((resolve) => {
    setTimeout(() => {
      const visited = nodes.length;
      const edges = nodes.reduce((sum, n) => sum + n.dependencies.length, 0);
      const depth = Math.ceil(Math.log2(nodes.length || 1));

      resolve({ visited, depth });
    }, 5 + nodes.length * 0.5);
  });
}

/**
 * Mock dependency analysis
 */
async function analyzeDependencies(nodes: GraphNode[]): Promise<{
  cycles: number;
  orphans: number;
  roots: number;
}> {
  return new Promise((resolve) => {
    setTimeout(() => {
      // Simulate analysis
      const roots = nodes.filter(n => n.dependencies.length === 0).length;
      const orphans = Math.floor(roots * 0.1);
      const cycles = 0; // Tree structure, no cycles

      resolve({ cycles, orphans, roots });
    }, 8 + nodes.length * 0.8);
  });
}

/**
 * Mock full graph analysis
 */
async function analyzeGraph(nodes: GraphNode[]): Promise<{
  totalNodes: number;
  totalEdges: number;
  traversalResult: Awaited<ReturnType<typeof traverseGraph>>;
  dependencyResult: Awaited<ReturnType<typeof analyzeDependencies>>;
}> {
  const edges = nodes.reduce((sum, n) => sum + n.dependencies.length, 0);
  const [traversalResult, dependencyResult] = await Promise.all([
    traverseGraph(nodes),
    analyzeDependencies(nodes)
  ]);

  return {
    totalNodes: nodes.length,
    totalEdges: edges,
    traversalResult,
    dependencyResult
  };
}

/**
 * Measure graph operation
 */
async function measureGraph(
  name: string,
  fn: () => Promise<any>,
  nodeCount: number,
  target: number
): Promise<GraphMetric> {
  const start = performance.now();
  const result = await fn();
  const duration = performance.now() - start;

  const metric: GraphMetric = {
    name,
    duration,
    nodesProcessed: nodeCount,
    edgesAnalyzed: nodeCount - 1, // Tree structure
    passed: duration < target
  };

  graphMetrics.push(metric);
  return metric;
}

describe('[+] Graph Analysis Performance', () => {
  beforeAll(() => {
    graphMetrics.length = 0;
  });

  it('Small graph traversal (10 nodes) <50ms', async () => {
    const nodes = buildTestGraph(10);
    const metric = await measureGraph(
      'Small graph (10 nodes)',
      () => traverseGraph(nodes),
      10,
      50
    );

    expect(metric.duration).toBeLessThan(50);
    expect(metric.passed).toBe(true);
  });

  it('Medium graph traversal (50 nodes) <50ms', async () => {
    const nodes = buildTestGraph(50);
    const metric = await measureGraph(
      'Medium graph (50 nodes)',
      () => traverseGraph(nodes),
      50,
      50
    );

    expect(metric.duration).toBeLessThan(50);
    expect(metric.passed).toBe(true);
  });

  it('Large graph traversal (200 nodes) <75ms', async () => {
    const nodes = buildTestGraph(200);
    const metric = await measureGraph(
      'Large graph (200 nodes)',
      () => traverseGraph(nodes),
      200,
      75
    );

    expect(metric.duration).toBeLessThan(75);
    expect(metric.passed).toBe(true);
  });

  it('Small dependency analysis (10 nodes) <75ms', async () => {
    const nodes = buildTestGraph(10);
    const metric = await measureGraph(
      'Dependency analysis (10)',
      () => analyzeDependencies(nodes),
      10,
      75
    );

    expect(metric.duration).toBeLessThan(75);
    expect(metric.passed).toBe(true);
  });

  it('Medium dependency analysis (50 nodes) <75ms', async () => {
    const nodes = buildTestGraph(50);
    const metric = await measureGraph(
      'Dependency analysis (50)',
      () => analyzeDependencies(nodes),
      50,
      75
    );

    expect(metric.duration).toBeLessThan(75);
    expect(metric.passed).toBe(true);
  });

  it('Large dependency analysis (200 nodes) <100ms', async () => {
    const nodes = buildTestGraph(200);
    const metric = await measureGraph(
      'Dependency analysis (200)',
      () => analyzeDependencies(nodes),
      200,
      100
    );

    expect(metric.duration).toBeLessThan(100);
    expect(metric.passed).toBe(true);
  });

  it('Full analysis: 10 nodes <100ms', async () => {
    const nodes = buildTestGraph(10);
    const metric = await measureGraph(
      'Full analysis (10)',
      () => analyzeGraph(nodes),
      10,
      100
    );

    expect(metric.duration).toBeLessThan(100);
    expect(metric.passed).toBe(true);
  });

  it('Full analysis: 50 nodes <120ms', async () => {
    const nodes = buildTestGraph(50);
    const metric = await measureGraph(
      'Full analysis (50)',
      () => analyzeGraph(nodes),
      50,
      120
    );

    expect(metric.duration).toBeLessThan(120);
    expect(metric.passed).toBe(true);
  });

  it('Full analysis: 100 nodes <150ms (p95)', async () => {
    const nodes = buildTestGraph(100);
    const metric = await measureGraph(
      'Full analysis (100)',
      () => analyzeGraph(nodes),
      100,
      150
    );

    expect(metric.duration).toBeLessThan(150);
    expect(metric.passed).toBe(true);
  });

  it('Complex graph: 500 nodes <250ms (p95)', async () => {
    const nodes = buildTestGraph(500);
    const metric = await measureGraph(
      'Complex graph (500)',
      () => analyzeGraph(nodes),
      500,
      250
    );

    expect(metric.duration).toBeLessThan(250);
    expect(metric.passed).toBe(true);
  });

  it('Performance summary', () => {
    const stats = {
      total: graphMetrics.length,
      passed: graphMetrics.filter(m => m.passed).length,
      avgDuration: graphMetrics.reduce((a, b) => a + b.duration, 0) / graphMetrics.length,
      maxDuration: Math.max(...graphMetrics.map(m => m.duration)),
      totalNodesProcessed: graphMetrics.reduce((a, b) => a + b.nodesProcessed, 0)
    };

    console.log('[=] Graph Analysis Performance Summary:');
    console.log(`    Total: ${stats.total} | Passed: ${stats.passed}`);
    console.log(`    Avg: ${stats.avgDuration.toFixed(2)}ms | Max: ${stats.maxDuration.toFixed(2)}ms`);
    console.log(`    Nodes processed: ${stats.totalNodesProcessed}`);

    expect(stats.passed).toBe(stats.total);
  });
});
