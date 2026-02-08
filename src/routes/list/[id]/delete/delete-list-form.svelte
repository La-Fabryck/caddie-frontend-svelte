<script lang="ts">
	import { page } from '$app/state';
	import { goto } from '$app/navigation';
	import { invalidateAll } from '$app/navigation';
	import { resolve } from '$app/paths';
	import * as Form from '$lib/components/ui/form/index.js';
	import { Button, Input, Spinner } from '$lib/components/ui';
	import { deleteData } from '$lib/fetch';
	import { buildApiUrl } from '$lib/helpers/url';
	import { backendErrorsToFormErrors } from '$lib/helpers/form-errors';
	import { listErrorMessages } from '$lib/messages/list';
	import type { List } from '$lib/response/list';
	import { superForm } from 'sveltekit-superforms';

	type DeleteListFormData = Pick<List, 'title'>;
	let { list }: { list: List } = $props();

	/** Closure over list so Svelte tracks it; superForm calls this to get initial data. */
	const getInitialFormState = () => ({ title: list.title }) satisfies DeleteListFormData;
	const form = superForm(getInitialFormState(), { SPA: true, validators: false });

	const { form: formData, errors } = form;

	let submitting = $state(false);

	async function handleSubmit() {
		submitting = true;
		const url = buildApiUrl(page.url.origin, `list/${list.id}`);
		const result = await deleteData<List, Record<string, { message: string }[]>>({
			fetch,
			url: url.toString()
		});
		submitting = false;

		if (result.error == null) {
			await invalidateAll();
			goto(resolve('/'), { replaceState: true });
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
					<Form.Label>
						Cette action est irréversible. Es-tu que tu tu tu turlututu es sur de chez sur ? La
						liste suivante va être supprimée. Oh non 😢
					</Form.Label>
					<Input {...controlProps} disabled bind:value={$formData.title} />
				{/snippet}
			</Form.Control>
			<Form.Description>Tu vas mettre quoi dans tes sacs 🛍️ ?</Form.Description>
			<Form.FieldErrors />
		{/snippet}
	</Form.ElementField>

	<Button
		class="text-destructive-foreground font-semibold"
		type="submit"
		variant="destructive"
		disabled={submitting}
	>
		{#if submitting}
			<Spinner class="size-4" /> Attendez
		{:else}
			Supprimer
		{/if}
	</Button>
</form>
