/**
 * ProofCore Network Safety Layer
 *
 * This module enforces offline-first behavior by blocking unauthorized network calls.
 * All external network requests must go through this centralized gatekeeper.
 *
 * Design: Explicit-allow, not implicit-block
 * - By default: Network is BLOCKED
 * - To enable: Must set ALLOW_NETWORK=true explicitly
 */

const OFFLINE_MODE = true as const;
const ALLOW_NETWORK_ENV = process.env.ALLOW_NETWORK === 'true';

export interface SafeFetchOptions extends RequestInit {
  allowOffline?: boolean; // Allow this specific call to work offline
}

/**
 * Safe fetch wrapper that enforces offline-first policy
 *
 * @throws Error if network is disabled (default behavior)
 * @returns Promise<Response> if ALLOW_NETWORK is explicitly enabled
 */
export async function safeFetch(
  url: string,
  options: SafeFetchOptions = {}
): Promise<Response> {
  const { allowOffline, ...fetchOptions } = options;

  // [1] Check if network is allowed via environment variable
  if (!ALLOW_NETWORK_ENV) {
    const errorMsg = `
      [OFFLINE-MODE] Network call blocked: ${url}

      ProofCore is designed for offline-first operation.
      If you need network access, set ALLOW_NETWORK=true

      Current mode: OFFLINE (network disabled)
    `;

    console.error(errorMsg);
    throw new Error(
      `Network disabled: ProofCore is offline-only. Attempted fetch: ${url}`
    );
  }

  // [2] If network is allowed, proceed with fetch
  console.debug(`[NETWORK-ALLOWED] Fetching: ${url}`);
  return fetch(url, fetchOptions);
}

/**
 * Check if offline mode is active
 */
export function isOfflineMode(): boolean {
  return OFFLINE_MODE && !ALLOW_NETWORK_ENV;
}

/**
 * Get current network policy
 */
export function getNetworkPolicy() {
  return {
    offlineMode: OFFLINE_MODE,
    networkAllowed: ALLOW_NETWORK_ENV,
    policy: OFFLINE_MODE && !ALLOW_NETWORK_ENV ? 'OFFLINE_ONLY' : 'NETWORK_ALLOWED',
  };
}

// Export a warning message for debugging
export const OFFLINE_WARNING = `
╔════════════════════════════════════════╗
║  ProofCore - Offline-First Mode       ║
║  Network calls are disabled by default ║
║  Set ALLOW_NETWORK=true to enable     ║
╚════════════════════════════════════════╝
`;

if (isOfflineMode()) {
  console.log(OFFLINE_WARNING);
}
