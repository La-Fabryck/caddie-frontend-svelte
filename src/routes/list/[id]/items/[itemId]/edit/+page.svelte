<script lang="ts">
	import { Spinner } from '$lib/components/ui';
	import EditItemForm from './edit-item-form.svelte';
	import { initialEditItemForm } from './schema';
	import type { PageProps } from './$types';

	let { data }: PageProps = $props();
</script>

{#await data.item}
	<Spinner class="size-20" />
{:then itemResult}
	{#if itemResult.data == null}
		<p>Not found</p>
	{:else}
		<div class="mx-auto my-5 max-w-2xl lg:mx-0">
			<h2 class="mb-2 text-4xl font-semibold tracking-tight sm:text-5xl">
				Modifier l'article {itemResult.data.name}
			</h2>
		</div>
		{#key itemResult.data.id}
			<EditItemForm
				item={itemResult.data}
				initialFormState={initialEditItemForm(itemResult.data)}
			/>
		{/key}
	{/if}
{/await}
