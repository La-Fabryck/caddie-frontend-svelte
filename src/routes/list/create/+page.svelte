<script lang="ts">
	import { page } from '$app/state';
	import { goto } from '$app/navigation';
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
	import { mutateData } from '$lib/fetch';
	import { buildApiUrl } from '$lib/helpers/url';
	import { backendErrorsToFormErrors, type BackendFormErrors } from '$lib/helpers/form-errors';
	import { listErrorMessages } from '$lib/messages/list';
	import { superForm } from 'sveltekit-superforms';

	type CreateListFormData = { title: string; pseudonym: string };
	type ListWithSubs = {
		id: string;
		title: string;
		createdAt: string;
		updatedAt: string;
		subscribers: unknown[];
	};

	const form = superForm({ title: '', pseudonym: '' } satisfies CreateListFormData, {
		SPA: true,
		validators: false
	});

	const { form: formData, errors } = form;

	let submitting = $state(false);

	async function handleSubmit() {
		submitting = true;
		const url = buildApiUrl(page.url.origin, 'list');
		const result = await mutateData<ListWithSubs, BackendFormErrors<CreateListFormData>>({
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
			errors.set(formErrors);
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
	<FormElementField {form} name="title">
		{#snippet children(_)}
			<FormControl>
				{#snippet children({ props: controlProps })}
					<FormLabel>Nom de la liste</FormLabel>
					<Input {...controlProps} placeholder="Courses" bind:value={$formData.title} />
				{/snippet}
			</FormControl>
			<FormDescription>Donne un nom à ta liste.</FormDescription>
			<FormFieldErrors />
		{/snippet}
	</FormElementField>

	<FormElementField {form} name="pseudonym">
		{#snippet children(_)}
			<FormControl>
				{#snippet children({ props: controlProps })}
					<FormLabel>Ton surnom</FormLabel>
					<Input
						{...controlProps}
						placeholder="Ton surnom que tout le monde verra"
						bind:value={$formData.pseudonym}
					/>
				{/snippet}
			</FormControl>
			<FormDescription>Donne toi un surnom rigolo 🌶️</FormDescription>
			<FormFieldErrors />
		{/snippet}
	</FormElementField>

	<Button class="font-semibold" type="submit" disabled={submitting}>
		{#if submitting}
			<Spinner class="size-4" /> Attendez
		{:else}
			Créer
		{/if}
	</Button>
</form>
