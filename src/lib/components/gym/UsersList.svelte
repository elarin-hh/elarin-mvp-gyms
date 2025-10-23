<script lang="ts">
	import { Modal } from '$lib/components/common';
	import type { GymUser } from '$lib/types/gym';
	import { gymsApi } from '$lib/api/gyms.api';

	interface Props {
		users: GymUser[];
		onUpdate?: () => void;
	}

	let { users, onUpdate }: Props = $props();

	let showDeleteModal = $state(false);
	let selectedUser = $state<GymUser | null>(null);
	let isLoading = $state(false);

	async function handleToggleStatus(user: GymUser) {
		isLoading = true;
		const response = await gymsApi.toggleUserStatus(user.user_id);

		if (response.success && onUpdate) {
			onUpdate();
		}
		isLoading = false;
	}

	function confirmDelete(user: GymUser) {
		selectedUser = user;
		showDeleteModal = true;
	}

	async function handleDelete() {
		if (!selectedUser) return;

		isLoading = true;
		const response = await gymsApi.removeUser(selectedUser.user_id);

		if (response.success && onUpdate) {
			onUpdate();
		}

		showDeleteModal = false;
		selectedUser = null;
		isLoading = false;
	}

	function formatDate(dateString: string) {
		const date = new Date(dateString);
		return date.toLocaleDateString('pt-BR');
	}
</script>

<div class="glass-card p-6">
	<h2 class="text-2xl font-bold text-white mb-6">Usuários Vinculados</h2>

	{#if users.length === 0}
		<div class="text-center py-8 text-white/50">
			Nenhum usuário vinculado à academia
		</div>
	{:else}
		<div class="overflow-x-auto">
			<table class="w-full">
				<thead>
					<tr class="border-b border-white/10">
						<th class="text-left py-3 px-4 font-semibold text-white/70">Nome</th>
						<th class="text-left py-3 px-4 font-semibold text-white/70">E-mail</th>
						<th class="text-left py-3 px-4 font-semibold text-white/70">Status</th>
						<th class="text-left py-3 px-4 font-semibold text-white/70">Data de Vínculo</th>
						<th class="text-right py-3 px-4 font-semibold text-white/70">Ações</th>
					</tr>
				</thead>
				<tbody>
					{#each users as user (user.user_id)}
						<tr class="border-b border-white/5 hover:bg-white/5 transition-colors">
							<td class="py-3 px-4 text-white">{user.full_name}</td>
							<td class="py-3 px-4 text-white/70">{user.email}</td>
							<td class="py-3 px-4">
								<span class="px-3 py-1 rounded-full text-xs font-medium {user.status === 'active' ? 'bg-green-500/20 text-green-300' : 'bg-gray-500/20 text-gray-300'}">
									{user.status === 'active' ? 'Ativo' : 'Inativo'}
								</span>
							</td>
							<td class="py-3 px-4 text-white/70">{formatDate(user.linked_at)}</td>
							<td class="py-3 px-4 text-right space-x-2">
								<button
									class="{user.status === 'active' ? 'glass-button' : 'btn-primary'} px-4 py-1.5 text-sm text-white disabled:opacity-50"
									onclick={() => handleToggleStatus(user)}
									disabled={isLoading}
								>
									{user.status === 'active' ? 'Desativar' : 'Ativar'}
								</button>
								<button
									class="btn-danger px-4 py-1.5 text-sm text-white disabled:opacity-50"
									onclick={() => confirmDelete(user)}
									disabled={isLoading}
								>
									Remover
								</button>
							</td>
						</tr>
					{/each}
				</tbody>
			</table>
		</div>
	{/if}
</div>

<Modal
	isOpen={showDeleteModal}
	onClose={() => { showDeleteModal = false; selectedUser = null; }}
	title="Confirmar Remoção"
>
	<div class="space-y-4">
		<p class="text-white">Tem certeza que deseja remover o usuário <strong>{selectedUser?.full_name}</strong>?</p>
		<p class="text-sm text-white/60">Esta ação não pode ser desfeita.</p>

		<div class="flex space-x-4 justify-end">
			<button
				class="glass-button px-6 py-2 text-white"
				onclick={() => { showDeleteModal = false; selectedUser = null; }}
			>
				Cancelar
			</button>
			<button
				class="btn-danger px-6 py-2 text-white disabled:opacity-50"
				onclick={handleDelete}
				disabled={isLoading}
			>
				{isLoading ? 'Removendo...' : 'Confirmar Remoção'}
			</button>
		</div>
	</div>
</Modal>
