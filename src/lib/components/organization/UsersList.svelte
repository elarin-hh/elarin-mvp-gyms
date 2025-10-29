<script lang="ts">
	import { organizationsApi } from '$lib/api/organizations.api';
	import type { OrganizationUser } from '$lib/types/organization';
	import UserCheck from 'lucide-svelte/icons/user-check';
	import UserX from 'lucide-svelte/icons/user-x';
	import Trash2 from 'lucide-svelte/icons/trash-2';
	import Users from 'lucide-svelte/icons/users';
	import CircleOff from 'lucide-svelte/icons/circle-off';

	interface Props {
		users: OrganizationUser[];
		onUpdate?: () => Promise<void>;
	}

	let { users, onUpdate }: Props = $props();

	let isLoading = $state(false);
	let showDeleteModal = $state(false);
	let showToggleModal = $state(false);
	let userToDelete = $state<OrganizationUser | null>(null);
	let userToToggle = $state<OrganizationUser | null>(null);

	function confirmToggleStatus(user: OrganizationUser) {
		userToToggle = user;
		showToggleModal = true;
	}

	async function handleToggleStatus() {
		if (!userToToggle) return;

		isLoading = true;
		const response = await organizationsApi.toggleUserStatus(userToToggle.user_id);

		if (response.success) {
			showToggleModal = false;
			userToToggle = null;
			await onUpdate?.();
		} else {
			alert(response.error || 'Erro ao alterar status do usuário');
		}

		isLoading = false;
	}

	function cancelToggle() {
		showToggleModal = false;
		userToToggle = null;
	}

	function confirmDelete(user: OrganizationUser) {
		userToDelete = user;
		showDeleteModal = true;
	}

	async function handleDelete() {
		if (!userToDelete) return;

		isLoading = true;
		const response = await organizationsApi.removeUser(userToDelete.user_id);

		if (response.success) {
			showDeleteModal = false;
			userToDelete = null;
			await onUpdate?.();
		} else {
			alert(response.error || 'Erro ao remover usuário');
		}

		isLoading = false;
	}

	function cancelDelete() {
		showDeleteModal = false;
		userToDelete = null;
	}
</script>

<div class="glass-card">
	<div class="px-6 py-5 border-b border-white/10">
		<div class="flex items-center gap-3">
			<Users class="w-6 h-6 text-blue-400" stroke-width={2} />
			<h2 class="text-xl font-bold text-white">Usuários Vinculados</h2>
		</div>
	</div>

	{#if users.length === 0}
		<div class="px-6 py-16 text-center">
			<div class="inline-flex items-center justify-center w-16 h-16 rounded-full bg-white/5 mb-4">
				<Users class="w-8 h-8 text-white/40" stroke-width={1.5} />
			</div>
			<p class="text-white/70 text-lg">Nenhum usuário vinculado à organização</p>
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
							Função
						</th>
						<th class="px-6 py-3 text-left text-xs font-medium text-white/70 uppercase tracking-wider">
							Status
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
										<div class="h-10 w-10 rounded-full bg-primary-600 flex items-center justify-center">
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
								{user.role}
							</td>
							<td class="px-6 py-4 whitespace-nowrap">
								<span
									class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full {
										user.status === 'ACTIVE'
											? 'bg-green-400/10 text-green-400'
											: 'bg-gray-400/10 text-gray-400'
									}"
								>
									{user.status === 'ACTIVE' ? 'Ativo' : 'Inativo'}
								</span>
							</td>
							<td class="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
								<button
									onclick={() => confirmToggleStatus(user)}
									disabled={isLoading}
									class="glass-button-secondary px-3 py-1.5 text-white disabled:opacity-50 inline-flex items-center gap-2"
								>
									{#if user.status === 'ACTIVE'}
										<CircleOff size={16} />
										Desativar
									{:else}
										<UserCheck size={16} />
										Ativar
									{/if}
								</button>
								<button
									onclick={() => confirmDelete(user)}
									disabled={isLoading}
									class="glass-button-secondary px-3 py-1.5 text-red-400 hover:text-red-300 disabled:opacity-50 inline-flex items-center gap-2"
								>
									<Trash2 size={16} />
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

<!-- Toggle Status Confirmation Modal -->
{#if showToggleModal && userToToggle}
	<div class="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
		<div class="glass-card max-w-md w-full mx-4 p-6">
			<h3 class="text-lg font-bold text-white mb-4">
				{userToToggle.status === 'ACTIVE' ? 'Confirmar Desativação' : 'Confirmar Ativação'}
			</h3>
			<p class="text-white/70 mb-6">
				Tem certeza que deseja {userToToggle.status === 'ACTIVE' ? 'desativar' : 'ativar'} o usuário <strong class="text-white">{userToToggle.users.full_name}</strong>?
			</p>
			<div class="flex justify-end space-x-3">
				<button
					onclick={cancelToggle}
					disabled={isLoading}
					class="glass-button-secondary px-4 py-2 text-white disabled:opacity-50"
				>
					Cancelar
				</button>
				<button
					onclick={handleToggleStatus}
					disabled={isLoading}
					class="glass-button-secondary px-4 py-2 text-white disabled:opacity-50"
				>
					{isLoading ? 'Processando...' : userToToggle.status === 'ACTIVE' ? 'Desativar' : 'Ativar'}
				</button>
			</div>
		</div>
	</div>
{/if}

<!-- Delete Confirmation Modal -->
{#if showDeleteModal && userToDelete}
	<div class="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
		<div class="glass-card max-w-md w-full mx-4 p-6">
			<h3 class="text-lg font-bold text-white mb-4">Confirmar Remoção</h3>
			<p class="text-white/70 mb-6">
				Tem certeza que deseja remover o usuário <strong class="text-white">{userToDelete.users.full_name}</strong> da organização?
			</p>
			<div class="flex justify-end space-x-3">
				<button
					onclick={cancelDelete}
					disabled={isLoading}
					class="glass-button-secondary px-4 py-2 text-white disabled:opacity-50"
				>
					Cancelar
				</button>
				<button
					onclick={handleDelete}
					disabled={isLoading}
					class="glass-button-secondary px-4 py-2 text-red-400 hover:text-red-300 disabled:opacity-50"
				>
					{isLoading ? 'Removendo...' : 'Remover'}
				</button>
			</div>
		</div>
	</div>
{/if}
