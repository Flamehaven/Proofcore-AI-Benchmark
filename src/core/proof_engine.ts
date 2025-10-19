/**
 * ProofCore Proof Engine
 * Orchestrates complete proof evaluation using hybrid reasoning + graph analysis
 * Integrates ProofBench 3.8 graph analysis with ProofCore LII metrics
 */

import { HybridEngine, type ProofStep, type HybridStepResult } from './hybrid_engine';
import { GraphAnalyzer, type GraphResult, type D3GraphData, type ProofStep as GraphProofStep } from './graph_analyzer';
import { LIIEngine } from '../metrics/lii_engine';
import { FeedbackGenerator, type FeedbackMessage } from './feedback_generator';

export interface ProofInput {
  steps: ProofStep[];
  domain?: 'algebra' | 'topology' | 'logic';
  text?: string; // Optional: full proof text for advanced parsing
}

export interface ProofEvaluationResult {
  valid: boolean;
  lii: number;
  lci: [number, number];
  coherence: number;
  depth: number; // Proof derivation depth
  cycles: number; // Circular reasoning count
  bottlenecks: number; // Dependency bottlenecks
  steps: HybridStepResult[];
  feedback: FeedbackMessage[];
  graph?: D3GraphData; // D3.js visualization data
  graphErrors?: Array<{
    step_id: string | number;
    type: string;
    severity: string;
    message: string;
  }>;
}

export class ProofEngine {
  private hybrid: HybridEngine;
  private graph: GraphAnalyzer;
  private liiEngine: LIIEngine;
  private feedbackGen: FeedbackGenerator;

  constructor(pool: any, models?: string[]) {
    this.hybrid = new HybridEngine(pool, models);
    this.graph = new GraphAnalyzer();
    this.liiEngine = new LIIEngine();
    this.feedbackGen = new FeedbackGenerator();
  }

  /**
   * Main entry point for proof evaluation
   */
  async evaluate(proof: ProofInput): Promise<ProofEvaluationResult> {
    const results: HybridStepResult[] = [];
    const feedback: FeedbackMessage[] = [];

    // Convert ProofInput steps to GraphProofStep for analysis
    const graphSteps: GraphProofStep[] = proof.steps.map(step => ({
      id: step.id,
      claim: step.claim,
      equation: step.equation,
      domain: step.domain,
      // Extract dependencies from step references if available
      dependencies: this.extractDependencies(step.claim || '', proof.steps)
    }));

    // Analyze proof structure and detect issues
    const graphResult = this.graph.analyze(graphSteps);

    // Evaluate each step
    for (const step of proof.steps) {
      const result = await this.hybrid.verifyStep(step);
      results.push(result);

      // Generate step-level feedback
      const stepFeedback = this.feedbackGen.generate(
        result.stepId,
        result.symbolic.valid,
        result.consensus.coherence,
        []
      );
      feedback.push(stepFeedback);
    }

    // Compute aggregate metrics
    const validSteps = results.filter(r => r.pass).length;
    const totalSteps = results.length;
    const errorCount = totalSteps - validSteps;

    const aggregateCoherence = totalSteps > 0
      ? results.reduce((sum, r) => sum + r.consensus.coherence, 0) / totalSteps
      : 0;

    const liiResult = this.liiEngine.analyze(
      proof.domain || 'algebra',
      totalSteps,
      errorCount,
      aggregateCoherence,
      0 // drift score
    );

    // Apply graph penalties to LII (circular reasoning is critical)
    let finalLii = liiResult.lii;
    if (graphResult.cycles > 0) {
      finalLii = Math.max(0, finalLii - graphResult.cycles * 15);
    }

    // Generate proof-level feedback
    const proofFeedback = this.feedbackGen.generateProofSummary(
      validSteps,
      totalSteps,
      finalLii
    );
    feedback.push(proofFeedback);

    // Add graph-based feedback
    if (graphResult.cycles > 0) {
      feedback.push({
        stepId: 'graph_analysis',
        type: 'error',
        summary: `Circular reasoning detected: ${graphResult.cycles} cycle(s) found in proof structure`
      });
    }

    if (graphResult.bottlenecks > 0) {
      feedback.push({
        stepId: 'graph_analysis',
        type: 'warning',
        summary: `${graphResult.bottlenecks} bottleneck(s) found: consider breaking dependency chains`
      });
    }

    // Generate D3 visualization data
    const graphData = this.graph.toD3Format();

    return {
      valid: finalLii >= 80 && graphResult.cycles === 0,
      lii: finalLii,
      lci: liiResult.lci,
      coherence: Math.round(aggregateCoherence),
      depth: graphResult.depth,
      cycles: graphResult.cycles,
      bottlenecks: graphResult.bottlenecks,
      steps: results,
      feedback,
      graph: graphData,
      graphErrors: graphResult.errors
    };
  }

  /**
   * Extract step dependencies from natural language references
   */
  private extractDependencies(claim: string, allSteps: ProofStep[]): (string | number)[] {
    const dependencies: (string | number)[] = [];

    // Look for explicit references: "from step 1", "by above", etc.
    const refPatterns = [
      { pattern: /from (?:step )?(\d+)/i, type: 'numbered' },
      { pattern: /by (?:step )?(\d+)/i, type: 'numbered' },
      { pattern: /using (?:step )?(\d+)/i, type: 'numbered' },
      { pattern: /(?:from )?(?:the )?(?:above|previous|preceding)/i, type: 'relative' }
    ];

    for (const { pattern, type } of refPatterns) {
      const match = claim.match(pattern);
      if (match) {
        if (type === 'numbered' && match[1]) {
          // Explicit step number
          const stepNum = parseInt(match[1]);
          if (stepNum < allSteps.length) {
            dependencies.push(allSteps[stepNum].id);
          }
        } else if (type === 'relative') {
          // Reference to immediately previous step
          // This would be handled at engine level
        }
      }
    }

    return dependencies;
  }
}
