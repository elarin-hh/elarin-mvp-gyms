<script lang="ts">
	import type { Plan } from '$lib/types/plan';

	interface Props {
		plan: Plan;
		selected?: boolean;
		onSelect?: () => void;
	}

	let { plan, selected = false, onSelect }: Props = $props();

	// Parse features from JSON string
	const features = $derived(() => {
		try {
			if (typeof plan.features === 'string') {
				return JSON.parse(plan.features).features || [];
			}
			return plan.features.features || [];
		} catch {
			return [];
		}
	});

	// Format price in Brazilian Real
	const priceFormatted = $derived(() => {
		if (plan.price_cents === 0) return 'Grátis';
		const price = plan.price_cents / 100;
		return new Intl.NumberFormat('pt-BR', {
			style: 'currency',
			currency: 'BRL'
		}).format(price);
	});

	// Feature labels mapping
	const featureLabels: Record<string, string> = {
		basic_exercises: 'Exercícios básicos',
		limited_tracking: 'Rastreamento limitado',
		all_exercises: 'Todos os exercícios',
		advanced_tracking: 'Rastreamento avançado',
		analytics: 'Analytics e relatórios',
		custom_branding: 'Marca personalizada',
		api_access: 'Acesso à API'
	};
</script>

<button
	type="button"
	onclick={onSelect}
	class="plan-card w-full p-6 text-left transition-all"
	class:selected
	style="border-radius: 18px; border-width: 2px;"
>
	<div class="flex justify-between items-start mb-4">
		<div>
			<h3 class="text-xl font-bold text-white mb-1">{plan.name}</h3>
			<p class="text-2xl font-bold" class:text-primary-400={selected} class:text-white={!selected}>
				{priceFormatted()}
			</p>
			{#if plan.price_cents > 0}
				<p class="text-sm text-white/50">/mês</p>
			{/if}
		</div>
		<div class="select-indicator" class:selected>
			{#if selected}
				<svg class="w-6 h-6 text-primary-400" fill="currentColor" viewBox="0 0 20 20">
					<path
						fill-rule="evenodd"
						d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
						clip-rule="evenodd"
					/>
				</svg>
			{/if}
		</div>
	</div>

	<div class="mb-4">
		<p class="text-white/70 text-sm mb-2">
			Até {plan.registrations_limit} usuários
		</p>
	</div>

	<div class="space-y-2">
		{#each features() as feature}
			<div class="flex items-start gap-2">
				<svg class="w-5 h-5 text-primary-400 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
					<path
						fill-rule="evenodd"
						d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
						clip-rule="evenodd"
					/>
				</svg>
				<span class="text-white/80 text-sm">
					{featureLabels[feature] || feature}
				</span>
			</div>
		{/each}
	</div>
</button>

<style>
	.plan-card {
		background: rgba(255, 255, 255, 0.05);
		border: 2px solid rgba(255, 255, 255, 0.1);
		backdrop-filter: blur(10px);
	}

	.plan-card:hover {
		border-color: rgba(255, 255, 255, 0.2);
		background: rgba(255, 255, 255, 0.08);
	}

	.plan-card.selected {
		border-color: rgb(56, 189, 248);
		background: rgba(56, 189, 248, 0.1);
	}

	.select-indicator {
		width: 24px;
		height: 24px;
		border-radius: 50%;
		border: 2px solid rgba(255, 255, 255, 0.3);
		display: flex;
		align-items: center;
		justify-content: center;
	}

	.select-indicator.selected {
		border-color: rgb(56, 189, 248);
		background: rgba(56, 189, 248, 0.2);
	}
</style>
