<script lang="ts">
	interface Props {
		title: string;
		value: number;
		variant?: 'default' | 'success' | 'muted';
		icon?: import('svelte').Snippet;
	}

	let { title, value, variant = 'default', icon }: Props = $props();
</script>

<div class="glass-card p-6 hover:bg-white/5 transition-all duration-200 group">
	<div class="flex items-start justify-between">
		<div class="flex-1">
			<p class="text-sm font-medium text-white/60 mb-3">{title}</p>
			<p class="text-4xl font-bold text-white tabular-nums">{value}</p>
		</div>
		{#if icon}
			<div class="ml-4 p-3 rounded-xl bg-white/5 group-hover:bg-white/10 transition-colors">
				{@render icon()}
			</div>
		{/if}
	</div>
</div>
