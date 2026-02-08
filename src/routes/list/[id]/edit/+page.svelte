<script lang="ts">
	import { Spinner } from '$lib/components/ui';
	import EditListForm from './edit-list-form.svelte';
	import type { PageProps } from './$types';

	let { data }: PageProps = $props();
</script>

{#await data.list}
	<Spinner class="size-20" />
{:then listResult}
	{#if listResult.data == null}
		<p>Not found</p>
	{:else}
		<div class="mx-auto my-5 max-w-2xl lg:mx-0">
			<h2 class="text-4xl font-semibold tracking-tight sm:text-5xl">Modifier ma liste</h2>
		</div>
		{#key listResult.data.id}
			<EditListForm list={listResult.data} />
		{/key}
	{/if}
{/await}
