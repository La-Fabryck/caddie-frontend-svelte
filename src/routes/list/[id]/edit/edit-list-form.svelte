<script lang="ts">
	import { page } from '$app/state';
	import { goto } from '$app/navigation';
	import { invalidateAll } from '$app/navigation';
	import { resolve } from '$app/paths';
	import * as Form from '$lib/components/ui/form/index.js';
	import { Button, Input, Spinner } from '$lib/components/ui';
	import { mutateData } from '$lib/fetch';
	import { buildApiUrl } from '$lib/helpers/url';
	import { backendErrorsToFormErrors } from '$lib/helpers/form-errors';
	import { listErrorMessages } from '$lib/messages/list';
	import type { List } from '$lib/response/list';
	import { superForm } from 'sveltekit-superforms';

	type EditListFormData = Pick<List, 'title'>;
	type Props = { list: List };

	let { list }: Props = $props();

	/** Closure over list so Svelte tracks it; superForm calls this to get initial data. */
	const getInitialFormState = () => ({ title: list.title }) satisfies EditListFormData;
	const form = superForm(getInitialFormState(), {
		SPA: true,
		validators: false
	});

	const { form: formData, errors } = form;

	let submitting = $state(false);

	async function handleSubmit() {
		submitting = true;
		const url = buildApiUrl(page.url.origin, `list/${list.id}`);
		const result = await mutateData<List, Record<string, { message: string }[]>>({
			fetch,
			url: url.toString(),
			method: 'PATCH',
			body: $formData
		});
		submitting = false;

		if (result.error == null && result.data != null) {
			await invalidateAll();
			goto(resolve(`/list/${list.id}`), { replaceState: true });
		} else if (result.error != null) {
			const formErrors = backendErrorsToFormErrors(result.error, listErrorMessages);
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
	<Form.ElementField {form} name="title">
		{#snippet children(_)}
			<Form.Control>
				{#snippet children({ props: controlProps })}
					<Form.Label>Nom de la liste</Form.Label>
					<Input
						{...controlProps}
						placeholder="Le nom de ta liste 🛒🛍️"
						bind:value={$formData.title}
					/>
				{/snippet}
			</Form.Control>
			<Form.Description>Tu vas mettre quoi dans tes sacs 🛍️ ?</Form.Description>
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
