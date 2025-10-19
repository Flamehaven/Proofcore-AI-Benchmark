/**
 * ProofCore Graph Analyzer
 * Analyzes proof dependency graphs for circular reasoning and structural issues
 * Adapted from ProofBench 3.8 with ProofCore integration
 */

export interface ProofStep {
  id: string | number;
  content?: string;
  claim?: string;
  type?: 'assumption' | 'derivation' | 'conclusion';
  dependencies?: (string | number)[];
  equation?: {
    lhs: string;
    rhs: string;
  };
}

export interface GraphResult {
  depth: number;
  cycles: number;
  bottlenecks: number;
  errors: Array<{
    step_id: string | number;
    type: 'circular';
    severity: 'critical';
    message: string;
  }>;
  criticalPath?: (string | number)[];
  topologicalSort?: (string | number)[] | null;
}

export interface D3GraphData {
  nodes: Array<{
    id: string | number;
    label: string;
    depth: number;
    error: boolean;
  }>;
  edges: Array<{
    source: string | number;
    target: string | number;
    type: 'implies' | 'uses' | 'contradicts';
  }>;
}

/**
 * GraphAnalyzer: Detects circular reasoning and analyzes proof structure
 */
export class GraphAnalyzer {
  private steps: ProofStep[] = [];
  private adjacencyList: Map<string | number, (string | number)[]> = new Map();
  private depthCache: Map<string | number, number> = new Map();
  private cycleCache: (string | number)[][] | null = null;
  private lastD3Data: D3GraphData | null = null;

  /**
   * Main analysis entry point
   */
  analyze(steps: ProofStep[]): GraphResult {
    this.steps = steps;
    this.buildAdjacencyList();
    this.depthCache.clear();
    this.cycleCache = null;

    // Calculate metrics
    const depth = this.calculateMaxDepth();
    const cycles = this.detectCycles();
    const bottlenecks = this.findBottlenecks();
    const criticalPath = this.getCriticalPath();
    const topologicalSort = this.topologicalSort();

    // Build error list
    const errors: GraphResult['errors'] = [];

    if (cycles.length > 0) {
      for (const cycle of cycles) {
        const cycleStr = cycle.map(c => c.toString()).join(' -> ');
        errors.push({
          step_id: cycle[0],
          type: 'circular',
          severity: 'critical',
          message: `Circular reasoning detected: ${cycleStr}`
        });
      }
    }

    return {
      depth,
      cycles: cycles.length,
      bottlenecks,
      errors,
      criticalPath,
      topologicalSort
    };
  }

  /**
   * Build adjacency list from proof steps
   */
  private buildAdjacencyList() {
    this.adjacencyList.clear();

    for (const step of this.steps) {
      const stepId = step.id;
      if (!this.adjacencyList.has(stepId)) {
        this.adjacencyList.set(stepId, []);
      }

      const deps = step.dependencies || [];
      for (const dep of deps) {
        if (!this.adjacencyList.has(dep)) {
          this.adjacencyList.set(dep, []);
        }
        // Edge: dep -> step (dependency points to dependent)
        const neighbors = this.adjacencyList.get(dep)!;
        if (!neighbors.includes(stepId)) {
          neighbors.push(stepId);
        }
      }
    }
  }

  /**
   * Calculate maximum derivation depth
   */
  private calculateMaxDepth(): number {
    this.depthCache.clear();
    let maxDepth = 0;

    for (const step of this.steps) {
      const depth = this.calculateDepthDFS(step.id);
      maxDepth = Math.max(maxDepth, depth);
    }

    return maxDepth;
  }

  /**
   * DFS calculation of step depth
   */
  private calculateDepthDFS(
    stepId: string | number,
    visited: Set<string | number> = new Set()
  ): number {
    // Check cache
    if (this.depthCache.has(stepId)) {
      return this.depthCache.get(stepId)!;
    }

    // Prevent infinite recursion
    if (visited.has(stepId)) {
      return 0;
    }

    visited.add(stepId);

    // Find step
    const step = this.steps.find(s => s.id === stepId);
    if (!step) {
      return 0;
    }

    // Base case: no dependencies = depth 1
    const deps = step.dependencies || [];
    if (deps.length === 0) {
      this.depthCache.set(stepId, 1);
      return 1;
    }

    // Recursive case: 1 + max depth of dependencies
    let maxDepDep = 0;
    for (const dep of deps) {
      const depDepth = this.calculateDepthDFS(dep, new Set(visited));
      maxDepDep = Math.max(maxDepDep, depDepth);
    }

    const depth = 1 + maxDepDep;
    this.depthCache.set(stepId, depth);

    return depth;
  }

  /**
   * Detect circular reasoning using DFS
   */
  private detectCycles(): (string | number)[][] {
    if (this.cycleCache !== null) {
      return this.cycleCache;
    }

    const cycles: (string | number)[][] = [];
    const visited = new Set<string | number>();
    const recStack = new Set<string | number>();

    const dfs = (node: string | number, path: (string | number)[]): void => {
      visited.add(node);
      recStack.add(node);
      path.push(node);

      const neighbors = this.adjacencyList.get(node) || [];

      for (const neighbor of neighbors) {
        if (!visited.has(neighbor)) {
          dfs(neighbor, [...path]);
        } else if (recStack.has(neighbor)) {
          // Cycle detected
          const cycleStart = path.indexOf(neighbor);
          const cycle = path.slice(cycleStart);
          cycle.push(neighbor); // Complete the cycle
          cycles.push(cycle);
        }
      }

      recStack.delete(node);
    };

    for (const step of this.steps) {
      if (!visited.has(step.id)) {
        dfs(step.id, []);
      }
    }

    this.cycleCache = cycles;
    return cycles;
  }

  /**
   * Find bottleneck steps (high in-degree nodes)
   */
  private findBottlenecks(): number {
    // Bottleneck: node with high in-degree (many steps depend on it)
    const inDegree = new Map<string | number, number>();

    // Initialize
    for (const step of this.steps) {
      inDegree.set(step.id, 0);
    }

    // Count incoming edges
    for (const step of this.steps) {
      const deps = step.dependencies || [];
      for (const dep of deps) {
        inDegree.set(dep, (inDegree.get(dep) || 0) + 1);
      }
    }

    // Bottleneck: in-degree >= 3
    const bottlenecks = Array.from(inDegree.values()).filter(deg => deg >= 3);

    return bottlenecks.length;
  }

  /**
   * Get topological sort (returns null if cycles exist)
   */
  topologicalSort(): (string | number)[] | null {
    if (this.detectCycles().length > 0) {
      return null; // Not a DAG
    }

    const visited = new Set<string | number>();
    const stack: (string | number)[] = [];

    const dfs = (node: string | number): void => {
      visited.add(node);

      const neighbors = this.adjacencyList.get(node) || [];
      for (const neighbor of neighbors) {
        if (!visited.has(neighbor)) {
          dfs(neighbor);
        }
      }

      stack.push(node);
    };

    for (const step of this.steps) {
      if (!visited.has(step.id)) {
        dfs(step.id);
      }
    }

    return stack.reverse();
  }

  /**
   * Get critical path (longest path in DAG)
   */
  getCriticalPath(): (string | number)[] {
    const topoSort = this.topologicalSort();
    if (!topoSort) {
      return []; // Not a DAG
    }

    // Dynamic programming: longest path to each node
    const dist = new Map<string | number, number>();
    const parent = new Map<string | number, string | number>();

    for (const node of topoSort) {
      dist.set(node, 0);
    }

    for (const node of topoSort) {
      const neighbors = this.adjacencyList.get(node) || [];

      for (const neighbor of neighbors) {
        const newDist = (dist.get(node) || 0) + 1;
        if (newDist > (dist.get(neighbor) || 0)) {
          dist.set(neighbor, newDist);
          parent.set(neighbor, node);
        }
      }
    }

    // Find node with max distance
    let maxDist = 0;
    let endNode: string | number | null = null;

    dist.forEach((d, node) => {
      if (d > maxDist) {
        maxDist = d;
        endNode = node;
      }
    });

    if (endNode === null) {
      return [];
    }

    // Reconstruct path
    const path: (string | number)[] = [];
    let current: string | number | undefined = endNode;

    while (current !== undefined) {
      path.push(current);
      current = parent.get(current);
    }

    return path.reverse();
  }

  /**
   * Convert to D3.js visualization format
   */
  toD3Format(): D3GraphData {
    const nodes: D3GraphData['nodes'] = [];
    const edges: D3GraphData['edges'] = [];

    // Build nodes
    for (const step of this.steps) {
      const depth = this.depthCache.get(step.id) || 0;
      const label =
        (step.content || step.claim || step.id?.toString() || 'unknown')
          .substring(0, 50) +
        (((step.content || step.claim || step.id?.toString() || 'unknown')
          .length || 0) > 50
          ? '...'
          : '');

      nodes.push({
        id: step.id,
        label,
        depth,
        error: false // Will be set by error detection
      });
    }

    // Build edges
    for (const step of this.steps) {
      const deps = step.dependencies || [];
      for (const dep of deps) {
        edges.push({
          source: dep,
          target: step.id,
          type: 'implies' // Default edge type
        });
      }
    }

    // Mark error nodes (from cycles)
    const cycles = this.detectCycles();
    const errorNodes = new Set(cycles.flat());

    for (const node of nodes) {
      if (errorNodes.has(node.id)) {
        node.error = true;
      }
    }

    this.lastD3Data = { nodes, edges };
    return { nodes, edges };
  }

  /**
   * Get last generated D3 data
   */
  getD3Data(): D3GraphData | null {
    return this.lastD3Data;
  }
}

export const graphAnalyzer = new GraphAnalyzer();
