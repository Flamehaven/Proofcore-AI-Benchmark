/**
 * Proof Store Tests
 * Validates Zustand proof state management
 */

import { describe, it, expect, beforeEach } from 'vitest';
import { useProofStore } from '../../stores/proof_store';
import type { ProofInput } from '../../core/proof_engine';

describe('Proof Store', () => {
  beforeEach(() => {
    // Reset store state before each test
    useProofStore.getState().clearAll();
  });

  describe('Proof Management', () => {
    it('should add a proof to store', () => {
      const proof: ProofInput = {
        domain: 'algebra',
        steps: [{ id: 1, claim: 'Test step' }],
      };

      const id = useProofStore.getState().addProof(proof);

      const state = useProofStore.getState();
      expect(state.proofs).toHaveLength(1);
      expect(id).toBeDefined();
      expect(id).toMatch(/^proof_/);
    });

    it('should add multiple proofs', () => {
      const proofs: ProofInput[] = [
        { domain: 'algebra', steps: [{ id: 1, claim: 'Step 1' }] },
        { domain: 'geometry', steps: [{ id: 1, claim: 'Step 2' }] },
        { domain: 'logic', steps: [{ id: 1, claim: 'Step 3' }] },
      ];

      proofs.forEach((proof) => useProofStore.getState().addProof(proof));

      expect(useProofStore.getState().proofs).toHaveLength(3);
    });

    it('should set current proof', () => {
      const proof: ProofInput = {
        domain: 'algebra',
        steps: [{ id: 1, claim: 'Current proof' }],
      };

      useProofStore.getState().setCurrentProof(proof, 'proof-1');

      const state = useProofStore.getState();
      expect(state.currentProof).toEqual(proof);
      expect(state.currentProofId).toBe('proof-1');
    });

    it('should clear current proof', () => {
      const proof: ProofInput = {
        domain: 'algebra',
        steps: [{ id: 1, claim: 'Test' }],
      };

      useProofStore.getState().setCurrentProof(proof, 'proof-1');
      useProofStore.getState().clearCurrentProof();

      const state = useProofStore.getState();
      expect(state.currentProof).toBeNull();
      expect(state.currentProofId).toBeNull();
      expect(state.selectedStepId).toBeNull();
    });
  });

  describe('Evaluation State', () => {
    it('should set evaluating state', () => {
      useProofStore.getState().setEvaluating(true);
      expect(useProofStore.getState().isEvaluating).toBe(true);

      useProofStore.getState().setEvaluating(false);
      expect(useProofStore.getState().isEvaluating).toBe(false);
    });

    it('should store evaluation result', () => {
      const result = {
        valid: true,
        lii: 85,
        coherence: 90,
        depth: 2,
        cycles: 0,
        steps: [],
        feedback: [],
      };

      useProofStore.getState().setEvaluationResult('proof-1', result as any);

      expect(useProofStore.getState().evaluationResults['proof-1']).toEqual(result);
      expect(useProofStore.getState().isEvaluating).toBe(false);
      expect(useProofStore.getState().evaluationError).toBeNull();
    });

    it('should set evaluation error', () => {
      const errorMsg = 'Evaluation failed';
      useProofStore.getState().setEvaluationError(errorMsg);

      const state = useProofStore.getState();
      expect(state.evaluationError).toBe(errorMsg);
      expect(state.isEvaluating).toBe(false);
    });

    it('should clear evaluation error on new evaluation', () => {
      useProofStore.getState().setEvaluationError('Previous error');
      useProofStore.getState().setEvaluating(true);

      expect(useProofStore.getState().evaluationError).toBeNull();
    });
  });

  describe('Step Selection', () => {
    it('should select a step', () => {
      useProofStore.getState().selectStep(2);
      expect(useProofStore.getState().selectedStepId).toBe(2);
    });

    it('should clear step selection', () => {
      useProofStore.getState().selectStep(5);
      useProofStore.getState().clearStepSelection();
      expect(useProofStore.getState().selectedStepId).toBeNull();
    });

    it('should clear selection when setting new proof', () => {
      useProofStore.getState().selectStep(3);

      const proof: ProofInput = {
        domain: 'topology',
        steps: [{ id: 1, claim: 'New proof' }],
      };

      useProofStore.getState().setCurrentProof(proof, 'proof-2');
      expect(useProofStore.getState().selectedStepId).toBeNull();
    });
  });

  describe('Query Methods', () => {
    it('should get proof result by ID', () => {
      const result = { valid: true, lii: 75 };
      useProofStore.getState().setEvaluationResult('proof-1', result as any);

      expect(useProofStore.getState().getProofResult('proof-1')).toEqual(result);
      expect(useProofStore.getState().getProofResult('proof-2')).toBeUndefined();
    });

    it('should get current proof result', () => {
      const proof: ProofInput = {
        domain: 'algebra',
        steps: [{ id: 1, claim: 'Test' }],
      };

      useProofStore.getState().setCurrentProof(proof, 'current-proof');

      const result = { valid: true, lii: 80 };
      useProofStore.getState().setEvaluationResult('current-proof', result as any);

      expect(useProofStore.getState().getCurrentProofResult()).toEqual(result);
    });

    it('should return undefined when no current proof', () => {
      expect(useProofStore.getState().getCurrentProofResult()).toBeUndefined();
    });

    it('should get all results', () => {
      const results = [
        { valid: true, lii: 75 },
        { valid: false, lii: 55 },
        { valid: true, lii: 90 },
      ];

      results.forEach((r, i) => {
        useProofStore.getState().setEvaluationResult(`proof-${i}`, r as any);
      });

      const allResults = useProofStore.getState().getAllResults();
      expect(allResults).toHaveLength(3);
    });
  });

  describe('State Management', () => {
    it('should maintain independence of proofs', () => {
      const proof1: ProofInput = {
        domain: 'algebra',
        steps: [{ id: 1, claim: 'Proof 1' }],
      };

      const proof2: ProofInput = {
        domain: 'geometry',
        steps: [{ id: 1, claim: 'Proof 2' }],
      };

      const id1 = useProofStore.getState().addProof(proof1);
      const id2 = useProofStore.getState().addProof(proof2);

      useProofStore.getState().setEvaluationResult(id1, { valid: true, lii: 80 } as any);
      useProofStore.getState().setEvaluationResult(id2, { valid: false, lii: 50 } as any);

      expect(useProofStore.getState().getProofResult(id1)).toEqual({ valid: true, lii: 80 });
      expect(useProofStore.getState().getProofResult(id2)).toEqual({ valid: false, lii: 50 });
    });

    it('should reset all state', () => {
      const proof: ProofInput = {
        domain: 'algebra',
        steps: [{ id: 1, claim: 'Test' }],
      };

      useProofStore.getState().addProof(proof);
      useProofStore.getState().setCurrentProof(proof, 'proof-1');
      useProofStore.getState().selectStep(1);
      useProofStore.getState().setEvaluationError('Error');

      useProofStore.getState().clearAll();

      const state = useProofStore.getState();
      expect(state.proofs).toHaveLength(0);
      expect(state.currentProof).toBeNull();
      expect(state.currentProofId).toBeNull();
      expect(state.selectedStepId).toBeNull();
      expect(state.evaluationError).toBeNull();
      expect(state.evaluationResults).toEqual({});
    });
  });

  describe('Real-world Workflows', () => {
    it('should handle evaluation workflow', () => {
      const proof: ProofInput = {
        domain: 'algebra',
        steps: [
          { id: 1, claim: 'Assume x = 1' },
          { id: 2, claim: 'Then 2x = 2' },
        ],
      };

      // Create proof
      const id = useProofStore.getState().addProof(proof);

      // Set as current
      useProofStore.getState().setCurrentProof(proof, id);

      // Start evaluation
      useProofStore.getState().setEvaluating(true);

      // Complete evaluation
      const result = { valid: true, lii: 85, coherence: 92, depth: 2, cycles: 0, steps: [], feedback: [] };
      useProofStore.getState().setEvaluationResult(id, result as any);

      // Select step for review
      useProofStore.getState().selectStep(1);

      const state = useProofStore.getState();
      expect(state.currentProof).toEqual(proof);
      expect(state.evaluationResults[id]).toEqual(result);
      expect(state.selectedStepId).toBe(1);
      expect(state.isEvaluating).toBe(false);
    });

    it('should handle multiple proof comparison', () => {
      const proofs: ProofInput[] = [
        { domain: 'algebra', steps: [{ id: 1, claim: 'Proof A' }] },
        { domain: 'algebra', steps: [{ id: 1, claim: 'Proof B' }] },
        { domain: 'algebra', steps: [{ id: 1, claim: 'Proof C' }] },
      ];

      const ids = proofs.map((p) => useProofStore.getState().addProof(p));
      const results = [
        { valid: true, lii: 90 },
        { valid: true, lii: 75 },
        { valid: false, lii: 45 },
      ];

      ids.forEach((id, i) => {
        useProofStore.getState().setEvaluationResult(id, results[i] as any);
      });

      const allResults = useProofStore.getState().getAllResults();
      expect(allResults).toHaveLength(3);
      expect(allResults.map((r) => r.lii)).toEqual([90, 75, 45]);
    });
  });
});
