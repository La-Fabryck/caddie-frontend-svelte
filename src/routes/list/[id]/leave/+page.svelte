<script lang="ts">
	import { Spinner } from '$lib/components/ui';
	import type { PageProps } from './$types';
	import LeaveListForm from './leave-list-form.svelte';

	let { data }: PageProps = $props();
</script>

{#await data.list}
	<Spinner class="size-20" />
{:then listResult}
	{#if listResult.data == null || data.subscriptionId == null}
		<p>Not found</p>
	{:else}
		<div class="mx-auto my-5 max-w-2xl lg:mx-0">
			<h2 class="text-4xl font-semibold tracking-tight sm:text-5xl">Quitter la liste</h2>
		</div>
		{#key listResult.data.id}
			<LeaveListForm list={listResult.data} subscriptionId={data.subscriptionId} />
		{/key}
	{/if}
{/await}
