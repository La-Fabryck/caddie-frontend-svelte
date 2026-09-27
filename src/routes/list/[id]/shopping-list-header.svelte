<script lang="ts">
	import type { List } from '$lib/response/list';

	type ShoppingListHeaderProps = { list: List };

	let { list }: ShoppingListHeaderProps = $props();
</script>

<div class="mx-auto my-5 max-w-2xl lg:mx-0">
	<div class="flex items-center gap-x-3">
		<h2 class="text-4xl font-semibold tracking-tight sm:text-5xl">
			{list.title || 'Ma liste'}
		</h2>
		<span
			class="mt-1 size-2.5 shrink-0 rounded-full {list.isArchived ? 'bg-destructive' : 'bg-green'}"
			role="img"
			aria-label={list.isArchived ? 'Liste archivée' : 'Liste en cours'}
			title={list.isArchived ? 'Archivée' : 'En cours'}
		></span>
	</div>
</div>
