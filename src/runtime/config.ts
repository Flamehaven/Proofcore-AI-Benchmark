/**
 * ProofCore Runtime Configuration
 *
 * This module defines the core runtime modes and defaults for ProofCore.
 * All configuration is read-only and set at compile time for maximum safety.
 */

/**
 * OFFLINE mode: When true, ProofCore operates without external network access
 * - All external API calls are blocked
 * - Uses local heuristic evaluation
 * - Perfect for isolated environments, schools, research labs
 */
export const OFFLINE = true as const;

/**
 * Operating mode: Determines which verification paths are available
 * - 'client': Browser-only verification (no backend needed)
 * - 'hybrid': Browser + optional backend calls (not recommended for v1.0.0)
 * - 'server': Server-only verification (not implemented yet)
 */
export const PB_MODE = 'client' as const;

/**
 * Version identifier
 */
export const VERSION = '1.0.0' as const;

/**
 * Application name
 */
export const APP_NAME = 'ProofCore AI-Benchmark' as const;

/**
 * Description
 */
export const APP_DESCRIPTION = 'Offline-first mathematical proof verification' as const;

/**
 * Performance targets (milliseconds)
 */
export const PERFORMANCE_TARGETS = {
  COLD_BOOT: 3500,      // First load with Pyodide
  WARM_VERIFY: 300,     // Typical verification (p95)
  BATCH_P95: 500,       // 30-proof batch processing (p95)
} as const;

/**
 * Verification configuration
 */
export const VERIFICATION_CONFIG = {
  // Symbolic verification weight
  SYMBOLIC_WEIGHT: 0.7,

  // Semantic verification weight
  SEMANTIC_WEIGHT: 0.3,

  // Minimum confidence score for "VALID" classification
  VALID_THRESHOLD: 0.8,

  // Maximum confidence score for "QUESTIONABLE" classification
  QUESTIONABLE_THRESHOLD: 0.6,

  // Below this is "INVALID"
  INVALID_THRESHOLD: 0.0,
} as const;

/**
 * Feature flags
 */
export const FEATURES = {
  // Enable graph visualization (D3.js)
  GRAPH_VISUALIZATION: true,

  // Enable cycle detection in proofs
  CYCLE_DETECTION: true,

  // Enable performance monitoring
  PERFORMANCE_MONITORING: true,

  // Enable error tracking
  ERROR_TRACKING: false, // Set to true only with explicit user consent

  // Enable analytics (completely offline, no external calls)
  ANALYTICS: false,
} as const;

/**
 * Get current runtime configuration summary
 */
export function getRuntimeConfig() {
  return {
    offline: OFFLINE,
    mode: PB_MODE,
    version: VERSION,
    appName: APP_NAME,
    performanceTargets: PERFORMANCE_TARGETS,
    verificationConfig: VERIFICATION_CONFIG,
    features: FEATURES,
  };
}

/**
 * Assert that we're in offline mode (useful for debug assertions)
 */
export function assertOfflineMode(): asserts OFFLINE {
  if (!OFFLINE) {
    throw new Error('Expected offline mode but found online mode');
  }
}

/**
 * Display configuration in console (for debugging)
 */
export function logRuntimeConfig() {
  console.table({
    'Application': APP_NAME,
    'Version': VERSION,
    'Mode': PB_MODE,
    'Offline': OFFLINE,
    'Cold Boot Target': `${PERFORMANCE_TARGETS.COLD_BOOT}ms`,
    'Warm Verify Target': `${PERFORMANCE_TARGETS.WARM_VERIFY}ms`,
    'Symbolic Weight': `${VERIFICATION_CONFIG.SYMBOLIC_WEIGHT * 100}%`,
    'Semantic Weight': `${VERIFICATION_CONFIG.SEMANTIC_WEIGHT * 100}%`,
  });
}
