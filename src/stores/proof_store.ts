/**
 * Proof Store - Zustand State Management
 * Manages proof evaluation state, results, and operations
 */

import { create } from 'zustand';
import type { ProofInput, ProofEvaluationResult } from '../core/proof_engine';
import type { HybridStepResult } from '../core/hybrid_engine';

export interface ProofState {
  // State
  proofs: ProofInput[];
  currentProofId: string | null;
  currentProof: ProofInput | null;
  evaluationResults: Record<string, ProofEvaluationResult>;
  isEvaluating: boolean;
  evaluationError: string | null;
  selectedStepId: number | null;

  // Actions
  addProof: (proof: ProofInput) => string; // Returns proof ID
  removeProof: (id: string) => void;
  setCurrentProof: (proof: ProofInput, id: string) => void;
  clearCurrentProof: () => void;

  // Evaluation
  setEvaluating: (loading: boolean) => void;
  setEvaluationResult: (proofId: string, result: ProofEvaluationResult) => void;
  setEvaluationError: (error: string | null) => void;

  // UI State
  selectStep: (stepId: number) => void;
  clearStepSelection: () => void;

  // Utilities
  getProofResult: (proofId: string) => ProofEvaluationResult | undefined;
  getCurrentProofResult: () => ProofEvaluationResult | undefined;
  getAllResults: () => ProofEvaluationResult[];
  clearAll: () => void;
}

export const useProofStore = create<ProofState>((set, get) => ({
  // Initial state
  proofs: [],
  currentProofId: null,
  currentProof: null,
  evaluationResults: {},
  isEvaluating: false,
  evaluationError: null,
  selectedStepId: null,

  // Add proof to store
  addProof: (proof) => {
    const id = `proof_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    set((state) => ({
      proofs: [...state.proofs, proof],
    }));
    return id;
  },

  // Remove proof from store
  removeProof: (id) => {
    set((state) => ({
      proofs: state.proofs.filter((p, i) => i !== parseInt(id.split('_')[1]) % state.proofs.length),
      evaluationResults: {
        ...state.evaluationResults,
        [id]: undefined,
      },
      currentProofId: state.currentProofId === id ? null : state.currentProofId,
      currentProof: state.currentProofId === id ? null : state.currentProof,
    }));
  },

  // Set current proof for editing/evaluation
  setCurrentProof: (proof, id) => {
    set({
      currentProof: proof,
      currentProofId: id,
      selectedStepId: null,
      evaluationError: null,
    });
  },

  // Clear current proof
  clearCurrentProof: () => {
    set({
      currentProof: null,
      currentProofId: null,
      selectedStepId: null,
    });
  },

  // Set evaluation loading state
  setEvaluating: (loading) => {
    set({
      isEvaluating: loading,
      evaluationError: loading ? null : undefined,
    });
  },

  // Store evaluation result
  setEvaluationResult: (proofId, result) => {
    set((state) => ({
      evaluationResults: {
        ...state.evaluationResults,
        [proofId]: result,
      },
      isEvaluating: false,
      evaluationError: null,
    }));
  },

  // Set error state
  setEvaluationError: (error) => {
    set({
      evaluationError: error,
      isEvaluating: false,
    });
  },

  // Select step for detail view
  selectStep: (stepId) => {
    set({
      selectedStepId: stepId,
    });
  },

  // Clear step selection
  clearStepSelection: () => {
    set({
      selectedStepId: null,
    });
  },

  // Get result for specific proof
  getProofResult: (proofId) => {
    return get().evaluationResults[proofId];
  },

  // Get result for current proof
  getCurrentProofResult: () => {
    const currentId = get().currentProofId;
    if (!currentId) return undefined;
    return get().evaluationResults[currentId];
  },

  // Get all results
  getAllResults: () => {
    return Object.values(get().evaluationResults).filter(
      (result): result is ProofEvaluationResult => result !== undefined
    );
  },

  // Clear everything
  clearAll: () => {
    set({
      proofs: [],
      currentProofId: null,
      currentProof: null,
      evaluationResults: {},
      isEvaluating: false,
      evaluationError: null,
      selectedStepId: null,
    });
  },
}));
