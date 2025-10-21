import { writable, derived } from 'svelte/store';
import { restClient } from '$lib/api/rest.client';
import { gymsApi } from '$lib/api/gyms.api';
import type { Gym, GymSession, RegisterGymData, LoginGymData } from '$lib/types/gym';

interface GymAuthState {
	gym: Gym | null;
	session: GymSession | null;
	loading: boolean;
	error: string | null;
}

const initialState: GymAuthState = {
	gym: null,
	session: null,
	loading: false,
	error: null
};

// Create the store
export const gymAuthStore = writable<GymAuthState>(initialState);

// Derived stores
export const currentGym = derived(gymAuthStore, ($state) => $state.gym);
export const isAuthenticated = derived(gymAuthStore, ($state) => !!$state.session);
export const isLoading = derived(gymAuthStore, ($state) => $state.loading);
export const authError = derived(gymAuthStore, ($state) => $state.error);

// Actions
export const gymAuthActions = {
	/**
	 * Register a new gym
	 */
	async register(data: RegisterGymData) {
		gymAuthStore.update((state) => ({ ...state, loading: true, error: null }));

		const response = await gymsApi.register(data);

		if (response.success && response.data) {
			const { gym, access_token } = response.data;

			// Save token
			if (access_token) {
				restClient.setToken(access_token);
			}

			gymAuthStore.update(() => ({
				gym,
				session: response.data!,
				loading: false,
				error: null
			}));

			return { success: true };
		} else {
			gymAuthStore.update((state) => ({
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
	async login(data: LoginGymData) {
		gymAuthStore.update((state) => ({ ...state, loading: true, error: null }));

		const response = await gymsApi.login(data);

		if (response.success && response.data) {
			const { gym, access_token } = response.data;

			// Save token
			if (access_token) {
				restClient.setToken(access_token);
			}

			gymAuthStore.update(() => ({
				gym,
				session: response.data!,
				loading: false,
				error: null
			}));

			return { success: true };
		} else {
			gymAuthStore.update((state) => ({
				...state,
				loading: false,
				error: response.error?.message || 'Login falhou'
			}));

			return { success: false, error: response.error?.message };
		}
	},

	/**
	 * Logout the current gym
	 */
	async logout() {
		gymAuthStore.update((state) => ({ ...state, loading: true }));

		await gymsApi.logout();

		// Clear token and state
		restClient.setToken(null);
		gymAuthStore.set(initialState);

		return { success: true };
	},

	/**
	 * Check if gym has a valid session (on app load)
	 */
	async checkSession() {
		const token = restClient.getToken();

		if (!token) {
			gymAuthStore.set(initialState);
			return { success: false };
		}

		gymAuthStore.update((state) => ({ ...state, loading: true }));

		// Fetch gym profile to validate token
		const response = await gymsApi.getProfile();

		if (response.success && response.data) {
			gymAuthStore.update(() => ({
				gym: response.data!,
				session: { access_token: token, gym: response.data! },
				loading: false,
				error: null
			}));

			return { success: true };
		} else {
			// Invalid token, clear everything
			restClient.setToken(null);
			gymAuthStore.set(initialState);
			return { success: false };
		}
	},

	/**
	 * Clear error message
	 */
	clearError() {
		gymAuthStore.update((state) => ({ ...state, error: null }));
	}
};
