<script lang="ts">
	import { goto } from '$app/navigation';
	import { gymAuthActions, isLoading as loading, authError } from '$lib/stores/gym-auth.store';

	let name = $state('');
	let cnpj = $state('');
	let email = $state('');
	let password = $state('');
	let confirmPassword = $state('');
	let phone = $state('');
	let address = $state('');
	let responsibleName = $state('');
	let formError = $state('');

	const isLoading = $derived($loading);
	const error = $derived($authError);

	async function handleRegister() {
		formError = '';

		if (password !== confirmPassword) {
			formError = 'As senhas não coincidem';
			return;
		}

		if (password.length < 6) {
			formError = 'A senha deve ter no mínimo 6 caracteres';
			return;
		}

		const result = await gymAuthActions.register({
			name,
			cnpj,
			email,
			password,
			phone,
			address,
			responsible_name: responsibleName
		});

		if (result.success) {
			goto('/dashboard');
		}
	}

	function goToLogin() {
		goto('/login');
	}
</script>

<div class="min-h-screen bg-black flex flex-col items-center justify-center px-4 py-8">
	<div class="mb-8 text-center">
		<h1 class="text-4xl font-bold text-white mb-2">Cadastrar Academia</h1>
		<p class="text-white/70">Preencha os dados da sua academia</p>
	</div>

	<form onsubmit={(e) => { e.preventDefault(); handleRegister(); }} class="w-full max-w-2xl space-y-4">
		{#if error || formError}
			<div class="bg-red-500/10 border border-red-500/50 text-red-200 px-4 py-3 text-sm text-center" style="border-radius: 18px;">
				{error || formError}
			</div>
		{/if}

		<div class="grid grid-cols-1 md:grid-cols-2 gap-4">
			<input
				type="text"
				bind:value={name}
				required
				placeholder="Nome da Academia"
				class="w-full px-6 py-3 bg-transparent border-white/20 text-white placeholder-white/50 focus:outline-none focus:border-white/60 transition-colors"
				style="border-radius: 18px; border-width: 0.8px;"
			/>

			<input
				type="text"
				bind:value={cnpj}
				required
				placeholder="CNPJ"
				class="w-full px-6 py-3 bg-transparent border-white/20 text-white placeholder-white/50 focus:outline-none focus:border-white/60 transition-colors"
				style="border-radius: 18px; border-width: 0.8px;"
			/>
		</div>

		<input
			type="text"
			bind:value={responsibleName}
			required
			placeholder="Nome do Responsável"
			class="w-full px-6 py-3 bg-transparent border-white/20 text-white placeholder-white/50 focus:outline-none focus:border-white/60 transition-colors"
			style="border-radius: 18px; border-width: 0.8px;"
		/>

		<input
			type="email"
			bind:value={email}
			required
			placeholder="E-mail"
			class="w-full px-6 py-3 bg-transparent border-white/20 text-white placeholder-white/50 focus:outline-none focus:border-white/60 transition-colors"
			style="border-radius: 18px; border-width: 0.8px;"
		/>

		<div class="grid grid-cols-1 md:grid-cols-2 gap-4">
			<input
				type="password"
				bind:value={password}
				required
				placeholder="Senha"
				class="w-full px-6 py-3 bg-transparent border-white/20 text-white placeholder-white/50 focus:outline-none focus:border-white/60 transition-colors"
				style="border-radius: 18px; border-width: 0.8px;"
			/>

			<input
				type="password"
				bind:value={confirmPassword}
				required
				placeholder="Confirmar Senha"
				class="w-full px-6 py-3 bg-transparent border-white/20 text-white placeholder-white/50 focus:outline-none focus:border-white/60 transition-colors"
				style="border-radius: 18px; border-width: 0.8px;"
			/>
		</div>

		<input
			type="tel"
			bind:value={phone}
			required
			placeholder="Telefone"
			class="w-full px-6 py-3 bg-transparent border-white/20 text-white placeholder-white/50 focus:outline-none focus:border-white/60 transition-colors"
			style="border-radius: 18px; border-width: 0.8px;"
		/>

		<input
			type="text"
			bind:value={address}
			required
			placeholder="Endereço Completo"
			class="w-full px-6 py-3 bg-transparent border-white/20 text-white placeholder-white/50 focus:outline-none focus:border-white/60 transition-colors"
			style="border-radius: 18px; border-width: 0.8px;"
		/>

		<button
			type="submit"
			disabled={isLoading}
			class="glass-button-auth w-full px-6 py-3 text-white font-medium transition-all disabled:opacity-50"
		>
			{isLoading ? 'Cadastrando...' : 'Cadastrar Academia'}
		</button>
	</form>

	<div class="mt-8 text-center">
		<button
			type="button"
			onclick={goToLogin}
			class="text-white/70 hover:text-white text-sm transition-colors"
		>
			Já tem uma conta? Faça login
		</button>
	</div>

	<div class="mt-8 text-center">
		<p class="text-white/50 text-sm">
			Política de Privacidade e Termos de Uso
		</p>
	</div>
</div>
