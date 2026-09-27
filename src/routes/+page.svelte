<script lang="ts">
	import { resolve } from '$app/paths';
	import { buttonVariants, Spinner } from '$lib/components/ui';
	import { Plus } from '@lucide/svelte';
	import type { PageProps } from './$types';
	import ShoppingLists from './shopping-lists.svelte';

	let { data: listData }: PageProps = $props();
</script>

<a
	class={buttonVariants({ variant: 'default', size: 'lg', class: 'font-semibold' })}
	href={resolve('/list/create')}
>
	<Plus />
	Nouvelle liste
</a>

<div class="mx-auto my-5 max-w-2xl lg:mx-0">
	<h2 class="text-4xl font-semibold tracking-tight sm:text-5xl">Mes listes de courses</h2>
</div>

{#await listData.lists}
	<Spinner class="size-20" />
{:then listResult}
	{#if listResult.data == null}
		<p>Impossible de charger tes listes.</p>
	{:else}
		<ShoppingLists initial={listResult.data} />
	{/if}
{/await}
