<script lang="ts">
	import { invalidateAll } from '$app/navigation';
	import ShoppingListContent from './shopping-list-content.svelte';
	import ShoppingListHeader from './shopping-list-header.svelte';
	import ToggleActionGroup, { type Action } from './toggle-action-group.svelte';
	import RedirectWhenEmpty from './redirect-when-empty.svelte';
	import RedirectWhenNotFound from './redirect-when-not-found.svelte';
	import { Spinner } from '$lib/components/ui';
	import type { PageProps } from './$types';

	let { data }: PageProps = $props();

	let action = $state<Action>('selection');
</script>

{#await Promise.all([data.list, data.items])}
	<Spinner class="size-20" />
{:then [listResult, itemsResult]}
	{#if listResult.data == null}
		<RedirectWhenNotFound url="/" />
	{:else}
		<RedirectWhenEmpty listId={listResult.data.id} items={itemsResult.data} />
		<ToggleActionGroup {action} onActionChange={(newAction) => (action = newAction)} />
		<ShoppingListHeader list={listResult.data} />
		<ShoppingListContent
			{action}
			listId={listResult.data.id}
			items={itemsResult.data ?? []}
			invalidateItems={() => {
				void invalidateAll();
			}}
			onActionChange={(v) => (action = v)}
		/>
	{/if}
{/await}
