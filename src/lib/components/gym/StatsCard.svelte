<script lang="ts">
	import type { Snippet } from 'svelte';

	interface Props {
		title: string;
		value: number | string;
		icon?: Snippet;
		variant?: 'default' | 'success' | 'muted';
	}

	let { title, value, icon, variant = 'default' }: Props = $props();

	const variantClasses = {
		default: 'border-l-4 border-white/30',
		success: 'border-l-4 border-green-500',
		muted: 'border-l-4 border-gray-500'
	};
</script>

<style>
	.glass-card {
		background: rgba(18, 18, 18, 0.55);
		backdrop-filter: blur(10px);
		-webkit-backdrop-filter: blur(10px);
		border: 1px solid rgba(255, 255, 255, 0.1);
		border-radius: 12px;
	}
</style>

<div class="glass-card p-6 text-center {variantClasses[variant]}">
	<div class="flex flex-col items-center space-y-2">
		{#if icon}
			<div class="w-12 h-12 flex items-center justify-center">
				{@render icon()}
			</div>
		{/if}
		<h3 class="text-white/70 text-sm font-medium">{title}</h3>
		<p class="text-3xl font-bold" style="color: #8EB428;">{value}</p>
	</div>
</div>
