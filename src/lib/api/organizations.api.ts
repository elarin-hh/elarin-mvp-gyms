import { restClient } from './rest.client';
import type {
	Organization,
	OrganizationSession,
	OrganizationUser,
	OrganizationStats,
	RegisterOrganizationData,
	LoginOrganizationData
} from '$lib/types/organization';
import type { ApiResponse } from '$lib/types/api';

/**
 * Organizations API - Authentication and management endpoints
 * Backend endpoints: /organizations/*
 */
export const organizationsApi = {
	/**
	 * Register a new organization
	 * POST /organizations/auth/register
	 */
	async register(data: RegisterOrganizationData): Promise<ApiResponse<OrganizationSession>> {
		return restClient.post<OrganizationSession>('/organizations/auth/register', data);
	},

	/**
	 * Login organization
	 * POST /organizations/auth/login
	 */
	async login(data: LoginOrganizationData): Promise<ApiResponse<OrganizationSession>> {
		return restClient.post<OrganizationSession>('/organizations/auth/login', data);
	},

	/**
	 * Logout organization
	 * POST /organizations/auth/logout
	 */
	async logout(): Promise<ApiResponse<{ message: string }>> {
		return restClient.post<{ message: string }>('/organizations/auth/logout');
	},

	/**
	 * Get current organization profile
	 * GET /organizations/profile
	 */
	async getProfile(): Promise<ApiResponse<Organization>> {
		return restClient.get<Organization>('/organizations/profile');
	},

	/**
	 * Get users linked to organization
	 * GET /organizations/users
	 */
	async getUsers(): Promise<ApiResponse<OrganizationUser[]>> {
		return restClient.get<OrganizationUser[]>('/organizations/users');
	},

	/**
	 * Toggle user status (active/inactive)
	 * PATCH /organizations/users/:userId/toggle
	 */
	async toggleUserStatus(userId: number): Promise<ApiResponse<OrganizationUser>> {
		return restClient.patch<OrganizationUser>(`/organizations/users/${userId}/toggle`);
	},

	/**
	 * Remove user from organization
	 * DELETE /organizations/users/:userId
	 */
	async removeUser(userId: number): Promise<ApiResponse<{ message: string }>> {
		return restClient.delete<{ message: string }>(`/organizations/users/${userId}`);
	},

	/**
	 * Get organization statistics
	 * GET /organizations/stats
	 */
	async getStats(): Promise<ApiResponse<OrganizationStats>> {
		return restClient.get<OrganizationStats>('/organizations/stats');
	},

	/**
	 * Get pending users waiting for approval
	 * GET /organizations/users/pending
	 */
	async getPendingUsers(): Promise<ApiResponse<OrganizationUser[]>> {
		return restClient.get<OrganizationUser[]>('/organizations/users/pending');
	},

	/**
	 * Approve a pending user
	 * PATCH /organizations/users/:userId/approve
	 */
	async approveUser(userId: number): Promise<ApiResponse<OrganizationUser>> {
		return restClient.patch<OrganizationUser>(`/organizations/users/${userId}/approve`);
	},

	/**
	 * Reject a pending user
	 * DELETE /organizations/users/:userId/reject
	 */
	async rejectUser(userId: number): Promise<ApiResponse<{ message: string }>> {
		return restClient.delete<{ message: string }>(`/organizations/users/${userId}/reject`);
	}
};
