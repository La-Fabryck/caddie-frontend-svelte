<script lang="ts">
	import { page } from '$app/state';
	import { goto } from '$app/navigation';
	import { invalidateAll } from '$app/navigation';
	import { resolve } from '$app/paths';
	import {
		Button,
		FormControl,
		FormDescription,
		FormElementField,
		FormFieldErrors,
		FormLabel,
		Input,
		Spinner
	} from '$lib/components/ui';
	import ItemTypeCombobox from '../item-type-combobox.svelte';
	import { mutateData } from '$lib/fetch';
	import { buildApiUrl } from '$lib/helpers/url';
	import { backendErrorsToFormErrors, type BackendFormErrors } from '$lib/helpers/form-errors';
	import { itemErrorMessages } from '$lib/messages/item';
	import type { Item } from '$lib/response/item';
	import { superForm } from 'sveltekit-superforms';
	import type { PageProps } from './$types';

	type CreateItemFormData = Pick<Item, 'name'> & Partial<Pick<Item, 'quantity' | 'itemTypeId'>>;
	let { data, params }: PageProps = $props();

	const listId = $derived(params.id);

	const form = superForm<CreateItemFormData>(
		{ name: '', itemTypeId: null },
		{
			SPA: true,
			validators: false
		}
	);

	const { form: formData, errors } = form;

	let submitting = $state(false);

	async function handleSubmit() {
		submitting = true;
		const url = buildApiUrl(page.url.origin, `list/${listId}/items`);
		const result = await mutateData<Item, BackendFormErrors<CreateItemFormData>>({
			fetch,
			url: url.toString(),
			method: 'POST',
			body: $formData
		});
		submitting = false;

		if (result.error == null && result.data != null) {
			await invalidateAll();
			goto(resolve(`/list/${listId}`), { replaceState: true });
		} else if (result.error != null) {
			const formErrors = backendErrorsToFormErrors(result.error, itemErrorMessages);
			errors.set(formErrors);
		}
	}
</script>

{#await data.list}
	<Spinner class="size-20" />
{:then listResult}
	{#if listResult.data == null}
		<p>Not found</p>
	{:else}
		<h1 class="mb-8 text-center">
			🛒 Ajoute un nouvel article à {listResult.data.title} 🛒
		</h1>

		<form
			method="POST"
			class="space-y-8"
			onsubmit={(e) => {
				e.preventDefault();
				handleSubmit();
			}}
		>
			<FormElementField {form} name="name">
				{#snippet children(_)}
					<FormControl>
						{#snippet children({ props: controlProps })}
							<FormLabel>Nom de l'article</FormLabel>
							<Input {...controlProps} placeholder="🍔 ou 🍫" bind:value={$formData.name} />
						{/snippet}
					</FormControl>
					<FormDescription>Tu veux acheter quoi encore 🤌 ⁉️</FormDescription>
					<FormFieldErrors />
				{/snippet}
			</FormElementField>

			<FormElementField {form} name="quantity">
				{#snippet children(_)}
					<FormControl>
						{#snippet children({ props: controlProps })}
							<FormLabel>Quantité</FormLabel>
							<Input
								{...controlProps}
								type="number"
								min={1}
								step={1}
								placeholder="1"
								bind:value={$formData.quantity}
							/>
						{/snippet}
					</FormControl>
					<FormDescription>Pas besoin de mettre la quantité si c'est 1 fieu 🫪</FormDescription>
					<FormFieldErrors />
				{/snippet}
			</FormElementField>

			<FormElementField {form} name="itemTypeId">
				{#snippet children(_)}
					<FormControl>
						{#snippet children(_)}
							<FormLabel>Type</FormLabel>
							<ItemTypeCombobox bind:selectedItemTypeId={$formData.itemTypeId} />
						{/snippet}
					</FormControl>
					<FormDescription>Optionnel: choisis ou crée un type d'article.</FormDescription>
					<FormFieldErrors />
				{/snippet}
			</FormElementField>

			<Button class="font-semibold" type="submit" disabled={submitting}>
				{#if submitting}
					<Spinner class="size-4" /> Attendez
				{:else}
					Ajouter
				{/if}
			</Button>
		</form>
	{/if}
{/await}
