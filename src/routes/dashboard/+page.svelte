<script lang="ts">
	import { onMount } from 'svelte';
	import { goto } from '$app/navigation';
	import { currentOrganization, organizationAuthActions } from '$lib/stores/organization-auth.store';
	import { organizationsApi } from '$lib/api/organizations.api';
	import { AppHeader, Loading } from '$lib/components/common';
	import StatsCard from '$lib/components/organization/StatsCard.svelte';
	import UsersList from '$lib/components/organization/UsersList.svelte';
	import PendingUsersList from '$lib/components/organization/PendingUsersList.svelte';
	import type { OrganizationUser, OrganizationStats } from '$lib/types/organization';
	import Users from 'lucide-svelte/icons/users';
	import UserCheck from 'lucide-svelte/icons/user-check';
	import UserX from 'lucide-svelte/icons/user-x';
	import Clock from 'lucide-svelte/icons/clock';

	const organization = $derived($currentOrganization);

	let activeTab = $state<'active' | 'pending'>('active');
	let users = $state<OrganizationUser[]>([]);
	let pendingUsers = $state<OrganizationUser[]>([]);
	let stats = $state<OrganizationStats>({ total_users: 0, active_users: 0, inactive_users: 0, pending_users: 0 });
	let isLoading = $state(true);
	let isScrolled = $state(false);
	let showAvatarMenu = $state(false);

	async function loadData() {
		isLoading = true;

		// Load all users
		const usersResponse = await organizationsApi.getUsers();
		if (usersResponse.success && usersResponse.data) {
			// Filter only ACTIVE and INACTIVE users
			users = usersResponse.data.filter(u => u.status === 'ACTIVE' || u.status === 'INACTIVE');
		}

		// Load pending users
		const pendingResponse = await organizationsApi.getPendingUsers();
		if (pendingResponse.success && pendingResponse.data) {
			pendingUsers = pendingResponse.data;
		}

		// Load stats
		const statsResponse = await organizationsApi.getStats();
		if (statsResponse.success && statsResponse.data) {
			stats = statsResponse.data;
		}

		isLoading = false;
	}

	async function handleLogout() {
		await organizationAuthActions.logout();
		goto('/login');
	}

	function handleToggleAvatarMenu() {
		showAvatarMenu = !showAvatarMenu;
	}

	function handleClickOutside(e: MouseEvent) {
		const target = e.target as HTMLElement;
		if (!target.closest('.avatar-menu-container')) {
			showAvatarMenu = false;
		}
	}

	function handleSettings() {
		// Navigate to settings page when implemented
		console.log('Settings clicked');
		showAvatarMenu = false;
	}

	onMount(async () => {
		// Handle scroll effect for header
		const handleScroll = () => {
			isScrolled = window.scrollY > 10;
		};
		window.addEventListener('scroll', handleScroll);

		// Cleanup
		const cleanup = () => {
			window.removeEventListener('scroll', handleScroll);
		};
		// Check if we just logged in
		const justLoggedIn = sessionStorage.getItem('just_logged_in');
		if (justLoggedIn) {
			sessionStorage.removeItem('just_logged_in');
			// We already have the session from login, just load data
			await loadData();
			return;
		}

		// Check session for page refresh or direct access
		const sessionCheck = await organizationAuthActions.checkSession();

		if (!sessionCheck.success) {
			goto('/login');
			return;
		}

		await loadData();

		return cleanup;
	});
</script>

<div class="min-h-screen bg-black">
	<AppHeader
		bind:isScrolled
		bind:showAvatarMenu
		onToggleAvatarMenu={handleToggleAvatarMenu}
		onSettings={handleSettings}
		onLogout={handleLogout}
		onClickOutside={handleClickOutside}
	/>

	<!-- Main Content -->
	<main class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-8 pt-24">
		{#if organization}
			<div class="mb-8">
				<h2 class="text-3xl font-bold text-white mb-2">{organization.name}</h2>
				<p class="text-white/70">Painel de gerenciamento de usuários</p>
			</div>
		{/if}

		{#if isLoading}
			<Loading message="Carregando dados..." />
		{:else}
			<!-- Stats Cards -->
			<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
				<StatsCard
					title="Total de Usuários"
					value={stats.total_users}
				>
					{#snippet icon()}
						<Users class="w-10 h-10 text-blue-400" stroke-width={1.5} />
					{/snippet}
				</StatsCard>
				<StatsCard
					title="Usuários Ativos"
					value={stats.active_users}
					variant="success"
				>
					{#snippet icon()}
						<UserCheck class="w-10 h-10 text-green-400" stroke-width={1.5} />
					{/snippet}
				</StatsCard>
				<StatsCard
					title="Usuários Inativos"
					value={stats.inactive_users}
					variant="muted"
				>
					{#snippet icon()}
						<UserX class="w-10 h-10 text-gray-400" stroke-width={1.5} />
					{/snippet}
				</StatsCard>
				<StatsCard
					title="Pendentes"
					value={stats.pending_users}
				>
					{#snippet icon()}
						<Clock class="w-10 h-10 text-yellow-400" stroke-width={1.5} />
					{/snippet}
				</StatsCard>
			</div>

			<!-- Tabs -->
			<div class="mb-8">
				<div class="glass-card p-1.5 inline-flex gap-1 rounded-xl">
					<button
						onclick={() => activeTab = 'active'}
						class="px-6 py-3 rounded-lg font-semibold transition-all duration-200 flex items-center gap-2 {
							activeTab === 'active'
								? 'bg-primary-600 text-white shadow-lg shadow-primary-600/30'
								: 'text-white/60 hover:text-white hover:bg-white/5'
						}"
					>
						<Users size={18} />
						Usuários Ativos/Inativos
					</button>
					<button
						onclick={() => activeTab = 'pending'}
						class="px-6 py-3 rounded-lg font-semibold transition-all duration-200 flex items-center gap-2 relative {
							activeTab === 'pending'
								? 'bg-primary-600 text-white shadow-lg shadow-primary-600/30'
								: 'text-white/60 hover:text-white hover:bg-white/5'
						}"
					>
						<Clock size={18} />
						Pendentes de Aprovação
						{#if stats.pending_users > 0}
							<span class="ml-1 px-2 py-0.5 bg-yellow-500 text-black rounded-full text-xs font-bold tabular-nums">
								{stats.pending_users}
							</span>
						{/if}
					</button>
				</div>
			</div>

			<!-- Tab Content -->
			{#if activeTab === 'active'}
				<UsersList {users} onUpdate={loadData} />
			{:else}
				<PendingUsersList users={pendingUsers} onUpdate={loadData} />
			{/if}
		{/if}
	</main>
</div>
