<script lang="ts">
	import { goto } from '$app/navigation';
	import { onMount } from 'svelte';
	import { organizationAuthActions, isLoading as loading, authError } from '$lib/stores/organization-auth.store';
	import { plansApi } from '$lib/api/plans.api';
	import PlanCard from '$lib/components/plans/PlanCard.svelte';
	import type { Plan } from '$lib/types/plan';

	let currentStep = $state(1);
	const totalSteps = 2;

	// Step 1: Organization Info
	let name = $state('');
	let federalTaxId = $state('');
	let email = $state('');
	let password = $state('');
	let confirmPassword = $state('');
	let phone = $state('');
	let address = $state('');
	let responsibleName = $state('');

	// Step 2: Plan Selection
	let plans = $state<Plan[]>([]);
	let selectedPlanId = $state<number | null>(null);
	let loadingPlans = $state(false);

	let formError = $state('');

	const isLoading = $derived($loading);
	const error = $derived($authError);

	onMount(async () => {
		await loadPlans();
	});

	async function loadPlans() {
		loadingPlans = true;
		const response = await plansApi.getAllActivePlans();
		if (response.success && response.data) {
			plans = response.data;
			// Pre-select Free plan if available
			const freePlan = plans.find(p => p.price_cents === 0);
			if (freePlan) {
				selectedPlanId = freePlan.id;
			}
		}
		loadingPlans = false;
	}

	function validateStep1(): boolean {
		if (!name || !federalTaxId || !email || !password || !confirmPassword || !phone || !address || !responsibleName) {
			formError = 'Por favor, preencha todos os campos';
			return false;
		}

		if (password !== confirmPassword) {
			formError = 'As senhas não coincidem';
			return false;
		}

		if (password.length < 6) {
			formError = 'A senha deve ter no mínimo 6 caracteres';
			return false;
		}

		return true;
	}

	function nextStep() {
		formError = '';

		if (currentStep === 1) {
			if (!validateStep1()) return;
		}

		if (currentStep < totalSteps) {
			currentStep++;
		}
	}

	function prevStep() {
		formError = '';
		if (currentStep > 1) {
			currentStep--;
		}
	}

	async function handleRegister() {
		formError = '';

		if (!selectedPlanId) {
			formError = 'Por favor, selecione um plano';
			return;
		}

		const result = await organizationAuthActions.register({
			name,
			federal_tax_id: federalTaxId,
			email,
			password,
			phone,
			address,
			responsible_name: responsibleName,
			plan_id: selectedPlanId
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
		<h1 class="text-4xl font-bold text-white mb-2">Cadastrar Organização</h1>
		<p class="text-white/70">
			{#if currentStep === 1}
				Preencha os dados da sua organização
			{:else if currentStep === 2}
				Escolha o plano ideal para sua organização
			{/if}
		</p>
		<div class="mt-4 flex items-center justify-center gap-2">
			{#each Array(totalSteps) as _, i}
				<div
					class="step-indicator"
					class:active={i + 1 === currentStep}
					class:completed={i + 1 < currentStep}
				/>
			{/each}
		</div>
	</div>

	<form class="w-full max-w-4xl space-y-4">
		{#if error || formError}
			<div class="bg-red-500/10 border border-red-500/50 text-red-200 px-4 py-3 text-sm text-center" style="border-radius: 18px;">
				{error || formError}
			</div>
		{/if}

		{#if currentStep === 1}
			<!-- Step 1: Organization Information -->
			<div class="space-y-4">
				<div class="grid grid-cols-1 md:grid-cols-2 gap-4">
					<input
						type="text"
						bind:value={name}
						required
						placeholder="Nome da Organização"
						class="w-full px-6 py-3 bg-transparent border-white/20 text-white placeholder-white/50 focus:outline-none focus:border-white/60 transition-colors"
						style="border-radius: 18px; border-width: 0.8px;"
					/>

					<input
						type="text"
						bind:value={federalTaxId}
						required
						placeholder="CNPJ / Tax ID"
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
					type="button"
					onclick={nextStep}
					class="glass-button-auth w-full px-6 py-3 text-white font-medium transition-all"
				>
					Próximo: Escolher Plano
				</button>
			</div>

		{:else if currentStep === 2}
			<!-- Step 2: Plan Selection -->
			<div class="space-y-4">
				{#if loadingPlans}
					<p class="text-white/70 text-center">Carregando planos...</p>
				{:else}
					<div class="grid grid-cols-1 md:grid-cols-3 gap-4">
						{#each plans as plan}
							<PlanCard
								{plan}
								selected={selectedPlanId === plan.id}
								onSelect={() => selectedPlanId = plan.id}
							/>
						{/each}
					</div>
				{/if}

				<div class="flex gap-4">
					<button
						type="button"
						onclick={prevStep}
						class="glass-button-auth w-full px-6 py-3 text-white font-medium transition-all"
					>
						Voltar
					</button>

					<button
						type="button"
						onclick={handleRegister}
						disabled={isLoading || !selectedPlanId}
						class="glass-button-auth w-full px-6 py-3 text-white font-medium transition-all disabled:opacity-50"
					>
						{isLoading ? 'Cadastrando...' : 'Cadastrar Organização'}
					</button>
				</div>
			</div>
		{/if}
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

<style>
	.step-indicator {
		width: 12px;
		height: 12px;
		border-radius: 50%;
		background: rgba(255, 255, 255, 0.2);
		transition: all 0.3s;
	}

	.step-indicator.active {
		width: 32px;
		border-radius: 6px;
		background: rgb(56, 189, 248);
	}

	.step-indicator.completed {
		background: rgb(56, 189, 248);
	}
</style>
