<script lang="ts">
	import { page } from '$app/state';
	import { goto } from '$app/navigation';
	import { invalidateAll } from '$app/navigation';
	import { resolve } from '$app/paths';
	import * as Form from '$lib/components/ui/form/index.js';
	import { Button, Checkbox, Input, Spinner } from '$lib/components/ui';
	import { mutateData } from '$lib/fetch';
	import { buildApiUrl } from '$lib/helpers/url';
	import { backendErrorsToFormErrors } from '$lib/helpers/form-errors';
	import { itemErrorMessages } from '$lib/messages/item';
	import type { Item } from '$lib/response/item';
	import type { InitialEditItemFormState } from './schema';
	import { superForm } from 'sveltekit-superforms';

	type Props = {
		item: Item;
		initialFormState: InitialEditItemFormState;
	};

	let { item, initialFormState }: Props = $props();

	const initialState: InitialEditItemFormState = {
		id: '',
		valid: true,
		posted: false,
		errors: {},
		data: { name: '', isInCart: false }
	};
	const form = superForm(initialState, {
		SPA: true,
		validators: false
	});

	$effect(() => {
		form.form.update(() => initialFormState.data);
	});

	const { form: formData, errors } = form;

	let submitting = $state(false);

	async function handleSubmit() {
		submitting = true;
		const url = buildApiUrl(page.url.origin, `list/${item.listId}/items/${item.id}`);
		const result = await mutateData<Item, Record<string, { message: string }[]>>({
			fetch,
			url: url.toString(),
			method: 'PATCH',
			body: $formData
		});
		submitting = false;

		if (result.error == null && result.data != null) {
			await invalidateAll();
			goto(resolve(`/list/${item.listId}`), { replaceState: true });
		} else if (result.error != null) {
			const formErrors = backendErrorsToFormErrors(result.error, itemErrorMessages);
			errors.set(formErrors, { force: true });
		}
	}
</script>

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
			<Form.Description>Bravo on a fait une faute 🤦</Form.Description>
			<Form.FieldErrors />
		{/snippet}
	</Form.ElementField>

	<Form.ElementField {form} name="isInCart">
		{#snippet children(_)}
			<div class="flex flex-row items-start space-y-0 space-x-3 rounded-md border p-4 shadow">
				<Form.Control>
					{#snippet children({ props: controlProps })}
						<Checkbox bind:checked={$formData.isInCart} {...controlProps} />
						<div class="space-y-1 leading-none">
							<Form.Label>Dans le panier 🛒 ?</Form.Label>
							<Form.Description>As-tu déjà pris l'article ?</Form.Description>
						</div>
					{/snippet}
				</Form.Control>
			</div>
			<Form.FieldErrors />
		{/snippet}
	</Form.ElementField>

	<Button class="font-semibold" type="submit" disabled={submitting}>
		{#if submitting}
			<Spinner class="size-4" /> Attendez
		{:else}
			Modifier
		{/if}
	</Button>
</form>
