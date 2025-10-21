<script lang="ts">
	import { Button, Card, Modal } from '$lib/components/common';
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
		const response = await gymsApi.toggleUserStatus(user.id);

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
		const response = await gymsApi.removeUser(selectedUser.id);

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

<Card>
	<h2 class="text-2xl font-bold text-gray-900 mb-4">Usuários Vinculados</h2>

	{#if users.length === 0}
		<div class="text-center py-8 text-gray-500">
			Nenhum usuário vinculado à academia
		</div>
	{:else}
		<div class="overflow-x-auto">
			<table class="w-full">
				<thead>
					<tr class="border-b">
						<th class="text-left py-3 px-4 font-semibold text-gray-700">Nome</th>
						<th class="text-left py-3 px-4 font-semibold text-gray-700">E-mail</th>
						<th class="text-left py-3 px-4 font-semibold text-gray-700">Status</th>
						<th class="text-left py-3 px-4 font-semibold text-gray-700">Data de Vínculo</th>
						<th class="text-right py-3 px-4 font-semibold text-gray-700">Ações</th>
					</tr>
				</thead>
				<tbody>
					{#each users as user (user.id)}
						<tr class="border-b hover:bg-gray-50 transition-colors">
							<td class="py-3 px-4">{user.full_name}</td>
							<td class="py-3 px-4 text-gray-600">{user.email}</td>
							<td class="py-3 px-4">
								<span class="px-2 py-1 rounded-full text-xs font-medium {user.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}">
									{user.status === 'active' ? 'Ativo' : 'Inativo'}
								</span>
							</td>
							<td class="py-3 px-4 text-gray-600">{formatDate(user.linked_at)}</td>
							<td class="py-3 px-4 text-right space-x-2">
								<Button
									size="sm"
									variant={user.status === 'active' ? 'outline' : 'primary'}
									onclick={() => handleToggleStatus(user)}
									disabled={isLoading}
								>
									{user.status === 'active' ? 'Desativar' : 'Ativar'}
								</Button>
								<Button
									size="sm"
									variant="secondary"
									onclick={() => confirmDelete(user)}
									disabled={isLoading}
								>
									Remover
								</Button>
							</td>
						</tr>
					{/each}
				</tbody>
			</table>
		</div>
	{/if}
</Card>

<Modal
	isOpen={showDeleteModal}
	onClose={() => { showDeleteModal = false; selectedUser = null; }}
	title="Confirmar Remoção"
>
	<div class="space-y-4">
		<p>Tem certeza que deseja remover o usuário <strong>{selectedUser?.full_name}</strong>?</p>
		<p class="text-sm text-gray-600">Esta ação não pode ser desfeita.</p>

		<div class="flex space-x-4 justify-end">
			<Button
				variant="outline"
				onclick={() => { showDeleteModal = false; selectedUser = null; }}
			>
				Cancelar
			</Button>
			<Button
				variant="secondary"
				onclick={handleDelete}
				disabled={isLoading}
			>
				{isLoading ? 'Removendo...' : 'Confirmar Remoção'}
			</Button>
		</div>
	</div>
</Modal>
