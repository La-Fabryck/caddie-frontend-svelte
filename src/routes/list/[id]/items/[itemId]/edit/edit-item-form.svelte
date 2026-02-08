<script lang="ts">
	import { page } from '$app/state';
	import { goto } from '$app/navigation';
	import { invalidateAll } from '$app/navigation';
	import { resolve } from '$app/paths';
	import {
		Button,
		Checkbox,
		FormControl,
		FormDescription,
		FormElementField,
		FormFieldErrors,
		FormLabel,
		Input,
		Spinner
	} from '$lib/components/ui';
	import { mutateData } from '$lib/fetch';
	import { buildApiUrl } from '$lib/helpers/url';
	import { backendErrorsToFormErrors } from '$lib/helpers/form-errors';
	import { itemErrorMessages } from '$lib/messages/item';
	import type { Item } from '$lib/response/item';
	import { superForm } from 'sveltekit-superforms';

	type EditItemFormData = Pick<Item, 'name' | 'isInCart'>;
	type Props = { item: Item };

	let { item }: Props = $props();

	/** Closure over item so Svelte tracks it; superForm calls this to get initial data. */
	const getInitialFormState = () =>
		({ name: item.name, isInCart: item.isInCart }) satisfies EditItemFormData;
	const form = superForm(getInitialFormState(), { SPA: true, validators: false });

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
			errors.set(formErrors);
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
	<FormElementField {form} name="name">
		{#snippet children(_)}
			<FormControl>
				{#snippet children({ props: controlProps })}
					<FormLabel>Nom de l'article</FormLabel>
					<Input {...controlProps} placeholder="🍔 ou 🍫" bind:value={$formData.name} />
				{/snippet}
			</FormControl>
			<FormDescription>Bravo on a fait une faute 🤦</FormDescription>
			<FormFieldErrors />
		{/snippet}
	</FormElementField>

	<FormElementField {form} name="isInCart">
		{#snippet children(_)}
			<div class="flex flex-row items-start space-y-0 space-x-3 rounded-md border p-4 shadow">
				<FormControl>
					{#snippet children({ props: controlProps })}
						<Checkbox bind:checked={$formData.isInCart} {...controlProps} />
						<div class="space-y-1 leading-none">
							<FormLabel>Dans le panier 🛒 ?</FormLabel>
							<FormDescription>As-tu déjà pris l'article ?</FormDescription>
						</div>
					{/snippet}
				</FormControl>
			</div>
			<FormFieldErrors />
		{/snippet}
	</FormElementField>

	<Button class="font-semibold" type="submit" disabled={submitting}>
		{#if submitting}
			<Spinner class="size-4" /> Attendez
		{:else}
			Modifier
		{/if}
	</Button>
</form>
