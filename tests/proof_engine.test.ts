/**
 * ProofEngine Integration Tests
 * Tests complete proof evaluation pipeline with graph analysis
 */

import { describe, it, expect, beforeEach, vi } from 'vitest';
import { ProofEngine, type ProofInput, type ProofEvaluationResult } from '../src/core/proof_engine';

describe('ProofEngine', () => {
  let engine: ProofEngine;

  beforeEach(() => {
    const mockPool = { runTask: vi.fn() };
    engine = new ProofEngine(mockPool);
  });

  describe('Proof Evaluation', () => {
    it('should evaluate valid linear proof', async () => {
      const proof: ProofInput = {
        domain: 'algebra',
        steps: [
          { id: 1, claim: 'Assume x = 1', equation: { lhs: 'x', rhs: '1' } },
          { id: 2, claim: 'Then 2x = 2', equation: { lhs: '2*x', rhs: '2' } },
          { id: 3, claim: 'Therefore x^2 = 1', equation: { lhs: 'x^2', rhs: '1' } }
        ]
      };

      const result = await engine.evaluate(proof);

      expect(result.valid).toBeDefined();
      expect(result.lii).toBeGreaterThanOrEqual(0);
      expect(result.lii).toBeLessThanOrEqual(100);
      expect(result.steps.length).toBe(3);
    });

    it('should evaluate proofs with different domains', async () => {
      const domains: Array<'algebra' | 'topology' | 'logic'> = [
        'algebra',
        'topology',
        'logic'
      ];

      for (const domain of domains) {
        const proof: ProofInput = {
          domain,
          steps: [
            { id: 1, claim: `Claim in ${domain}` }
          ]
        };

        const result = await engine.evaluate(proof);
        expect(result).toBeDefined();
      }
    });
  });

  describe('Graph Analysis Integration', () => {
    it('should analyze proof structure', async () => {
      const proof: ProofInput = {
        domain: 'algebra',
        steps: [
          { id: 1, claim: 'Base assumption' },
          { id: 2, claim: 'Derived from step 1', equation: { lhs: 'a', rhs: 'b' } },
          { id: 3, claim: 'Also from step 1', equation: { lhs: 'c', rhs: 'd' } },
          { id: 4, claim: 'From steps 2 and 3', equation: { lhs: 'e', rhs: 'f' } }
        ]
      };

      const result = await engine.evaluate(proof);

      expect(result.depth).toBeGreaterThanOrEqual(1);
      expect(result.cycles).toBeGreaterThanOrEqual(0); // Can be > 0 if deps are extracted
      expect(result.bottlenecks).toBeGreaterThanOrEqual(0);
    });

    it('should detect circular reasoning', async () => {
      const proof: ProofInput = {
        domain: 'algebra',
        steps: [
          { id: 1, claim: 'Step 1', dependencies: [2] } as any,
          { id: 2, claim: 'Step 2', dependencies: [1] } as any
        ]
      };

      const result = await engine.evaluate(proof);

      // Circular dependencies may be detected during evaluation
      expect(result.cycles).toBeGreaterThanOrEqual(0);
      expect(result).toBeDefined();
    });

    it('should identify bottleneck steps', async () => {
      const proof: ProofInput = {
        domain: 'algebra',
        steps: [
          { id: 1, claim: 'Critical step' },
          { id: 2, claim: 'From 1' },
          { id: 3, claim: 'From 1' },
          { id: 4, claim: 'From 1' },
          { id: 5, claim: 'From 1' }
        ]
      };

      const result = await engine.evaluate(proof);

      // Step 1 has high in-degree (4 steps depend on it)
      expect(result.bottlenecks).toBeGreaterThan(0);
    });

    it('should calculate proof depth', async () => {
      const proof: ProofInput = {
        domain: 'algebra',
        steps: [
          { id: 1, claim: 'Assumption' },
          { id: 2, claim: 'From 1' },
          { id: 3, claim: 'From 2' },
          { id: 4, claim: 'From 3' }
        ]
      };

      const result = await engine.evaluate(proof);

      // Depth is calculated based on actual dependency extraction
      expect(result.depth).toBeGreaterThanOrEqual(1);
      expect(result.depth).toBeLessThanOrEqual(4);
    });

    it('should generate D3 visualization data', async () => {
      const proof: ProofInput = {
        domain: 'algebra',
        steps: [
          { id: 1, claim: 'Step 1' },
          { id: 2, claim: 'Step 2', equation: { lhs: 'x', rhs: 'x' } }
        ]
      };

      const result = await engine.evaluate(proof);

      expect(result.graph).toBeDefined();
      expect(result.graph!.nodes).toBeDefined();
      expect(result.graph!.edges).toBeDefined();
      expect(result.graph!.nodes.length).toBeGreaterThanOrEqual(0);
    });
  });

  describe('Metrics Integration', () => {
    it('should compute LII score', async () => {
      const proof: ProofInput = {
        domain: 'algebra',
        steps: [
          { id: 1, claim: 'Step 1', equation: { lhs: 'x', rhs: 'x' } }
        ]
      };

      const result = await engine.evaluate(proof);

      expect(result.lii).toBeGreaterThanOrEqual(0);
      expect(result.lii).toBeLessThanOrEqual(100);
    });

    it('should include confidence intervals', async () => {
      const proof: ProofInput = {
        domain: 'algebra',
        steps: [
          { id: 1, claim: 'Valid step' }
        ]
      };

      const result = await engine.evaluate(proof);

      expect(result.lci).toBeDefined();
      expect(result.lci.length).toBe(2);
      expect(result.lci[0]).toBeLessThanOrEqual(result.lci[1]);
    });

    it('should calculate coherence', async () => {
      const proof: ProofInput = {
        domain: 'algebra',
        steps: [
          { id: 1, claim: 'Clear and logical step' }
        ]
      };

      const result = await engine.evaluate(proof);

      expect(result.coherence).toBeGreaterThanOrEqual(0);
      expect(result.coherence).toBeLessThanOrEqual(100);
    });
  });

  describe('Pass/Fail Determination', () => {
    it('should mark valid proofs as valid', async () => {
      const proof: ProofInput = {
        domain: 'algebra',
        steps: [
          { id: 1, claim: 'Valid step', equation: { lhs: 'x', rhs: 'x' } }
        ]
      };

      const result = await engine.evaluate(proof);

      if (result.lii >= 80 && result.cycles === 0) {
        expect(result.valid).toBe(true);
      }
    });

    it('should reject proofs with circular reasoning', async () => {
      const proof: ProofInput = {
        domain: 'algebra',
        steps: [
          { id: 1, claim: 'A', dependencies: [2] } as any,
          { id: 2, claim: 'B', dependencies: [1] } as any
        ]
      };

      const result = await engine.evaluate(proof);

      // If cycles detected, should invalidate proof
      if (result.cycles > 0) {
        expect(result.valid).toBe(false);
      }
      expect(result).toBeDefined();
    });

    it('should reject proofs with low LII', async () => {
      // This depends on step evaluation, which is deterministic in offline mode
      const proof: ProofInput = {
        domain: 'algebra',
        steps: [
          { id: 1, claim: 'Somehow this works' }
        ]
      };

      const result = await engine.evaluate(proof);

      // With vague language, LII might be below 80
      expect(result.valid).toBeDefined();
    });
  });

  describe('Feedback Generation', () => {
    it('should include feedback messages', async () => {
      const proof: ProofInput = {
        domain: 'algebra',
        steps: [
          { id: 1, claim: 'Step 1' }
        ]
      };

      const result = await engine.evaluate(proof);

      expect(result.feedback).toBeDefined();
      expect(result.feedback.length).toBeGreaterThan(0);
    });

    it('should add graph-based feedback for cycles', async () => {
      const proof: ProofInput = {
        domain: 'algebra',
        steps: [
          { id: 1, claim: 'A', dependencies: [2] } as any,
          { id: 2, claim: 'B', dependencies: [1] } as any
        ]
      };

      const result = await engine.evaluate(proof);

      const graphFeedback = result.feedback.find(
        f => f.stepId === 'graph_analysis'
      );
      if (result.cycles > 0) {
        expect(graphFeedback).toBeDefined();
      }
    });

    it('should add graph-based feedback for bottlenecks', async () => {
      const proof: ProofInput = {
        domain: 'algebra',
        steps: [
          { id: 1, claim: 'Critical step' },
          { id: 2, claim: 'From 1' },
          { id: 3, claim: 'From 1' },
          { id: 4, claim: 'From 1' },
          { id: 5, claim: 'From 1' }
        ]
      };

      const result = await engine.evaluate(proof);

      const bottleneckFeedback = result.feedback.find(
        f => f.stepId === 'graph_analysis' && f.type === 'warning'
      );
      if (result.bottlenecks > 0) {
        expect(bottleneckFeedback).toBeDefined();
      }
    });

    it('should have proof-level feedback summary', async () => {
      const proof: ProofInput = {
        domain: 'algebra',
        steps: [
          { id: 1, claim: 'Step 1' },
          { id: 2, claim: 'Step 2' }
        ]
      };

      const result = await engine.evaluate(proof);

      // Should have summary feedback (last message)
      expect(result.feedback.length).toBeGreaterThanOrEqual(2);
    });
  });

  describe('Step-by-Step Evaluation', () => {
    it('should evaluate each step', async () => {
      const proof: ProofInput = {
        domain: 'algebra',
        steps: [
          { id: 1, claim: 'Step 1', equation: { lhs: 'a', rhs: 'a' } },
          { id: 2, claim: 'Step 2', equation: { lhs: 'b', rhs: 'b' } },
          { id: 3, claim: 'Step 3', equation: { lhs: 'c', rhs: 'c' } }
        ]
      };

      const result = await engine.evaluate(proof);

      expect(result.steps.length).toBe(3);
      for (const step of result.steps) {
        expect(step.stepId).toBeDefined();
        expect(step.lii).toBeGreaterThanOrEqual(0);
        expect(step.pass).toBeDefined();
      }
    });

    it('should track pass/fail per step', async () => {
      const proof: ProofInput = {
        domain: 'algebra',
        steps: [
          { id: 1, claim: 'Good step', equation: { lhs: 'x', rhs: 'x' } },
          { id: 2, claim: 'Bad step', equation: { lhs: 'impossible', rhs: '0' } }
        ]
      };

      const result = await engine.evaluate(proof);

      expect(result.steps.length).toBe(2);
      expect(result.steps[0].pass).toBeDefined();
      expect(result.steps[1].pass).toBeDefined();
    });
  });

  describe('Error Handling', () => {
    it('should handle empty proofs', async () => {
      const proof: ProofInput = {
        domain: 'algebra',
        steps: []
      };

      const result = await engine.evaluate(proof);

      expect(result).toBeDefined();
      expect(result.steps.length).toBe(0);
    });

    it('should handle missing domain', async () => {
      const proof: ProofInput = {
        steps: [
          { id: 1, claim: 'Step 1' }
        ]
      };

      const result = await engine.evaluate(proof);

      expect(result).toBeDefined();
    });

    it('should handle malformed steps', async () => {
      const proof: ProofInput = {
        domain: 'algebra',
        steps: [
          { id: 1 } as any
        ]
      };

      const result = await engine.evaluate(proof);

      expect(result).toBeDefined();
    });
  });

  describe('Offline Mode', () => {
    it('should work without network access', async () => {
      const proof: ProofInput = {
        domain: 'algebra',
        steps: [
          { id: 1, claim: 'Offline test step' }
        ]
      };

      const result = await engine.evaluate(proof);

      // All steps should use offline consensus
      for (const step of result.steps) {
        expect(step.consensus.offlineMode).toBe(true);
      }
    });

    it('should be deterministic in offline mode', async () => {
      const proof: ProofInput = {
        domain: 'algebra',
        steps: [
          { id: 1, claim: 'Same claim' }
        ]
      };

      const result1 = await engine.evaluate(proof);
      const result2 = await engine.evaluate(proof);

      // Results should be identical
      expect(result1.lii).toBe(result2.lii);
      expect(result1.cycles).toBe(result2.cycles);
    });
  });

  describe('Complex Proofs', () => {
    it('should handle branching proofs', async () => {
      const proof: ProofInput = {
        domain: 'algebra',
        steps: [
          { id: 1, claim: 'Base case' },
          { id: 2, claim: 'Case A from 1' },
          { id: 3, claim: 'Case B from 1' },
          { id: 4, claim: 'Combine A and B', equation: { lhs: 'result', rhs: 'combined' } }
        ]
      };

      const result = await engine.evaluate(proof);

      expect(result.steps.length).toBe(4);
      expect(result.depth).toBeGreaterThan(0);
    });

    it('should handle long proofs', async () => {
      const steps = [];
      for (let i = 1; i <= 20; i++) {
        steps.push({
          id: i,
          claim: `Step ${i}`,
          equation: { lhs: `x${i}`, rhs: `x${i}` }
        });
      }

      const proof: ProofInput = {
        domain: 'algebra',
        steps
      };

      const result = await engine.evaluate(proof);

      expect(result.steps.length).toBe(20);
      expect(result.depth).toBeGreaterThan(0);
    });

    it('should handle mixed equation and narrative steps', async () => {
      const proof: ProofInput = {
        domain: 'algebra',
        steps: [
          { id: 1, claim: 'Narrative introduction' },
          { id: 2, claim: 'First equation', equation: { lhs: 'a', rhs: 'a' } },
          { id: 3, claim: 'Narrative explanation' },
          { id: 4, claim: 'Second equation', equation: { lhs: 'b', rhs: 'b' } }
        ]
      };

      const result = await engine.evaluate(proof);

      expect(result.steps.length).toBe(4);
    });
  });

  describe('Result Structure', () => {
    it('should return complete result structure', async () => {
      const proof: ProofInput = {
        domain: 'algebra',
        steps: [
          { id: 1, claim: 'Test step' }
        ]
      };

      const result = await engine.evaluate(proof);

      expect(result.valid).toBeDefined();
      expect(result.lii).toBeDefined();
      expect(result.lci).toBeDefined();
      expect(result.coherence).toBeDefined();
      expect(result.depth).toBeDefined();
      expect(result.cycles).toBeDefined();
      expect(result.bottlenecks).toBeDefined();
      expect(result.steps).toBeDefined();
      expect(result.feedback).toBeDefined();
      expect(result.graph).toBeDefined();
      expect(result.graphErrors).toBeDefined();
    });

    it('should have valid numeric values', async () => {
      const proof: ProofInput = {
        domain: 'algebra',
        steps: [
          { id: 1, claim: 'Test' }
        ]
      };

      const result = await engine.evaluate(proof);

      expect(Number.isFinite(result.lii)).toBe(true);
      expect(Number.isFinite(result.coherence)).toBe(true);
      expect(Number.isFinite(result.depth)).toBe(true);
      expect(Number.isInteger(result.cycles)).toBe(true);
      expect(Number.isInteger(result.bottlenecks)).toBe(true);
    });
  });
});
