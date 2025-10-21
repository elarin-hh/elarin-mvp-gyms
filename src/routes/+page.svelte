<script lang="ts">
	import { onMount } from 'svelte';
	import { goto } from '$app/navigation';
	import { gymAuthActions } from '$lib/stores/gym-auth.store';

	onMount(async () => {
		const sessionCheck = await gymAuthActions.checkSession();

		if (sessionCheck.success) {
			goto('/dashboard');
		} else {
			goto('/login');
		}
	});
</script>

<div class="min-h-screen bg-black flex items-center justify-center">
	<div class="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
</div>
