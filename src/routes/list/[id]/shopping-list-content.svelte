<script lang="ts">
	import { Plus, SquareArrowOutUpRight, Trash2 } from '@lucide/svelte';
	import { resolve } from '$app/paths';
	import type { Item } from '$lib/response/item';
	import { Button, buttonVariants } from '$lib/components/ui';
	import SelectShoppingItem from './select-shopping-item.svelte';
	import DeleteShoppingItem, { type ItemToDeleteTuple } from './delete-shopping-item.svelte';

	export type Action = 'selection' | 'edition' | 'deletion';

	type Props = {
		action: Action;
		listId: string;
		items: Item[];
		invalidateItems: () => void;
		onActionChange: (value: Action) => void;
	};

	let { action, listId, items = [], invalidateItems, onActionChange }: Props = $props();

	let itemsToDelete = $state<ItemToDeleteTuple[]>([]);

	function computeDeletionButtonText(length: number) {
		if (length === 0) return 'Sélectionner des éléments à supprimer';
		if (length === 1) return 'Supprimer 1 article';
		return `Supprimer ${length} articles`;
	}

	async function handleDeleteSelected() {
		await Promise.all(itemsToDelete.map(([, fn]) => fn()));
		invalidateItems();
		onActionChange('selection');
		itemsToDelete = [];
	}
</script>

{#if action === 'selection'}
	<a
		class={buttonVariants({ variant: 'default', size: 'lg', class: 'mb-3 font-semibold' })}
		href={resolve(`/list/${listId}/items/add`)}
	>
		<Plus />
		Ajoute un article
	</a>
	{#if items.length === 0}
		<p>Pas d'articles trouvés</p>
	{:else}
		<div class="relative flex flex-col rounded-xl bg-crust">
			<ul class="flex min-w-60 list-none flex-col gap-1 p-2">
				{#each items as item (item.id)}
					<SelectShoppingItem {item} {invalidateItems} />
				{/each}
			</ul>
		</div>
	{/if}
{:else if action === 'edition'}
	{#if items.length === 0}
		<p>Pas d'articles trouvés</p>
	{:else}
		<div class="relative flex flex-col rounded-xl bg-crust">
			<ul class="flex min-w-60 list-none flex-col gap-1 p-2">
				{#each items as item (item.id)}
					<li
						class="flex w-full list-none items-center rounded-lg p-0 transition-all hover:bg-surface1 focus:bg-slate-100 active:bg-slate-100"
					>
						<a
							class="flex flex-1 cursor-pointer items-center px-3 py-2"
							href={resolve(`/list/${item.listId}/items/${item.id}/edit`)}
						>
							<SquareArrowOutUpRight class="text-pink" />
							<span class="ml-2 text-sm">{item.name}</span>
						</a>
					</li>
				{/each}
			</ul>
		</div>
	{/if}
{:else if action === 'deletion'}
	<Button
		variant="destructive"
		size="lg"
		class="mb-3 font-semibold text-destructive-foreground"
		disabled={itemsToDelete.length === 0}
		onclick={handleDeleteSelected}
	>
		<Trash2 />
		{computeDeletionButtonText(itemsToDelete.length)}
	</Button>
	{#if items.length === 0}
		<p>Pas d'articles trouvés</p>
	{:else}
		<div class="relative flex flex-col rounded-xl bg-crust">
			<ul class="flex min-w-60 list-none flex-col gap-1 p-2">
				{#each items as item (item.id)}
					<DeleteShoppingItem
						{item}
						{itemsToDelete}
						onItemsToDeleteChange={(v) => (itemsToDelete = v)}
					/>
				{/each}
			</ul>
		</div>
	{/if}
{/if}
