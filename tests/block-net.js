/**
 * Network Blocking Helper for Offline Testing
 *
 * This file should be required at the beginning of test setup to ensure
 * that no accidental network calls slip through during CI/offline tests.
 *
 * Usage in package.json:
 *   "test:offline": "node -r ./tests/block-net.js --test src/**/*.test.ts"
 *
 * Or in test setup file:
 *   require('./tests/block-net.js');
 */

const originalFetch = globalThis.fetch;
const originalXHR = globalThis.XMLHttpRequest;
const originalWS = globalThis.WebSocket;

/**
 * Block all network calls with clear error messages
 */
const networkBlocker = () => {
  throw new Error(
    '[OFFLINE-TEST] Network call blocked. ProofCore is running in offline-only mode for testing.'
  );
};

// Block fetch() calls
if (typeof globalThis !== 'undefined') {
  globalThis.fetch = networkBlocker;

  // Block XMLHttpRequest
  globalThis.XMLHttpRequest = function () {
    throw new Error('[OFFLINE-TEST] XMLHttpRequest blocked in offline mode.');
  };

  // Block WebSocket
  globalThis.WebSocket = function () {
    throw new Error('[OFFLINE-TEST] WebSocket blocked in offline mode.');
  };

  // Block Node.js http/https (if running in Node.js)
  try {
    const http = require('http');
    const https = require('https');

    const httpBlocker = () => {
      throw new Error('[OFFLINE-TEST] HTTP request blocked in offline mode.');
    };

    http.request = httpBlocker;
    https.request = httpBlocker;
  } catch (e) {
    // Running in browser, not Node.js
  }
}

/**
 * Helper: Temporarily allow network (for specific tests)
 */
globalThis.allowNetworkTemporarily = function (callback) {
  const tempFetch = globalThis.fetch;
  globalThis.fetch = originalFetch;

  try {
    return callback();
  } finally {
    globalThis.fetch = tempFetch;
  }
};

/**
 * Helper: Check if network is blocked
 */
globalThis.isNetworkBlocked = function () {
  return globalThis.fetch === networkBlocker;
};

console.log('[OFFLINE-TEST] Network blocking enabled. All external calls will be rejected.');
console.log('[OFFLINE-TEST] To allow network temporarily, use: globalThis.allowNetworkTemporarily(() => {...})');
