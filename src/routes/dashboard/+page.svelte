<script lang="ts">
	import { onMount } from 'svelte';
	import { goto } from '$app/navigation';
	import { currentGym, gymAuthActions, isAuthenticated } from '$lib/stores/gym-auth.store';
	import { gymsApi } from '$lib/api/gyms.api';
	import { Button } from '$lib/components/common';
	import StatsCard from '$lib/components/gym/StatsCard.svelte';
	import UsersList from '$lib/components/gym/UsersList.svelte';
	import type { GymUser, GymStats } from '$lib/types/gym';

	const gym = $derived($currentGym);
	const isAuth = $derived($isAuthenticated);

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
		// Check session
		const sessionCheck = await gymAuthActions.checkSession();

		if (!sessionCheck.success) {
			goto('/login');
			return;
		}

		await loadData();
	});
</script>

<div class="min-h-screen bg-gray-100">
	<!-- Header -->
	<header class="bg-white shadow-sm">
		<div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
			<div class="flex items-center justify-between">
				<div>
					<h1 class="text-2xl font-bold text-gray-900">Elarin Gym Admin</h1>
					{#if gym}
						<p class="text-sm text-gray-600">{gym.name}</p>
					{/if}
				</div>
				<Button variant="outline" onclick={handleLogout}>
					Sair
				</Button>
			</div>
		</div>
	</header>

	<!-- Main Content -->
	<main class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
		{#if isLoading}
			<div class="flex items-center justify-center py-12">
				<div class="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
			</div>
		{:else}
			<!-- Stats Cards -->
			<div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
				<StatsCard
					title="Total de Usuários"
					value={stats.total_users}
					icon="👥"
				/>
				<StatsCard
					title="Usuários Ativos"
					value={stats.active_users}
					icon="✅"
					class="border-l-4 border-green-500"
				/>
				<StatsCard
					title="Usuários Inativos"
					value={stats.inactive_users}
					icon="⏸️"
					class="border-l-4 border-gray-400"
				/>
			</div>

			<!-- Users List -->
			<UsersList {users} onUpdate={loadData} />
		{/if}
	</main>
</div>
