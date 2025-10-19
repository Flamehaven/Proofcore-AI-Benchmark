/**
 * ProofCore Consensus Manager
 * Manages multi-LLM semantic evaluation with coherence scoring
 * Supports offline mode with heuristic fallback
 */

export interface ModelResult {
  model: string;
  score: number;
  rationale?: string;
  isOffline?: boolean;
}

export interface ConsensusResult {
  results: ModelResult[];
  mean: number;
  variance: number;
  coherence: number; // 0-100, higher = more agreement
  offlineMode: boolean; // true if using heuristic fallback
}

const SCORE_MIN = 0;
const SCORE_MAX = 100;
const SCORE_FLOOR = 50; // Minimum score on adapter error
const OFFLINE_SCORE = 75; // Default score for offline mode

export class ConsensusManager {
  private models: string[];
  private apiKeysAvailable: boolean;
  private offlineMode: boolean = false;

  constructor(models: string[] = ['gpt-4o', 'claude-3.5', 'gemini-2'], offlineMode: boolean = true) {
    this.models = models;
    this.offlineMode = offlineMode;
    // Check if any API keys are available in environment
    this.apiKeysAvailable = this._checkApiKeysAvailable();
  }

  private _checkApiKeysAvailable(): boolean {
    // In browser environment, API keys would be in environment variables
    // For offline-first design, return false to use heuristic by default
    return false; // Force offline mode for v1.0.0
  }

  async evaluate(stepClaim: string): Promise<ConsensusResult> {
    const results: ModelResult[] = [];

    // If offline mode or no API keys available, use heuristic
    if (this.offlineMode || !this.apiKeysAvailable) {
      return this._evaluateOffline(stepClaim);
    }

    for (const model of this.models) {
      try {
        const score = await this._queryModel(model, stepClaim);
        const clampedScore = this._clampScore(score);
        results.push({
          model,
          score: clampedScore,
          rationale: `Evaluated by ${model}`,
          isOffline: false
        });
      } catch (error) {
        // Adapter error: yield floor score
        results.push({
          model,
          score: SCORE_FLOOR,
          rationale: `Adapter error: ${error instanceof Error ? error.message : 'Unknown'}`,
          isOffline: false
        });
      }
    }

    return this._computeConsensus(results, false);
  }

  private _evaluateOffline(stepClaim: string): ConsensusResult {
    // Heuristic scoring for offline mode
    const heuristicScore = this._heuristicScore(stepClaim);

    const results: ModelResult[] = [{
      model: 'offline-heuristic',
      score: heuristicScore,
      rationale: 'Offline heuristic evaluation (no API keys)',
      isOffline: true
    }];

    return this._computeConsensus(results, true);
  }

  private _heuristicScore(claim: string): number {
    // Simple heuristic for offline mode
    let score = OFFLINE_SCORE;

    // Penalize vague language
    const vagueWords = ['obviously', 'clearly', 'trivially', 'it is known', 'somehow', 'basically'];
    const vagueCount = vagueWords.filter(word => claim.toLowerCase().includes(word)).length;
    score -= vagueCount * 5;

    // Penalize very short claims (likely incomplete)
    if (claim.length < 10) {
      score -= 10;
    }

    // Bonus for mathematical operators
    const mathOps = ['=', '+', '-', '*', '/', '^', 'sqrt', 'log', 'sin', 'cos'];
    const mathCount = mathOps.filter(op => claim.includes(op)).length;
    score += Math.min(mathCount * 2, 10);

    // Bonus for logical connectors
    const logicalWords = ['therefore', 'thus', 'hence', 'because', 'since', 'implies', 'if', 'then'];
    const logicalCount = logicalWords.filter(word => claim.toLowerCase().includes(word)).length;
    score += Math.min(logicalCount * 2, 10);

    return this._clampScore(score);
  }

  private async _queryModel(model: string, claim: string): Promise<number> {
    // Placeholder for actual LLM API integration
    // Real implementation would call OpenAI, Anthropic, or Google APIs
    // with prompt: "Evaluate this mathematical claim for logical soundness: {claim}"

    // Simulated score with some variance
    const baseScore = 70 + Math.random() * 30;
    return Math.round(baseScore);
  }

  private _clampScore(score: number): number {
    return Math.max(SCORE_MIN, Math.min(SCORE_MAX, Math.round(score)));
  }

  private _computeConsensus(results: ModelResult[], offlineMode: boolean = false): ConsensusResult {
    if (results.length === 0) {
      return {
        results: [],
        mean: 0,
        variance: 0,
        coherence: 0,
        offlineMode
      };
    }

    const scores = results.map(r => r.score);
    const mean = scores.reduce((a, b) => a + b, 0) / scores.length;
    const variance = scores.reduce((sum, score) =>
      sum + Math.pow(score - mean, 2), 0) / scores.length;

    // Coherence: inversely proportional to variance
    // High variance = low coherence
    // In offline mode, always high coherence (single heuristic source)
    const coherence = offlineMode ? 100 : Math.round(Math.max(0, 100 - variance));

    return {
      results,
      mean: Math.round(mean),
      variance: Math.round(variance * 10) / 10,
      coherence,
      offlineMode
    };
  }
}
