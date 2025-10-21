// REST API client - Connected to Elarin NestJS Backend (Gym Admin)
// Backend runs on port 3001 (NestJS + Fastify)
const API_BASE_URL = 'http://localhost:3001';

import type { ApiResponse } from '$lib/types/api';

class RestClient {
	private baseUrl: string;
	private accessToken: string | null = null;

	constructor(baseUrl: string = API_BASE_URL) {
		this.baseUrl = baseUrl;
		// Load token from localStorage on initialization
		if (typeof window !== 'undefined') {
			this.accessToken = localStorage.getItem('gym_access_token');
		}
	}

	/**
	 * Set the access token for authenticated requests
	 */
	setToken(token: string | null) {
		this.accessToken = token;
		if (typeof window !== 'undefined') {
			if (token) {
				localStorage.setItem('gym_access_token', token);
			} else {
				localStorage.removeItem('gym_access_token');
			}
		}
	}

	/**
	 * Get the current access token
	 * Always check localStorage to ensure we have the latest token
	 */
	getToken(): string | null {
		// Always sync with localStorage
		if (typeof window !== 'undefined') {
			const storedToken = localStorage.getItem('gym_access_token');
			if (storedToken !== this.accessToken) {
				this.accessToken = storedToken;
			}
		}
		return this.accessToken;
	}

	/**
	 * Generic fetch wrapper with error handling
	 */
	private async fetchWithErrorHandling<T>(
		endpoint: string,
		options?: RequestInit
	): Promise<ApiResponse<T>> {
		try {
			// Always sync token from localStorage before making request
			this.getToken();

			const headers: Record<string, string> = {
				'Content-Type': 'application/json'
			};

			// Add authorization header if token is available
			if (this.accessToken) {
				headers['Authorization'] = `Bearer ${this.accessToken}`;
			}

			// Merge with additional headers
			if (options?.headers) {
				Object.assign(headers, options.headers);
			}

			const response = await fetch(`${this.baseUrl}${endpoint}`, {
				...options,
				headers
			});

			const data = await response.json();

			if (!response.ok) {
				// Handle unauthorized errors (401)
				if (response.status === 401) {
					// Clear invalid token
					this.setToken(null);
				}

				// Handle NestJS error format
				return {
					success: false,
					error: {
						message: data.message || data.error || `HTTP error ${response.status}`,
						code: data.statusCode?.toString() || response.status.toString()
					}
				};
			}

			// Wrap successful response in standard format
			return {
				success: true,
				data
			};
		} catch (error) {
			return {
				success: false,
				error: {
					message: error instanceof Error ? error.message : 'Unknown error',
					code: 'NETWORK_ERROR'
				}
			};
		}
	}

	/**
	 * GET request
	 */
	async get<T>(endpoint: string): Promise<ApiResponse<T>> {
		return this.fetchWithErrorHandling<T>(endpoint, { method: 'GET' });
	}

	/**
	 * POST request
	 */
	async post<T>(endpoint: string, body?: unknown): Promise<ApiResponse<T>> {
		return this.fetchWithErrorHandling<T>(endpoint, {
			method: 'POST',
			body: body ? JSON.stringify(body) : undefined
		});
	}

	/**
	 * PATCH request
	 */
	async patch<T>(endpoint: string, body?: unknown): Promise<ApiResponse<T>> {
		return this.fetchWithErrorHandling<T>(endpoint, {
			method: 'PATCH',
			body: body ? JSON.stringify(body) : undefined
		});
	}

	/**
	 * DELETE request
	 */
	async delete<T>(endpoint: string): Promise<ApiResponse<T>> {
		return this.fetchWithErrorHandling<T>(endpoint, { method: 'DELETE' });
	}
}

export const restClient = new RestClient();
