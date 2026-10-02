<script lang="ts">
	import Menu from '$lib/components/menu.svelte';
	import type { List } from '$lib/response/list';
	import { Settings } from '@lucide/svelte';

	type ShoppingListHeaderProps = { list: List };

	let { list }: ShoppingListHeaderProps = $props();
</script>

<div class="my-5 w-full">
	<div class="flex w-full items-center gap-x-3">
		<h2 class="min-w-0 flex-1 text-4xl font-semibold tracking-tight sm:text-5xl">
			{list.title || 'Ma liste'}
		</h2>
		<span
			class="mt-1 size-2.5 shrink-0 rounded-full {list.isArchived ? 'bg-destructive' : 'bg-green'}"
			role="img"
			aria-label={list.isArchived ? 'Liste archivée' : 'Liste en cours'}
			title={list.isArchived ? 'Archivée' : 'En cours'}
		></span>
		<Menu
			label="Actions de la liste"
			items={[
				{ label: 'Partager', path: `/list/${list.id}/share` },
				{ label: 'Quitter', path: `/list/${list.id}/leave` },
			]}
		>
			<Settings size={36} />
		</Menu>
	</div>
</div>
