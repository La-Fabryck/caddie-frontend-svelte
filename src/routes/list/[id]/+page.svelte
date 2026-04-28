<script lang="ts">
	import { invalidateAll } from '$app/navigation';
	import { Button } from '$lib/components/ui';
	import { cn } from '$lib/utils';
	import type { Item } from '$lib/response/item';
	import ShoppingListContent from './shopping-list-content.svelte';
	import ShoppingListHeader from './shopping-list-header.svelte';
	import ToggleActionGroup, { type Action } from './toggle-action-group.svelte';
	import RedirectWhenEmpty from './redirect-when-empty.svelte';
	import RedirectWhenNotFound from './redirect-when-not-found.svelte';
	import { Spinner } from '$lib/components/ui';
	import type { PageProps } from './$types';

	let { data }: PageProps = $props();

	let action = $state<Action>('selection');
	type SortMode = 'default' | 'type';
	type ItemSection = { label: string; items: Item[] };
	let sortMode = $state<SortMode>('default');

	function normalize(value: string | null | undefined): string {
		return value?.toLocaleLowerCase().trim() ?? '';
	}

	function compareByType(a: Item, b: Item): number {
		const aType = a.itemType?.label ?? null;
		const bType = b.itemType?.label ?? null;

		if (aType == null && bType != null) return 1;
		if (aType != null && bType == null) return -1;

		const typeComparison = normalize(aType).localeCompare(normalize(bType));
		return typeComparison;
	}

	function buildTypeSections(items: Item[]): ItemSection[] {
		const sortedItems = items.toSorted((a, b) => compareByType(a, b));
		const groupedByLabel = Object.groupBy(sortedItems, (item) => item.itemType?.label ?? 'Autre');

		return Object.entries(groupedByLabel).map(([label, sectionItems]) => ({
			label,
			items: sectionItems ?? []
		}));
	}
</script>

{#await Promise.all([data.list, data.items])}
	<Spinner class="size-20" />
{:then [listResult, itemsResult]}
	{#if listResult.data == null}
		<RedirectWhenNotFound url="/" />
	{:else}
		{@const items = itemsResult.data ?? []}
		{@const sortedItems =
			sortMode === 'default' ? items : items.toSorted((a, b) => compareByType(a, b))}
		{@const itemSections = sortMode === 'type' ? buildTypeSections(items) : []}
		<RedirectWhenEmpty listId={listResult.data.id} items={itemsResult.data} />
		<ToggleActionGroup {action} onActionChange={(newAction) => (action = newAction)} />
		<div
			class="my-3 flex w-full items-center rounded-md border shadow-xs"
			role="group"
			aria-label="Sort mode"
		>
			<Button
				variant="outline"
				size="sm"
				class={cn(
					'min-h-11 min-w-0 flex-1 rounded-none rounded-l-md border-l',
					sortMode === 'default' && 'bg-accent text-accent-foreground'
				)}
				aria-pressed={sortMode === 'default'}
				onclick={() => (sortMode = 'default')}
			>
				Default
			</Button>
			<Button
				variant="outline"
				size="sm"
				class={cn(
					'min-h-11 min-w-0 flex-1 rounded-none rounded-r-md border-l-0',
					sortMode === 'type' && 'bg-accent text-accent-foreground'
				)}
				aria-pressed={sortMode === 'type'}
				onclick={() => (sortMode = 'type')}
			>
				Type
			</Button>
		</div>
		<ShoppingListHeader list={listResult.data} />
		<ShoppingListContent
			{action}
			listId={listResult.data.id}
			items={sortedItems}
			{sortMode}
			sections={itemSections}
			invalidateItems={() => {
				void invalidateAll();
			}}
			onActionChange={(v) => (action = v)}
		/>
	{/if}
{/await}
