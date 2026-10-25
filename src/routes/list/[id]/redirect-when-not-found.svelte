<script lang="ts">
	import { goto } from '$app/navigation';
	import { resolve } from '$app/paths';
	import type { Path } from '$app/types';

	let { url }: { url: Path } = $props();

	$effect(() => {
		goto(resolve(url));
	});
</script>
