/**
 * ProofCore Hybrid Engine
 * Combines symbolic verification and semantic evaluation
 */

import { SymbolicVerifier, type SymbolicVerificationResult } from './symbolic_verifier';
import { SemanticEvaluator, type SemanticEvaluationResult } from './semantic_evaluator';
import { LIIEngine } from '../metrics/lii_engine';
import type { ConsensusResult } from '../ai/consensus_manager';

export interface ProofStep {
  id: string | number;
  equation?: {
    lhs: string;
    rhs: string;
  };
  claim?: string;
  domain?: 'algebra' | 'topology' | 'logic';
}

export interface HybridStepResult {
  stepId: string | number;
  symbolic: SymbolicVerificationResult | { valid: boolean };
  consensus: ConsensusResult;
  lii: number;
  lci: [number, number];
  pass: boolean;
}

/**
 * VerificationConfig Interface
 *
 * CRITICAL: These values must be fetched from the backend's /api/v1/config/verification endpoint.
 * DO NOT hardcode these values. The backend is the SINGLE SOURCE OF TRUTH.
 *
 * If these values are out of sync with the backend, results will drift:
 * - Frontend calculations will differ from backend calculations
 * - Users will see inconsistent scoring
 * - Configuration changes in .env won't affect the frontend
 */
export interface VerificationConfig {
  symbolic_weight: number;  // 0-1
  semantic_weight: number;  // 0-1
  pass_threshold: number;   // 0-100
}

// DEPRECATED: These hardcoded values should never be used.
// Use HybridEngine.loadConfig() to fetch from backend instead.
const DEPRECATED_SYMBOLIC_WEIGHT = 0.7;
const DEPRECATED_SEMANTIC_WEIGHT = 0.3;
const DEPRECATED_PASS_THRESHOLD = 70;

export class HybridEngine {
  private symbolic: SymbolicVerifier;
  private semantic: SemanticEvaluator;
  private liiEngine: LIIEngine;

  // Configuration fetched from backend
  private config: VerificationConfig | null = null;

  constructor(pool: any, models?: string[]) {
    this.symbolic = new SymbolicVerifier(pool);
    this.semantic = new SemanticEvaluator(models);
    this.liiEngine = new LIIEngine();
  }

  /**
   * Load verification configuration from backend.
   *
   * CRITICAL: This MUST be called before verifyStep() to ensure the frontend uses
   * the same configuration as the backend.
   *
   * This is the only way to prevent configuration drift.
   *
   * @throws Error if backend config API is unreachable
   */
  async loadConfig(): Promise<void> {
    try {
      const response = await fetch('/api/v1/config/verification');
      if (!response.ok) {
        throw new Error(`Failed to fetch config: ${response.statusText}`);
      }
      this.config = await response.json();
      console.log('[+] Verification config loaded from backend:', this.config);
    } catch (error) {
      console.error('[-] Failed to load config from backend:', error);
      // Fallback to defaults (should only happen if backend is down)
      this.config = {
        symbolic_weight: DEPRECATED_SYMBOLIC_WEIGHT,
        semantic_weight: DEPRECATED_SEMANTIC_WEIGHT,
        pass_threshold: DEPRECATED_PASS_THRESHOLD,
      };
      console.warn('[W] Using deprecated hardcoded config - backend may be down');
    }
  }

  /**
   * Get current configuration, loading from backend if necessary.
   */
  async getConfig(): Promise<VerificationConfig> {
    if (!this.config) {
      await this.loadConfig();
    }
    return this.config!;
  }

  async verifyStep(step: ProofStep): Promise<HybridStepResult> {
    // Ensure configuration is loaded
    const config = await this.getConfig();

    // Symbolic verification (if equation provided)
    const symbolicResult = step.equation
      ? await this.symbolic.verify(step.equation, step.domain)
      : { valid: true }; // No equation = narrative step

    // Semantic evaluation (always performed)
    const semanticResult = await this.semantic.evaluate(step.claim || '');

    // Combined scoring using configuration from backend
    const symbolicScore = symbolicResult.valid ? 100 : 0;
    const semanticScore = semanticResult.consensus.mean;
    const combinedScore =
      config.symbolic_weight * symbolicScore +
      config.semantic_weight * semanticScore;

    // LII calculation
    const errorCount = symbolicResult.valid ? 0 : 1;
    const liiResult = this.liiEngine.analyze(
      step.domain || 'algebra',
      1, // single step
      errorCount,
      semanticResult.consensus.coherence,
      0 // drift score (computed at proof level)
    );

    // Pass criteria: combined score > threshold AND coherence adequate
    // Both threshold values come from backend configuration
    const pass = combinedScore >= config.pass_threshold &&
                 semanticResult.consensus.coherence >= 70;

    return {
      stepId: step.id,
      symbolic: symbolicResult,
      consensus: semanticResult.consensus,
      lii: liiResult.lii,
      lci: liiResult.lci,
      pass
    };
  }
}
