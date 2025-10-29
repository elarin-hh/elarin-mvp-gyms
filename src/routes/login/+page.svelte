<script lang="ts">
	import { goto } from '$app/navigation';
	import { organizationAuthActions, isLoading as loading, authError } from '$lib/stores/organization-auth.store';

	let email = $state('');
	let password = $state('');

	const isLoading = $derived($loading);
	const error = $derived($authError);

	async function handleLogin() {
		const result = await organizationAuthActions.login({ email, password });

		if (result.success) {
			// Add a flag to indicate we just logged in successfully
			sessionStorage.setItem('just_logged_in', 'true');
			goto('/dashboard');
		}
	}

	function goToRegister() {
		goto('/register');
	}
</script>

<style>
  .glass-button {
    background: var(--color-glass-light);
    backdrop-filter: blur(30px);
    -webkit-backdrop-filter: blur(30px);
    border-radius: 18px;
    position: relative;
    overflow: hidden;
  }
</style>

<div class="min-h-screen bg-black flex flex-col items-center justify-center px-4">
	<div class="mb-16 text-center">
		<img
			src="/logo-elarin.png"
			alt="Elarin"
			class="h-20 mx-auto mb-4"
		/>
		<p class="text-white/70 text-lg">Painel Administrativo B2B</p>
	</div>

	<form onsubmit={(e) => { e.preventDefault(); handleLogin(); }} class="w-full max-w-md space-y-4">
		{#if error}
			<div class="bg-red-500/10 border border-red-500/50 text-red-200 px-4 py-3 text-sm text-center" style="border-radius: 18px;">
				{error}
			</div>
		{/if}

		<input
			type="email"
			bind:value={email}
			required
			placeholder="E-mail da organização"
			class="w-full px-6 py-3 bg-transparent border-white/20 text-white placeholder-white/50 focus:outline-none focus:border-white/60 transition-colors"
			style="border-radius: 18px; border-width: 0.8px;"
		/>

		<input
			type="password"
			bind:value={password}
			required
			placeholder="Senha"
			class="w-full px-6 py-3 bg-transparent border-white/20 text-white placeholder-white/50 focus:outline-none focus:border-white/60 transition-colors"
			style="border-radius: 18px; border-width: 0.8px;"
		/>

		<button
			type="submit"
			disabled={isLoading}
			class="glass-button-auth w-full px-6 py-3 text-white font-medium transition-all disabled:opacity-50"
		>
			{isLoading ? 'Carregando...' : 'Entrar'}
		</button>
	</form>

	<div class="mt-8 text-center">
		<button
			type="button"
			onclick={goToRegister}
			class="text-white/70 hover:text-white text-sm transition-colors"
		>
			Não tem uma conta? Cadastre sua organização
		</button>
	</div>

	<div class="absolute bottom-8 text-center">
		<p class="text-white/50 text-sm">
			Política de Privacidade e Termos de Uso
		</p>
	</div>
</div>
