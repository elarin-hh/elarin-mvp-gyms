import { writable, derived } from 'svelte/store';
import { restClient } from '$lib/api/rest.client';
import { organizationsApi } from '$lib/api/organizations.api';
import type {
	Organization,
	OrganizationSession,
	RegisterOrganizationData,
	LoginOrganizationData
} from '$lib/types/organization';

interface OrganizationAuthState {
	organization: Organization | null;
	session: OrganizationSession | null;
	loading: boolean;
	error: string | null;
}

const initialState: OrganizationAuthState = {
	organization: null,
	session: null,
	loading: false,
	error: null
};

// Create the store
export const organizationAuthStore = writable<OrganizationAuthState>(initialState);

// Derived stores
export const currentOrganization = derived(organizationAuthStore, ($state) => $state.organization);
export const isAuthenticated = derived(organizationAuthStore, ($state) => !!$state.session);
export const isLoading = derived(organizationAuthStore, ($state) => $state.loading);
export const authError = derived(organizationAuthStore, ($state) => $state.error);

// Actions
export const organizationAuthActions = {
	/**
	 * Register a new organization
	 */
	async register(data: RegisterOrganizationData) {
		organizationAuthStore.update((state) => ({ ...state, loading: true, error: null }));

		const response = await organizationsApi.register(data);

		if (response.success && response.data) {
			const { organization, access_token } = response.data;

			// Save token
			if (access_token) {
				restClient.setToken(access_token);
			}

			organizationAuthStore.update(() => ({
				organization,
				session: response.data!,
				loading: false,
				error: null
			}));

			return { success: true };
		} else {
			organizationAuthStore.update((state) => ({
				...state,
				loading: false,
				error: response.error?.message || 'Cadastro falhou'
			}));

			return { success: false, error: response.error?.message };
		}
	},

	/**
	 * Login with email and password
	 */
	async login(data: LoginOrganizationData) {
		organizationAuthStore.update((state) => ({ ...state, loading: true, error: null }));

		const response = await organizationsApi.login(data);

		if (response.success && response.data) {
			const { organization, access_token } = response.data;

			// Save token
			if (access_token) {
				restClient.setToken(access_token);
			}

			organizationAuthStore.update(() => ({
				organization,
				session: response.data!,
				loading: false,
				error: null
			}));

			return { success: true };
		} else {
			organizationAuthStore.update((state) => ({
				...state,
				loading: false,
				error: response.error?.message || 'Login falhou'
			}));

			return { success: false, error: response.error?.message };
		}
	},

	/**
	 * Logout the current organization
	 */
	async logout() {
		organizationAuthStore.update((state) => ({ ...state, loading: true }));

		await organizationsApi.logout();

		// Clear token and state
		restClient.setToken(null);
		organizationAuthStore.set(initialState);

		return { success: true };
	},

	/**
	 * Check if organization has a valid session (on app load)
	 */
	async checkSession() {
		const token = restClient.getToken();

		if (!token) {
			organizationAuthStore.set(initialState);
			return { success: false };
		}

		organizationAuthStore.update((state) => ({ ...state, loading: true }));

		// Fetch organization profile to validate token
		const response = await organizationsApi.getProfile();

		if (response.success && response.data) {
			organizationAuthStore.update(() => ({
				organization: response.data!,
				session: { access_token: token, organization: response.data! },
				loading: false,
				error: null
			}));

			return { success: true };
		} else {
			// Invalid token, clear everything
			restClient.setToken(null);
			organizationAuthStore.set(initialState);
			return { success: false };
		}
	},

	/**
	 * Clear error message
	 */
	clearError() {
		organizationAuthStore.update((state) => ({ ...state, error: null }));
	}
};
