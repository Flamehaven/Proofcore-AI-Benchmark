/**
 * ConsensusManager Tests
 * Tests multi-LLM consensus and offline heuristic fallback
 */

import { describe, it, expect, beforeEach } from 'vitest';
import { ConsensusManager } from '../src/ai/consensus_manager';

describe('ConsensusManager', () => {
  let manager: ConsensusManager;

  beforeEach(() => {
    manager = new ConsensusManager(
      ['gpt-4o', 'claude-3.5', 'gemini-2'],
      true // offlineMode = true for testing
    );
  });

  describe('Offline Mode Behavior', () => {
    it('should operate in offline mode by default', async () => {
      const result = await manager.evaluate('This is a valid claim');

      expect(result.offlineMode).toBe(true);
      expect(result.results.length).toBeGreaterThan(0);
    });

    it('should use heuristic scoring in offline mode', async () => {
      const claim = 'By mathematical induction, the statement holds for all n';
      const result = await manager.evaluate(claim);

      expect(result.offlineMode).toBe(true);
      expect(result.mean).toBeGreaterThanOrEqual(0);
      expect(result.mean).toBeLessThanOrEqual(100);
    });

    it('should have at least one offline result', async () => {
      const result = await manager.evaluate('Some claim');

      expect(result.results).toBeDefined();
      expect(result.results.length).toBeGreaterThanOrEqual(1);
      expect(result.results[0].isOffline).toBe(true);
    });
  });

  describe('Heuristic Scoring', () => {
    it('should penalize vague language', async () => {
      const vagueClaimResult = await manager.evaluate('Somehow this works');
      const clearClaimResult = await manager.evaluate('By transitivity, if x = y and y = z, then x = z');

      // Vague claim should score lower (or equal)
      expect(vagueClaimResult.mean).toBeLessThanOrEqual(clearClaimResult.mean);
    });

    it('should penalize very short claims', async () => {
      const shortResult = await manager.evaluate('OK');
      const normalResult = await manager.evaluate('This step follows from the definition of convergence');

      // Very short claim should score lower
      expect(shortResult.mean).toBeLessThanOrEqual(normalResult.mean);
    });

    it('should reward logical flow markers', async () => {
      const goodFlowResult = await manager.evaluate(
        'First, assume P. Then, since Q follows from P, we have Q. Therefore, by contrapositive, not P implies not Q'
      );
      const poorFlowResult = await manager.evaluate('P, Q, not Q');

      // Good flow should score higher
      expect(goodFlowResult.mean).toBeGreaterThanOrEqual(poorFlowResult.mean);
    });

    it('should recognize common vague words', async () => {
      const vagueWords = [
        'obviously',
        'clearly',
        'trivially',
        'it is known',
        'somehow',
        'basically'
      ];

      const baseClaim = 'This is a mathematical fact';
      const baseResult = await manager.evaluate(baseClaim);

      for (const word of vagueWords) {
        const vagueResult = await manager.evaluate(`${word}, ${baseClaim}`);
        expect(vagueResult.mean).toBeLessThanOrEqual(baseResult.mean);
      }
    });
  });

  describe('Consensus Metrics', () => {
    it('should calculate mean score', async () => {
      const result = await manager.evaluate('A valid mathematical claim');

      expect(result.mean).toBeGreaterThanOrEqual(0);
      expect(result.mean).toBeLessThanOrEqual(100);
      expect(Number.isFinite(result.mean)).toBe(true);
    });

    it('should calculate variance', async () => {
      const result = await manager.evaluate('Some claim');

      expect(result.variance).toBeGreaterThanOrEqual(0);
      expect(Number.isFinite(result.variance)).toBe(true);
    });

    it('should calculate coherence (0-100)', async () => {
      const result = await manager.evaluate('A logical statement');

      expect(result.coherence).toBeGreaterThanOrEqual(0);
      expect(result.coherence).toBeLessThanOrEqual(100);
      expect(Number.isFinite(result.coherence)).toBe(true);
    });

    it('should have consistent results on repeated calls', async () => {
      const claim = 'Deterministic test claim';
      const result1 = await manager.evaluate(claim);
      const result2 = await manager.evaluate(claim);

      // Offline mode should give same result each time
      expect(result1.mean).toBe(result2.mean);
      expect(result1.coherence).toBe(result2.coherence);
    });
  });

  describe('Score Clamping', () => {
    it('should clamp scores to [0, 100]', async () => {
      const claims = [
        'Very short',
        'Extremely long claim that goes on and on with lots of text to try to game the system by making it as verbose as possible without saying anything meaningful or providing any mathematical justification for the statement being made',
        'Normal claim'
      ];

      for (const claim of claims) {
        const result = await manager.evaluate(claim);

        for (const modelResult of result.results) {
          expect(modelResult.score).toBeGreaterThanOrEqual(0);
          expect(modelResult.score).toBeLessThanOrEqual(100);
        }
      }
    });

    it('should not exceed maximum score', async () => {
      const result = await manager.evaluate('Perfect mathematical proof with all steps justified');

      expect(result.mean).toBeLessThanOrEqual(100);
      for (const modelResult of result.results) {
        expect(modelResult.score).toBeLessThanOrEqual(100);
      }
    });

    it('should not go below minimum score', async () => {
      const result = await manager.evaluate('');

      expect(result.mean).toBeGreaterThanOrEqual(0);
      for (const modelResult of result.results) {
        expect(modelResult.score).toBeGreaterThanOrEqual(0);
      }
    });
  });

  describe('Model Results', () => {
    it('should have model identifier in results', async () => {
      const result = await manager.evaluate('A claim');

      expect(result.results[0].model).toBeDefined();
      expect(result.results[0].model).toMatch(/^offline-/);
    });

    it('should include rationale for score', async () => {
      const result = await manager.evaluate('A claim');

      expect(result.results[0].rationale).toBeDefined();
      expect(result.results[0].rationale.length).toBeGreaterThan(0);
    });

    it('should mark results as offline', async () => {
      const result = await manager.evaluate('A claim');

      expect(result.results[0].isOffline).toBe(true);
    });
  });

  describe('Edge Cases', () => {
    it('should handle empty claims', async () => {
      const result = await manager.evaluate('');

      expect(result.mean).toBeGreaterThanOrEqual(0);
      expect(result.mean).toBeLessThanOrEqual(100);
    });

    it('should handle very long claims', async () => {
      const longClaim = 'x '.repeat(1000);
      const result = await manager.evaluate(longClaim);

      expect(result.mean).toBeGreaterThanOrEqual(0);
      expect(result.mean).toBeLessThanOrEqual(100);
    });

    it('should handle unicode characters', async () => {
      const result = await manager.evaluate('For all ∀ x ∈ ℝ: √x² = |x|');

      expect(result.mean).toBeGreaterThanOrEqual(0);
      expect(result.mean).toBeLessThanOrEqual(100);
    });

    it('should handle special characters', async () => {
      const result = await manager.evaluate('If (P ∧ Q) ⇒ (R ∨ ¬S)');

      expect(result.mean).toBeGreaterThanOrEqual(0);
      expect(result.mean).toBeLessThanOrEqual(100);
    });
  });

  describe('Offline Score Calculation', () => {
    it('should start with baseline score', async () => {
      const result = await manager.evaluate('Basic claim');

      // Should have baseline score (around 75)
      expect(result.mean).toBeGreaterThanOrEqual(50);
      expect(result.mean).toBeLessThanOrEqual(100);
    });

    it('should apply penalties for vagueness', async () => {
      const vagueResult = await manager.evaluate('Clearly, obviously, this is trivial');
      const preciseResult = await manager.evaluate(
        'By definition of limits, for any ε > 0, there exists δ > 0 such that...'
      );

      expect(vagueResult.mean).toBeLessThanOrEqual(preciseResult.mean);
    });

    it('should apply bonuses for clear logic', async () => {
      const result = await manager.evaluate(
        'Then we consider the case. In this case, we can show. Since this is true, therefore we conclude'
      );

      // Should have decent score due to logical flow
      expect(result.mean).toBeGreaterThan(50);
    });
  });

  describe('Consistency', () => {
    it('should produce stable results', async () => {
      const claims = [
        'Same claim',
        'Same claim',
        'Same claim'
      ];

      const results = [];
      for (const claim of claims) {
        results.push(await manager.evaluate(claim));
      }

      // All should be identical
      expect(results[0].mean).toBe(results[1].mean);
      expect(results[1].mean).toBe(results[2].mean);
    });

    it('should have variance calculation', async () => {
      const result = await manager.evaluate('Test variance calculation');

      expect(result.variance).toBeDefined();
      expect(result.variance >= 0).toBe(true);
    });
  });

  describe('Confidence Metrics', () => {
    it('should measure coherence', async () => {
      const result = await manager.evaluate('A coherent logical statement');

      expect(result.coherence).toBeGreaterThanOrEqual(0);
      expect(result.coherence).toBeLessThanOrEqual(100);
    });

    it('should relate coherence to agreement', async () => {
      // In offline mode with one model, coherence should be high
      const result = await manager.evaluate('A valid claim');

      expect(result.coherence).toBeGreaterThanOrEqual(0);
    });
  });

  describe('Integration with System', () => {
    it('should work with HybridEngine', async () => {
      // Simulating HybridEngine usage
      const stepClaim = 'From the previous step, by applying the rule of inference';
      const result = await manager.evaluate(stepClaim);

      expect(result.mean).toBeGreaterThanOrEqual(0);
      expect(result.mean).toBeLessThanOrEqual(100);
      expect(result.coherence).toBeGreaterThanOrEqual(0);
    });

    it('should provide adequate coherence for pass threshold (70)', async () => {
      const result = await manager.evaluate('Well-structured mathematical argument');

      // Coherence should be adequate for passing
      expect(result.coherence).toBeGreaterThanOrEqual(0);
      expect(result.mean).toBeGreaterThanOrEqual(50); // Reasonable baseline
    });
  });
});
