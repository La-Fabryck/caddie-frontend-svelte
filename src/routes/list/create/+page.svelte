<script lang="ts">
	import { page } from '$app/state';
	import { goto } from '$app/navigation';
	import { resolve } from '$app/paths';
	import * as Form from '$lib/components/ui/form/index.js';
	import { Button, Input, Spinner } from '$lib/components/ui';
	import { mutateData } from '$lib/fetch';
	import { buildApiUrl } from '$lib/helpers/url';
	import { backendErrorsToFormErrors } from '$lib/helpers/form-errors';
	import { listErrorMessages } from '$lib/messages/list';
	import { initialCreateListForm } from './schema';
	import { superForm } from 'sveltekit-superforms';

	type ListWithSubs = {
		id: string;
		title: string;
		createdAt: string;
		updatedAt: string;
		subscribers: unknown[];
	};

	const form = superForm(initialCreateListForm(), {
		SPA: true,
		validators: false
	});

	const { form: formData, errors } = form;

	let submitting = $state(false);

	async function handleSubmit() {
		submitting = true;
		const url = buildApiUrl(page.url.origin, 'list');
		const result = await mutateData<ListWithSubs, Record<string, { message: string }[]>>({
			fetch,
			url: url.toString(),
			method: 'POST',
			body: $formData
		});
		submitting = false;

		if (result.error == null && result.data?.id != null) {
			goto(resolve(`/list/${result.data.id}`), { replaceState: true });
		} else if (result.error != null) {
			const formErrors = backendErrorsToFormErrors(result.error, listErrorMessages);
			errors.set(formErrors, { force: true });
		}
	}
</script>

<h1 class="mb-8 text-center">Crée une nouvelle liste</h1>

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
						placeholder="Courses"
						value={$formData.title}
						oninput={(e) => formData.update((d) => ({ ...d, title: e.currentTarget.value }))}
					/>
				{/snippet}
			</Form.Control>
			<Form.Description>Donne un nom à ta liste.</Form.Description>
			<Form.FieldErrors />
		{/snippet}
	</Form.ElementField>

	<Form.ElementField {form} name="pseudonym">
		{#snippet children(_)}
			<Form.Control>
				{#snippet children({ props: controlProps })}
					<Form.Label>Ton surnom</Form.Label>
					<Input
						{...controlProps}
						placeholder="Ton surnom que tout le monde verra"
						value={$formData.pseudonym}
						oninput={(e) => formData.update((d) => ({ ...d, pseudonym: e.currentTarget.value }))}
					/>
				{/snippet}
			</Form.Control>
			<Form.Description>Donne toi un surnom rigolo 🌶️</Form.Description>
			<Form.FieldErrors />
		{/snippet}
	</Form.ElementField>

	<Button class="font-semibold" type="submit" disabled={submitting}>
		{#if submitting}
			<Spinner class="size-4" /> Attendez
		{:else}
			Créer
		{/if}
	</Button>
</form>
