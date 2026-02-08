<script lang="ts">
	import { page } from '$app/state';
	import { goto } from '$app/navigation';
	import { invalidateAll } from '$app/navigation';
	import { resolve } from '$app/paths';
	import * as Form from '$lib/components/ui/form/index.js';
	import { Button, Input, Spinner } from '$lib/components/ui';
	import { mutateData } from '$lib/fetch';
	import { buildApiUrl } from '$lib/helpers/url';
	import {
		backendErrorsToFormErrors,
		type BackendFormErrors,
		type FormErrorsForSchema
	} from '$lib/helpers/form-errors';
	import { itemErrorMessages } from '$lib/messages/item';
	import type { Item } from '$lib/response/item';
	import { initialCreateItemForm, type CreateItemSchema } from './schema';
	import { superForm } from 'sveltekit-superforms';
	import type { PageProps } from './$types';

	let { data, params }: PageProps = $props();
	const listId = $derived(params.id);

	const form = superForm(initialCreateItemForm(), {
		SPA: true,
		validators: false
	});

	const { form: formData, errors } = form;

	let submitting = $state(false);

	async function handleSubmit() {
		submitting = true;
		const url = buildApiUrl(page.url.origin, `list/${listId}/items`);
		const result = await mutateData<Item, BackendFormErrors<CreateItemSchema>>({
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
			const formErrors: FormErrorsForSchema<CreateItemSchema> = backendErrorsToFormErrors(
				result.error,
				itemErrorMessages
			);
			errors.set(formErrors, { force: true });
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
			<Form.ElementField {form} name="name">
				{#snippet children(_)}
					<Form.Control>
						{#snippet children({ props: controlProps })}
							<Form.Label>Nom de l'article</Form.Label>
							<Input {...controlProps} placeholder="🍔 ou 🍫" bind:value={$formData.name} />
						{/snippet}
					</Form.Control>
					<Form.Description>Tu veux acheter quoi encore 🤌 ⁉️</Form.Description>
					<Form.FieldErrors />
				{/snippet}
			</Form.ElementField>

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
