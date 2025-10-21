<script lang="ts">
	import { Card } from '$lib/components/common';

	interface Props {
		title: string;
		value: number | string;
		icon?: string;
		class?: string;
	}

	let { title, value, icon, class: className = '' }: Props = $props();
</script>

<Card class="text-center {className}">
	<div class="flex flex-col items-center space-y-2">
		{#if icon}
			<div class="text-4xl">{icon}</div>
		{/if}
		<h3 class="text-gray-600 text-sm font-medium">{title}</h3>
		<p class="text-3xl font-bold text-primary-600">{value}</p>
	</div>
</Card>
