<script lang="ts">
	import { onMount } from 'svelte';
	import { goto } from '$app/navigation';
	import { currentGym, gymAuthActions } from '$lib/stores/gym-auth.store';
	import { gymsApi } from '$lib/api/gyms.api';
	import StatsCard from '$lib/components/gym/StatsCard.svelte';
	import UsersList from '$lib/components/gym/UsersList.svelte';
	import type { GymUser, GymStats } from '$lib/types/gym';

	const gym = $derived($currentGym);

	let users = $state<GymUser[]>([]);
	let stats = $state<GymStats>({ total_users: 0, active_users: 0, inactive_users: 0 });
	let isLoading = $state(true);

	async function loadData() {
		isLoading = true;

		// Load users
		const usersResponse = await gymsApi.getUsers();
		if (usersResponse.success && usersResponse.data) {
			users = usersResponse.data;
		}

		// Load stats
		const statsResponse = await gymsApi.getStats();
		if (statsResponse.success && statsResponse.data) {
			stats = statsResponse.data;
		}

		isLoading = false;
	}

	async function handleLogout() {
		await gymAuthActions.logout();
		goto('/login');
	}

	onMount(async () => {
		// Check if we just logged in
		const justLoggedIn = sessionStorage.getItem('just_logged_in');
		if (justLoggedIn) {
			sessionStorage.removeItem('just_logged_in');
			// We already have the session from login, just load data
			await loadData();
			return;
		}

		// Check session for page refresh or direct access
		const sessionCheck = await gymAuthActions.checkSession();

		if (!sessionCheck.success) {
			goto('/login');
			return;
		}

		await loadData();
	});
</script>

<div class="min-h-screen bg-black">
	<!-- Header -->
	<header class="glass-card mx-4 mt-4 mb-8">
		<div class="max-w-7xl mx-auto px-6 py-4">
			<div class="flex items-center justify-between">
				<div>
					<h1 class="text-2xl font-bold text-white">Elarin Gym Admin</h1>
					{#if gym}
						<p class="text-sm text-white/70">{gym.name}</p>
					{/if}
				</div>
				<button
					onclick={handleLogout}
					class="glass-button-secondary px-6 py-2 text-white"
				>
					Sair
				</button>
			</div>
		</div>
	</header>

	<!-- Main Content -->
	<main class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-8">
		{#if isLoading}
			<div class="flex items-center justify-center py-12">
				<div class="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-[#8EB428]"></div>
			</div>
		{:else}
			<!-- Stats Cards -->
			<div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
				<StatsCard
					title="Total de Usuários"
					value={stats.total_users}
				>
					{#snippet icon()}
						<svg class="w-10 h-10 text-white/70" fill="none" stroke="currentColor" viewBox="0 0 24 24">
							<path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
						</svg>
					{/snippet}
				</StatsCard>
				<StatsCard
					title="Usuários Ativos"
					value={stats.active_users}
					variant="success"
				>
					{#snippet icon()}
						<svg class="w-10 h-10 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
							<path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
						</svg>
					{/snippet}
				</StatsCard>
				<StatsCard
					title="Usuários Inativos"
					value={stats.inactive_users}
					variant="muted"
				>
					{#snippet icon()}
						<svg class="w-10 h-10 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
							<path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
						</svg>
					{/snippet}
				</StatsCard>
			</div>

			<!-- Users List -->
			<UsersList {users} onUpdate={loadData} />
		{/if}
	</main>
</div>
