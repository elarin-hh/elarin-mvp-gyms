import { restClient } from './rest.client';
import type { Gym, GymSession, GymUser, GymStats, RegisterGymData, LoginGymData } from '$lib/types/gym';
import type { ApiResponse } from '$lib/types/api';

/**
 * Gyms API - Authentication and management endpoints
 */
export const gymsApi = {
	/**
	 * Register a new gym
	 */
	async register(data: RegisterGymData): Promise<ApiResponse<GymSession>> {
		return restClient.post<GymSession>('/gyms/auth/register', data);
	},

	/**
	 * Login gym
	 */
	async login(data: LoginGymData): Promise<ApiResponse<GymSession>> {
		return restClient.post<GymSession>('/gyms/auth/login', data);
	},

	/**
	 * Logout gym
	 */
	async logout(): Promise<ApiResponse<void>> {
		return restClient.post<void>('/gyms/auth/logout');
	},

	/**
	 * Get current gym profile
	 */
	async getProfile(): Promise<ApiResponse<Gym>> {
		return restClient.get<Gym>('/gyms/profile');
	},

	/**
	 * Get users linked to gym
	 */
	async getUsers(): Promise<ApiResponse<GymUser[]>> {
		return restClient.get<GymUser[]>('/gyms/users');
	},

	/**
	 * Toggle user status (active/inactive)
	 */
	async toggleUserStatus(userId: string): Promise<ApiResponse<GymUser>> {
		return restClient.patch<GymUser>(`/gyms/users/${userId}/toggle`);
	},

	/**
	 * Remove user from gym
	 */
	async removeUser(userId: string): Promise<ApiResponse<void>> {
		return restClient.delete<void>(`/gyms/users/${userId}`);
	},

	/**
	 * Get gym statistics
	 */
	async getStats(): Promise<ApiResponse<GymStats>> {
		return restClient.get<GymStats>('/gyms/stats');
	}
};
