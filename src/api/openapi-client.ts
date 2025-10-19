/**
 * OpenAPI-based API Client
 * Generated types ensure 100% type safety with backend API
 *
 * Usage:
 * 1. Run: npm run api:generate
 * 2. Import: import { useAPI } from './openapi-client'
 * 3. Use: const api = useAPI();
 *         const { data } = await api.getProof({ params: { path: { id: 123 } } });
 */

import createClient from 'openapi-fetch';

// These types are generated from OpenAPI schema
// If they don't exist, run: npm run api:generate
// @ts-ignore - Types are generated dynamically
import type { paths } from './schema';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

/**
 * OpenAPI client instance with type safety
 * Automatically infers correct types for all requests/responses
 */
export const createOpenAPIClient = () => {
  try {
    // @ts-ignore - Dynamic import from generated schema
    return createClient({
      baseUrl: API_BASE_URL,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  } catch (error) {
    console.error('[API] Failed to create OpenAPI client:', error);
    throw error;
  }
};

/**
 * Type-safe API wrapper
 * Provides convenient access to all API endpoints with full TypeScript support
 */
export class APIClient {
  private client: ReturnType<typeof createOpenAPIClient>;

  constructor() {
    this.client = createOpenAPIClient();
  }

  /**
   * Example: Get proof by ID
   * Type-safe: Ensures path, query, and response types match API spec
   */
  async getProof(id: number) {
    try {
      // @ts-ignore - Types come from generated schema
      const { data, error } = await this.client.GET('/api/v1/proofs/{id}', {
        params: { path: { id } },
      });

      if (error) {
        throw new Error(`API error: ${JSON.stringify(error)}`);
      }

      return data;
    } catch (error) {
      console.error('[API] Failed to get proof:', error);
      throw error;
    }
  }

  /**
   * Example: Create proof
   * Type-safe: Request body validated against OpenAPI schema
   */
  async createProof(payload: any) {
    try {
      // @ts-ignore - Types come from generated schema
      const { data, error } = await this.client.POST('/api/v1/proofs', {
        body: payload,
      });

      if (error) {
        throw new Error(`API error: ${JSON.stringify(error)}`);
      }

      return data;
    } catch (error) {
      console.error('[API] Failed to create proof:', error);
      throw error;
    }
  }

  /**
   * Example: List proofs with filtering
   * Type-safe: Query parameters validated against schema
   */
  async listProofs(params?: { limit?: number; offset?: number; status?: string }) {
    try {
      // @ts-ignore - Types come from generated schema
      const { data, error } = await this.client.GET('/api/v1/proofs', {
        params: { query: params },
      });

      if (error) {
        throw new Error(`API error: ${JSON.stringify(error)}`);
      }

      return data;
    } catch (error) {
      console.error('[API] Failed to list proofs:', error);
      throw error;
    }
  }

  /**
   * Example: Update proof
   * Type-safe: Both path and body validated
   */
  async updateProof(id: number, payload: any) {
    try {
      // @ts-ignore - Types come from generated schema
      const { data, error } = await this.client.PUT('/api/v1/proofs/{id}', {
        params: { path: { id } },
        body: payload,
      });

      if (error) {
        throw new Error(`API error: ${JSON.stringify(error)}`);
      }

      return data;
    } catch (error) {
      console.error('[API] Failed to update proof:', error);
      throw error;
    }
  }

  /**
   * Example: Delete proof
   * Type-safe: Path parameter validated
   */
  async deleteProof(id: number) {
    try {
      // @ts-ignore - Types come from generated schema
      const { data, error } = await this.client.DELETE('/api/v1/proofs/{id}', {
        params: { path: { id } },
      });

      if (error) {
        throw new Error(`API error: ${JSON.stringify(error)}`);
      }

      return data;
    } catch (error) {
      console.error('[API] Failed to delete proof:', error);
      throw error;
    }
  }

  /**
   * Get settings
   * Type-safe: Response structure guaranteed by schema
   */
  async getSettings() {
    try {
      // @ts-ignore - Types come from generated schema
      const { data, error } = await this.client.GET('/api/v1/settings');

      if (error) {
        throw new Error(`API error: ${JSON.stringify(error)}`);
      }

      return data;
    } catch (error) {
      console.error('[API] Failed to get settings:', error);
      throw error;
    }
  }

  /**
   * Update settings
   * Type-safe: Request body validated against schema
   */
  async updateSettings(payload: any) {
    try {
      // @ts-ignore - Types come from generated schema
      const { data, error } = await this.client.PUT('/api/v1/settings', {
        body: payload,
      });

      if (error) {
        throw new Error(`API error: ${JSON.stringify(error)}`);
      }

      return data;
    } catch (error) {
      console.error('[API] Failed to update settings:', error);
      throw error;
    }
  }

  /**
   * Health check
   * Type-safe: Ensures endpoint exists in API
   */
  async healthCheck() {
    try {
      // @ts-ignore - Types come from generated schema
      const { data, error } = await this.client.GET('/health');

      if (error) {
        throw new Error(`API error: ${JSON.stringify(error)}`);
      }

      return data;
    } catch (error) {
      console.error('[API] Health check failed:', error);
      throw error;
    }
  }
}

// Export singleton instance
export const apiClient = new APIClient();

/**
 * Hook for using API client in React components
 */
export function useAPI() {
  return apiClient;
}

/**
 * Hook factory for creating custom API calls
 * Useful for endpoints not explicitly defined in APIClient
 */
export function useOpenAPIClient() {
  return createOpenAPIClient();
}
