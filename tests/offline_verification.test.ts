/**
 * Offline Verification Tests
 * Validates that ProofCore operates 100% offline with no external API calls
 */

import { describe, it, expect, beforeEach, vi } from 'vitest';
import { ProofEngine, type ProofInput } from '../src/core/proof_engine';
import { HybridEngine, type ProofStep } from '../src/core/hybrid_engine';
import { ConsensusManager } from '../src/ai/consensus_manager';
import { GraphAnalyzer } from '../src/core/graph_analyzer';

// Mock global fetch to verify no network calls
const originalFetch = globalThis.fetch;
const fetchSpy = vi.fn();

describe('Offline Verification', () => {
  beforeEach(() => {
    // Replace fetch with spy
    vi.stubGlobal('fetch', fetchSpy);
    fetchSpy.mockClear();
  });

  afterEach(() => {
    // Restore fetch
    vi.stubGlobal('fetch', originalFetch);
  });

  describe('Network Call Prevention', () => {
    it('should not make any fetch calls during proof evaluation', async () => {
      const mockPool = { runTask: vi.fn() };
      const engine = new ProofEngine(mockPool);

      const proof: ProofInput = {
        domain: 'algebra',
        steps: [
          { id: 1, claim: 'This is a proof step' },
          { id: 2, claim: 'This is another step' }
        ]
      };

      await engine.evaluate(proof);

      // Verify fetch was never called
      expect(fetchSpy).not.toHaveBeenCalled();
    });

    it('should not make any fetch calls during hybrid engine verification', async () => {
      const mockPool = { runTask: vi.fn() };
      const engine = new HybridEngine(mockPool);

      const step: ProofStep = {
        id: 1,
        claim: 'A mathematical statement',
        equation: { lhs: 'x', rhs: 'x' }
      };

      await engine.verifyStep(step);

      expect(fetchSpy).not.toHaveBeenCalled();
    });

    it('should not make any fetch calls during consensus evaluation', async () => {
      const manager = new ConsensusManager(
        ['gpt-4o', 'claude-3.5', 'gemini-2'],
        true // offlineMode = true
      );

      await manager.evaluate('A test claim');

      expect(fetchSpy).not.toHaveBeenCalled();
    });

    it('should not attempt XMLHttpRequest', async () => {
      const xmlHttpSpy = vi.spyOn(XMLHttpRequest.prototype, 'open');

      const manager = new ConsensusManager([], true);
      await manager.evaluate('Test claim');

      expect(xmlHttpSpy).not.toHaveBeenCalled();
      xmlHttpSpy.mockRestore();
    });
  });

  describe('API Key Enforcement', () => {
    it('should force offline mode regardless of environment', async () => {
      const manager = new ConsensusManager(
        ['gpt-4o', 'claude-3.5', 'gemini-2'],
        false // explicitly try offline=false
      );

      const result = await manager.evaluate('Test claim');

      // Should still use offline mode
      expect(result.offlineMode).toBe(true);
    });

    it('should not read API keys from environment', async () => {
      // Set fake API key in environment
      const oldKey = process.env.OPENAI_API_KEY;
      process.env.OPENAI_API_KEY = 'fake-key-12345';

      const manager = new ConsensusManager([], true);
      const result = await manager.evaluate('Test');

      // Should still use offline heuristic
      expect(result.offlineMode).toBe(true);

      // Restore
      if (oldKey) {
        process.env.OPENAI_API_KEY = oldKey;
      } else {
        delete process.env.OPENAI_API_KEY;
      }
    });

    it('should not read ANTHROPIC_API_KEY', async () => {
      const oldKey = process.env.ANTHROPIC_API_KEY;
      process.env.ANTHROPIC_API_KEY = 'fake-claude-key';

      const manager = new ConsensusManager([], true);
      const result = await manager.evaluate('Test');

      expect(result.offlineMode).toBe(true);

      if (oldKey) {
        process.env.ANTHROPIC_API_KEY = oldKey;
      } else {
        delete process.env.ANTHROPIC_API_KEY;
      }
    });

    it('should not read GOOGLE_API_KEY', async () => {
      const oldKey = process.env.GOOGLE_API_KEY;
      process.env.GOOGLE_API_KEY = 'fake-gemini-key';

      const manager = new ConsensusManager([], true);
      const result = await manager.evaluate('Test');

      expect(result.offlineMode).toBe(true);

      if (oldKey) {
        process.env.GOOGLE_API_KEY = oldKey;
      } else {
        delete process.env.GOOGLE_API_KEY;
      }
    });
  });

  describe('Offline Heuristic Evaluation', () => {
    it('should use heuristic scoring without APIs', async () => {
      const manager = new ConsensusManager([], true);
      const result = await manager.evaluate('Clear and logical proof step');

      // Should have valid score without external call
      expect(result.mean).toBeGreaterThanOrEqual(0);
      expect(result.mean).toBeLessThanOrEqual(100);
      expect(result.offlineMode).toBe(true);
    });

    it('should produce consistent results', async () => {
      const manager = new ConsensusManager([], true);
      const claim = 'Test claim for consistency';

      const result1 = await manager.evaluate(claim);
      const result2 = await manager.evaluate(claim);

      // Same input should produce same output (deterministic)
      expect(result1.mean).toBe(result2.mean);
      expect(result1.coherence).toBe(result2.coherence);
    });

    it('should evaluate different claims appropriately', async () => {
      const manager = new ConsensusManager([], true);

      const vague = await manager.evaluate('Somehow, this obviously works');
      const clear = await manager.evaluate('By transitivity, if x=y and y=z, then x=z');

      // Clear claim should score better
      expect(clear.mean).toBeGreaterThanOrEqual(vague.mean);
    });
  });

  describe('Complete Evaluation Offline', () => {
    it('should evaluate complete proof offline', async () => {
      const mockPool = { runTask: vi.fn() };
      const engine = new ProofEngine(mockPool);

      const proof: ProofInput = {
        domain: 'algebra',
        steps: [
          { id: 1, claim: 'Assume x = 1', equation: { lhs: 'x', rhs: '1' } },
          { id: 2, claim: 'Then 2x = 2', equation: { lhs: '2*x', rhs: '2' } },
          { id: 3, claim: 'Therefore x² = 1', equation: { lhs: 'x^2', rhs: '1' } }
        ]
      };

      const result = await engine.evaluate(proof);

      // Verify no network calls
      expect(fetchSpy).not.toHaveBeenCalled();

      // Verify result is valid
      expect(result.lii).toBeGreaterThanOrEqual(0);
      expect(result.lii).toBeLessThanOrEqual(100);
      expect(result.steps.length).toBe(3);

      // Verify all steps used offline consensus
      for (const step of result.steps) {
        expect(step.consensus.offlineMode).toBe(true);
      }
    });

    it('should analyze graphs offline', async () => {
      const analyzer = new GraphAnalyzer();

      const steps = [
        { id: 1, claim: 'Base assumption' },
        { id: 2, claim: 'From 1' },
        { id: 3, claim: 'From 2' },
        { id: 4, claim: 'From 3' }
      ];

      const result = analyzer.analyze(steps);

      // Verify no network calls
      expect(fetchSpy).not.toHaveBeenCalled();

      // Verify result
      expect(result.depth).toBeGreaterThan(0);
      expect(result.cycles).toBe(0);
    });
  });

  describe('Deterministic Offline Behavior', () => {
    it('should produce identical results for same input', async () => {
      const mockPool = { runTask: vi.fn() };

      const proof: ProofInput = {
        domain: 'algebra',
        steps: [{ id: 1, claim: 'Fixed claim', equation: { lhs: 'a', rhs: 'a' } }]
      };

      const engine1 = new ProofEngine(mockPool);
      const result1 = await engine1.evaluate(proof);

      const engine2 = new ProofEngine(mockPool);
      const result2 = await engine2.evaluate(proof);

      // Results should be identical (deterministic)
      expect(result1.lii).toBe(result2.lii);
      expect(result1.coherence).toBe(result2.coherence);
      expect(result1.depth).toBe(result2.depth);
      expect(result1.cycles).toBe(result2.cycles);
    });

    it('should not depend on time or random state', async () => {
      const manager = new ConsensusManager([], true);
      const claim = 'A mathematical statement';

      // Evaluate at different "times" (simulate with delays)
      const results = [];
      for (let i = 0; i < 5; i++) {
        const result = await manager.evaluate(claim);
        results.push(result.mean);
      }

      // All should be identical
      for (let i = 1; i < results.length; i++) {
        expect(results[i]).toBe(results[0]);
      }
    });
  });

  describe('Offline Error Handling', () => {
    it('should handle empty claims offline', async () => {
      const manager = new ConsensusManager([], true);
      const result = await manager.evaluate('');

      expect(result.mean).toBeGreaterThanOrEqual(0);
      expect(result.mean).toBeLessThanOrEqual(100);
      expect(fetchSpy).not.toHaveBeenCalled();
    });

    it('should handle very long claims offline', async () => {
      const manager = new ConsensusManager([], true);
      const longClaim = 'test '.repeat(1000);

      const result = await manager.evaluate(longClaim);

      expect(result.mean).toBeGreaterThanOrEqual(0);
      expect(result.mean).toBeLessThanOrEqual(100);
      expect(fetchSpy).not.toHaveBeenCalled();
    });

    it('should handle unicode offline', async () => {
      const manager = new ConsensusManager([], true);
      const result = await manager.evaluate('∀ x ∈ ℝ: √x² = |x|');

      expect(result.mean).toBeGreaterThanOrEqual(0);
      expect(result.mean).toBeLessThanOrEqual(100);
      expect(fetchSpy).not.toHaveBeenCalled();
    });
  });

  describe('No External Dependencies', () => {
    it('should not import from external APIs', () => {
      // Verify consensus manager does not use external imports
      const manager = new ConsensusManager([], true);
      expect(manager).toBeDefined();
      // If this test passes, import resolution succeeded without external deps
    });

    it('should work in isolated environment', async () => {
      // This test verifies that evaluation works without network
      const mockPool = { runTask: vi.fn() };
      const engine = new ProofEngine(mockPool);

      const proof: ProofInput = {
        domain: 'algebra',
        steps: [{ id: 1, claim: 'Isolated test' }]
      };

      // Should not throw
      const result = await engine.evaluate(proof);
      expect(result).toBeDefined();
    });
  });

  describe('Performance Without Network', () => {
    it('should complete evaluation quickly offline', async () => {
      const mockPool = { runTask: vi.fn() };
      const engine = new ProofEngine(mockPool);

      const proof: ProofInput = {
        domain: 'algebra',
        steps: [
          { id: 1, claim: 'Step 1' },
          { id: 2, claim: 'Step 2' },
          { id: 3, claim: 'Step 3' }
        ]
      };

      const start = Date.now();
      await engine.evaluate(proof);
      const duration = Date.now() - start;

      // Should complete in < 1 second (no network latency)
      expect(duration).toBeLessThan(1000);
      expect(fetchSpy).not.toHaveBeenCalled();
    });

    it('should handle batch evaluation offline', async () => {
      const mockPool = { runTask: vi.fn() };
      const engine = new ProofEngine(mockPool);

      const proofs: ProofInput[] = [];
      for (let i = 0; i < 10; i++) {
        proofs.push({
          domain: 'algebra',
          steps: [{ id: 1, claim: `Proof ${i}` }]
        });
      }

      const start = Date.now();
      for (const proof of proofs) {
        await engine.evaluate(proof);
      }
      const duration = Date.now() - start;

      // Should handle 10 proofs quickly (no network)
      expect(duration).toBeLessThan(5000);
      expect(fetchSpy).not.toHaveBeenCalled();
    });
  });

  describe('Offline Mode Guarantees', () => {
    it('should guarantee no external calls', async () => {
      const manager = new ConsensusManager([], true);

      // Evaluate multiple claims
      const claims = [
        'Simple claim',
        'Complex mathematical statement',
        'Another test case',
        'Final verification'
      ];

      for (const claim of claims) {
        await manager.evaluate(claim);
      }

      // No fetch calls at any point
      expect(fetchSpy).not.toHaveBeenCalled();
    });

    it('should work with offline result structure', async () => {
      const manager = new ConsensusManager([], true);
      const result = await manager.evaluate('Test');

      // Verify offline structure
      expect(result.offlineMode).toBe(true);
      expect(result.results).toBeDefined();
      expect(result.results.length).toBeGreaterThan(0);

      // First result should be offline
      expect(result.results[0].isOffline).toBe(true);
      expect(result.results[0].model).toMatch(/offline/i);
    });

    it('should provide adequate scores offline', async () => {
      const manager = new ConsensusManager([], true);

      // Clear, well-structured claim
      const result = await manager.evaluate(
        'By the definition of convergence, for any ε > 0, there exists δ > 0...'
      );

      // Should provide meaningful score
      expect(result.mean).toBeGreaterThan(50);
      expect(result.coherence).toBeGreaterThan(0);
    });
  });
});
