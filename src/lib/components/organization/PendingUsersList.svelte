<script lang="ts">
	import { organizationsApi } from '$lib/api/organizations.api';
	import type { OrganizationUser } from '$lib/types/organization';
	import Clock from 'lucide-svelte/icons/clock';
	import Check from 'lucide-svelte/icons/check';
	import X from 'lucide-svelte/icons/x';
	import UserPlus from 'lucide-svelte/icons/user-plus';

	interface Props {
		users: OrganizationUser[];
		onUpdate?: () => Promise<void>;
	}

	let { users, onUpdate }: Props = $props();

	let isLoading = $state(false);
	let showApproveModal = $state(false);
	let showRejectModal = $state(false);
	let selectedUser = $state<OrganizationUser | null>(null);

	function confirmApprove(user: OrganizationUser) {
		selectedUser = user;
		showApproveModal = true;
	}

	async function handleApprove() {
		if (!selectedUser) return;

		isLoading = true;
		const response = await organizationsApi.approveUser(selectedUser.user_id);

		if (response.success) {
			showApproveModal = false;
			selectedUser = null;
			await onUpdate?.();
		} else {
			alert(response.error || 'Erro ao aprovar usuário');
		}

		isLoading = false;
	}

	function cancelApprove() {
		showApproveModal = false;
		selectedUser = null;
	}

	function confirmReject(user: OrganizationUser) {
		selectedUser = user;
		showRejectModal = true;
	}

	async function handleReject() {
		if (!selectedUser) return;

		isLoading = true;
		const response = await organizationsApi.rejectUser(selectedUser.user_id);

		if (response.success) {
			showRejectModal = false;
			selectedUser = null;
			await onUpdate?.();
		} else {
			alert(response.error || 'Erro ao rejeitar usuário');
		}

		isLoading = false;
	}

	function cancelReject() {
		showRejectModal = false;
		selectedUser = null;
	}
</script>

<div class="glass-card">
	<div class="px-6 py-5 border-b border-white/10">
		<div class="flex items-center gap-3">
			<Clock class="w-6 h-6 text-yellow-400" stroke-width={2} />
			<div>
				<h2 class="text-xl font-bold text-white">Usuários Pendentes de Aprovação</h2>
				<p class="text-sm text-white/50 mt-0.5">Usuários aguardando aprovação para acessar a organização</p>
			</div>
		</div>
	</div>

	{#if users.length === 0}
		<div class="px-6 py-16 text-center">
			<div class="inline-flex items-center justify-center w-16 h-16 rounded-full bg-white/5 mb-4">
				<Check class="w-8 h-8 text-green-400" stroke-width={2} />
			</div>
			<p class="text-white/70 text-lg font-medium mb-1">Tudo em dia!</p>
			<p class="text-white/50 text-sm">Nenhum usuário pendente de aprovação</p>
		</div>
	{:else}
		<div class="overflow-x-auto">
			<table class="w-full">
				<thead class="bg-white/5">
					<tr>
						<th class="px-6 py-3 text-left text-xs font-medium text-white/70 uppercase tracking-wider">
							Usuário
						</th>
						<th class="px-6 py-3 text-left text-xs font-medium text-white/70 uppercase tracking-wider">
							Email
						</th>
						<th class="px-6 py-3 text-left text-xs font-medium text-white/70 uppercase tracking-wider">
							Data de Solicitação
						</th>
						<th class="px-6 py-3 text-left text-xs font-medium text-white/70 uppercase tracking-wider">
							Ações
						</th>
					</tr>
				</thead>
				<tbody class="divide-y divide-white/10">
					{#each users as user}
						<tr class="hover:bg-white/5 transition-colors">
							<td class="px-6 py-4 whitespace-nowrap">
								<div class="flex items-center">
									{#if user.users.avatar_url}
										<img
											src={user.users.avatar_url}
											alt={user.users.full_name}
											class="h-10 w-10 rounded-full"
										/>
									{:else}
										<div class="h-10 w-10 rounded-full bg-yellow-600 flex items-center justify-center">
											<span class="text-white font-medium">
												{user.users.full_name.charAt(0).toUpperCase()}
											</span>
										</div>
									{/if}
									<div class="ml-4">
										<div class="text-sm font-medium text-white">
											{user.users.full_name}
										</div>
									</div>
								</div>
							</td>
							<td class="px-6 py-4 whitespace-nowrap text-sm text-white/70">
								{user.users.email}
							</td>
							<td class="px-6 py-4 whitespace-nowrap text-sm text-white/70">
								{new Date(user.created_at).toLocaleDateString('pt-BR')}
							</td>
							<td class="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
								<button
									onclick={() => confirmApprove(user)}
									disabled={isLoading}
									class="glass-button-secondary px-3 py-1.5 text-green-400 hover:text-green-300 disabled:opacity-50 inline-flex items-center gap-2"
								>
									<Check size={16} />
									Aprovar
								</button>
								<button
									onclick={() => confirmReject(user)}
									disabled={isLoading}
									class="glass-button-secondary px-3 py-1.5 text-red-400 hover:text-red-300 disabled:opacity-50 inline-flex items-center gap-2"
								>
									<X size={16} />
									Rejeitar
								</button>
							</td>
						</tr>
					{/each}
				</tbody>
			</table>
		</div>
	{/if}
</div>

<!-- Approve Confirmation Modal -->
{#if showApproveModal && selectedUser}
	<div class="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
		<div class="glass-card max-w-md w-full mx-4 p-6">
			<h3 class="text-lg font-bold text-white mb-4">Confirmar Aprovação</h3>
			<p class="text-white/70 mb-6">
				Tem certeza que deseja aprovar o usuário <strong class="text-white">{selectedUser.users.full_name}</strong>?
				<br><br>
				Após a aprovação, o usuário terá acesso à organização.
			</p>
			<div class="flex justify-end space-x-3">
				<button
					onclick={cancelApprove}
					disabled={isLoading}
					class="glass-button-secondary px-4 py-2 text-white disabled:opacity-50"
				>
					Cancelar
				</button>
				<button
					onclick={handleApprove}
					disabled={isLoading}
					class="glass-button-secondary px-4 py-2 text-green-400 hover:text-green-300 disabled:opacity-50"
				>
					{isLoading ? 'Aprovando...' : 'Aprovar'}
				</button>
			</div>
		</div>
	</div>
{/if}

<!-- Reject Confirmation Modal -->
{#if showRejectModal && selectedUser}
	<div class="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
		<div class="glass-card max-w-md w-full mx-4 p-6">
			<h3 class="text-lg font-bold text-white mb-4">Confirmar Rejeição</h3>
			<p class="text-white/70 mb-6">
				Tem certeza que deseja rejeitar o usuário <strong class="text-white">{selectedUser.users.full_name}</strong>?
				<br><br>
				O vínculo será removido permanentemente.
			</p>
			<div class="flex justify-end space-x-3">
				<button
					onclick={cancelReject}
					disabled={isLoading}
					class="glass-button-secondary px-4 py-2 text-white disabled:opacity-50"
				>
					Cancelar
				</button>
				<button
					onclick={handleReject}
					disabled={isLoading}
					class="glass-button-secondary px-4 py-2 text-red-400 hover:text-red-300 disabled:opacity-50"
				>
					{isLoading ? 'Rejeitando...' : 'Rejeitar'}
				</button>
			</div>
		</div>
	</div>
{/if}
