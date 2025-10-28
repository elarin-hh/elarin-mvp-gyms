import { restClient } from './rest.client';
import type { Plan } from '$lib/types/plan';
import type { ApiResponse } from '$lib/types/api';

/**
 * Plans API - Endpoints for managing plans
 */
export const plansApi = {
	/**
	 * Get all active plans
	 * GET /plans
	 */
	async getAllActivePlans(): Promise<ApiResponse<Plan[]>> {
		return restClient.get<Plan[]>('/plans');
	}
};
