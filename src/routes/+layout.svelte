<script lang="ts">
	import '../app.css';
	import { ScrollArea } from '$lib/components/common';

	let { children } = $props();
</script>

<ScrollArea className="min-h-screen" style="height:100vh;">
	{@render children?.()}
</ScrollArea>
