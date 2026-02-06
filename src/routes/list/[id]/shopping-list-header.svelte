<script lang="ts">
	import type { List } from '$lib/response/list';

	type ShoppingListHeaderProps = { list: List };

	let { list }: ShoppingListHeaderProps = $props();
</script>

<div class="mx-auto my-5 max-w-2xl lg:mx-0">
	<h2 class="text-4xl font-semibold tracking-tight sm:text-5xl">
		{list.title || 'Ma liste'}
	</h2>
</div>
