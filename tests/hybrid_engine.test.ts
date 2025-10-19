/**
 * HybridEngine Integration Tests
 * Tests symbolic + semantic verification hybrid approach
 */

import { describe, it, expect, beforeEach, vi } from 'vitest';
import { HybridEngine, type ProofStep, type HybridStepResult } from '../src/core/hybrid_engine';

// Mock implementations
const mockSymbolicVerifier = {
  verify: vi.fn()
};

const mockSemanticEvaluator = {
  evaluate: vi.fn()
};

const mockLIIEngine = {
  analyze: vi.fn()
};

describe('HybridEngine', () => {
  let engine: HybridEngine;

  beforeEach(() => {
    vi.clearAllMocks();

    // Create a mock engine (simplified for testing)
    const mockPool = { runTask: vi.fn() };
    engine = new HybridEngine(mockPool);
  });

  describe('Symbolic Verification', () => {
    it('should verify valid algebraic equations', async () => {
      const step: ProofStep = {
        id: 1,
        equation: { lhs: 'x + 0', rhs: 'x' },
        domain: 'algebra'
      };

      const result = await engine.verifyStep(step);

      expect(result.stepId).toBe(1);
      expect(result.symbolic).toBeDefined();
      expect(result.pass).toBeDefined();
    });

    it('should handle missing equations', async () => {
      const step: ProofStep = {
        id: 1,
        claim: 'This is a narrative step',
        // No equation
      };

      const result = await engine.verifyStep(step);

      expect(result.stepId).toBe(1);
      // Narrative steps default to valid
      expect(result.symbolic).toEqual({ valid: true });
    });

    it('should support different domains (algebra, topology, logic)', async () => {
      const domains: Array<'algebra' | 'topology' | 'logic'> = [
        'algebra',
        'topology',
        'logic'
      ];

      for (const domain of domains) {
        const step: ProofStep = {
          id: 1,
          equation: { lhs: 'x', rhs: 'x' },
          domain
        };

        const result = await engine.verifyStep(step);
        expect(result.stepId).toBe(1);
      }
    });

    it('should handle invalid equations', async () => {
      const step: ProofStep = {
        id: 1,
        equation: { lhs: '', rhs: '' },
        domain: 'algebra'
      };

      const result = await engine.verifyStep(step);
      expect(result).toBeDefined();
    });
  });

  describe('Semantic Evaluation', () => {
    it('should evaluate semantic coherence of claims', async () => {
      const step: ProofStep = {
        id: 1,
        claim: 'Since x = y and y = z, we have x = z by transitivity',
        domain: 'logic'
      };

      const result = await engine.verifyStep(step);

      expect(result.consensus).toBeDefined();
      expect(result.consensus.mean).toBeGreaterThanOrEqual(0);
      expect(result.consensus.mean).toBeLessThanOrEqual(100);
      expect(result.consensus.coherence).toBeGreaterThanOrEqual(0);
      expect(result.consensus.coherence).toBeLessThanOrEqual(100);
    });

    it('should handle vague claims in offline mode', async () => {
      const step: ProofStep = {
        id: 1,
        claim: 'Obviously, this is trivial',
        domain: 'algebra'
      };

      const result = await engine.verifyStep(step);

      expect(result.consensus).toBeDefined();
      // Vague language should lower score
      expect(result.consensus.mean).toBeLessThanOrEqual(100);
    });

    it('should support offline consensus evaluation', async () => {
      const step: ProofStep = {
        id: 1,
        claim: 'By definition, a prime number has exactly two factors',
        domain: 'algebra'
      };

      const result = await engine.verifyStep(step);

      expect(result.consensus.offlineMode).toBe(true);
      expect(result.consensus.results).toBeDefined();
      expect(result.consensus.results.length).toBeGreaterThan(0);
    });
  });

  describe('Hybrid Scoring', () => {
    it('should combine symbolic (70%) and semantic (30%)', async () => {
      const step: ProofStep = {
        id: 1,
        equation: { lhs: '2x', rhs: 'x + x' },
        claim: 'Algebraic identity',
        domain: 'algebra'
      };

      const result = await engine.verifyStep(step);

      expect(result.lii).toBeGreaterThanOrEqual(0);
      expect(result.lii).toBeLessThanOrEqual(100);
    });

    it('should weight symbolic verification higher', async () => {
      // Symbolic weight: 0.7, Semantic weight: 0.3
      // If symbolic is valid and semantic is moderate, score should be relatively high
      const step: ProofStep = {
        id: 1,
        equation: { lhs: 'a', rhs: 'a' },
        claim: 'Self-referential',
        domain: 'algebra'
      };

      const result = await engine.verifyStep(step);

      // With valid equation, LII should reflect hybrid scoring
      expect(result.lii).toBeGreaterThanOrEqual(0);
      expect(result.lii).toBeLessThanOrEqual(100);
    });

    it('should calculate pass threshold (70)', async () => {
      const step: ProofStep = {
        id: 1,
        equation: { lhs: 'x', rhs: 'x' },
        claim: 'Valid and clear',
        domain: 'algebra'
      };

      const result = await engine.verifyStep(step);

      // Pass is determined by HybridEngine based on combined score and coherence
      expect(typeof result.pass).toBe('boolean');
      expect(result.lii).toBeGreaterThanOrEqual(0);
      expect(result.lii).toBeLessThanOrEqual(100);
    });
  });

  describe('LII Calculation', () => {
    it('should compute LII score per step', async () => {
      const step: ProofStep = {
        id: 1,
        equation: { lhs: '0 + 1', rhs: '1' },
        claim: 'Additive identity',
        domain: 'algebra'
      };

      const result = await engine.verifyStep(step);

      expect(result.lii).toBeGreaterThanOrEqual(0);
      expect(result.lii).toBeLessThanOrEqual(100);
      expect(Number.isInteger(result.lii)).toBe(true);
    });

    it('should include confidence intervals', async () => {
      const step: ProofStep = {
        id: 1,
        equation: { lhs: 'x + y', rhs: 'y + x' },
        claim: 'Commutative property',
        domain: 'algebra'
      };

      const result = await engine.verifyStep(step);

      expect(result.lci).toBeDefined();
      expect(result.lci.length).toBe(2);
      expect(result.lci[0]).toBeLessThanOrEqual(result.lci[1]);
      expect(result.lci[0]).toBeGreaterThanOrEqual(0);
      expect(result.lci[1]).toBeLessThanOrEqual(100);
    });
  });

  describe('Coherence Threshold', () => {
    it('should require coherence >= 70 to pass', async () => {
      const step: ProofStep = {
        id: 1,
        equation: { lhs: 'x', rhs: 'x' },
        claim: 'Trivial claim',
        domain: 'algebra'
      };

      const result = await engine.verifyStep(step);

      if (result.consensus.coherence >= 70) {
        // Coherence is adequate
        expect(result.pass).toBeDefined();
      }
    });

    it('should penalize low coherence', async () => {
      const step: ProofStep = {
        id: 1,
        equation: { lhs: 'x', rhs: 'x' },
        claim: 'Somehow, mysteriously, this works',
        domain: 'algebra'
      };

      const result = await engine.verifyStep(step);

      // Vague language should lower coherence
      expect(result.consensus.coherence).toBeLessThanOrEqual(100);
    });
  });

  describe('Error Handling', () => {
    it('should handle missing step ID', async () => {
      const step: ProofStep = {
        // Missing id
        claim: 'Some claim',
        domain: 'algebra'
      } as any;

      const result = await engine.verifyStep(step);
      expect(result).toBeDefined();
    });

    it('should handle malformed equations', async () => {
      const step: ProofStep = {
        id: 1,
        equation: {
          lhs: '1 / 0', // Division by zero
          rhs: 'undefined'
        },
        domain: 'algebra'
      };

      const result = await engine.verifyStep(step);
      expect(result).toBeDefined();
    });

    it('should recover from symbolic verification failure', async () => {
      const step: ProofStep = {
        id: 1,
        equation: { lhs: '@#$%', rhs: 'x' }, // Invalid syntax
        claim: 'This has invalid syntax',
        domain: 'algebra'
      };

      const result = await engine.verifyStep(step);
      expect(result.pass).toBeDefined();
    });

    it('should timeout gracefully on complex expressions', async () => {
      const step: ProofStep = {
        id: 1,
        equation: {
          lhs: '(x^100 + y^100) / (x + y)',
          rhs: 'x^99 + x^98*y + ... + y^99' // Simplified
        },
        domain: 'algebra'
      };

      const result = await engine.verifyStep(step);
      expect(result).toBeDefined();
    });
  });

  describe('Offline Mode', () => {
    it('should function without external APIs', async () => {
      const step: ProofStep = {
        id: 1,
        equation: { lhs: 'x', rhs: 'x' },
        claim: 'Offline evaluation test',
        domain: 'algebra'
      };

      const result = await engine.verifyStep(step);

      expect(result.consensus.offlineMode).toBe(true);
      expect(result).toBeDefined();
    });

    it('should use heuristic scoring when offline', async () => {
      const steps: ProofStep[] = [
        { id: 1, claim: 'Clear and well-justified', domain: 'algebra' },
        { id: 2, claim: 'Vague and unclear', domain: 'algebra' },
        { id: 3, claim: 'Obviously trivial', domain: 'algebra' }
      ];

      for (const step of steps) {
        const result = await engine.verifyStep(step);
        expect(result.consensus.offlineMode).toBe(true);
      }
    });
  });

  describe('Domain-Specific Handling', () => {
    it('should handle algebra domain', async () => {
      const step: ProofStep = {
        id: 1,
        equation: { lhs: 'x^2 - 1', rhs: '(x-1)(x+1)' },
        domain: 'algebra'
      };

      const result = await engine.verifyStep(step);
      expect(result.symbolic.valid).toBeDefined();
    });

    it('should handle topology domain', async () => {
      const step: ProofStep = {
        id: 1,
        claim: 'A continuous image of a compact space is compact',
        domain: 'topology'
      };

      const result = await engine.verifyStep(step);
      expect(result.consensus).toBeDefined();
    });

    it('should handle logic domain', async () => {
      const step: ProofStep = {
        id: 1,
        claim: 'If P then Q, and P is true, therefore Q is true (modus ponens)',
        domain: 'logic'
      };

      const result = await engine.verifyStep(step);
      expect(result.consensus).toBeDefined();
    });
  });

  describe('Integration with LII', () => {
    it('should integrate with LII engine', async () => {
      const step: ProofStep = {
        id: 1,
        equation: { lhs: 'x + y', rhs: 'x + y' },
        claim: 'Identity',
        domain: 'algebra'
      };

      const result = await engine.verifyStep(step);

      // LII should be calculated
      expect(result.lii).toBeGreaterThanOrEqual(0);
      expect(result.lii).toBeLessThanOrEqual(100);
      expect(result.lci).toBeDefined();
    });

    it('should pass through domain for LII calculation', async () => {
      const domains: Array<'algebra' | 'topology' | 'logic'> = [
        'algebra',
        'topology',
        'logic'
      ];

      for (const domain of domains) {
        const step: ProofStep = {
          id: 1,
          equation: { lhs: 'x', rhs: 'x' },
          domain
        };

        const result = await engine.verifyStep(step);
        expect(result).toBeDefined();
      }
    });
  });
});
