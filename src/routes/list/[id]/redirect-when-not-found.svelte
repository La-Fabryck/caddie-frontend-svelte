<script lang="ts">
	import { goto } from '$app/navigation';
	import { resolve } from '$app/paths';
	import type { Pathname } from '$app/types';

	let { url }: { url: Pathname } = $props();

	$effect(() => {
		goto(resolve(url));
	});
</script>
