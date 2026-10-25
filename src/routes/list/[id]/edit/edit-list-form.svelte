<script lang="ts">
	import {
		Button,
		FormControl,
		FormDescription,
		FormElementField,
		FormFieldErrors,
		FormLabel,
		Input,
		Spinner,
	} from '#lib/components/ui/index.js';
	import { mutateData } from '#lib/fetch/index.js';
	import { backendErrorsToFormErrors } from '#lib/helpers/form-errors.js';
	import { buildApiUrl } from '#lib/helpers/url.js';
	import { listErrorMessages } from '#lib/messages/list.js';
	import type { List } from '#lib/response/list.js';
	import { goto, refreshAll } from '$app/navigation';
	import { resolve } from '$app/paths';
	import { page } from '$app/state';
	import { superForm } from 'sveltekit-superforms';

	type EditListFormData = Pick<List, 'title'>;
	type Props = { list: List };

	let { list }: Props = $props();

	/** Closure over list so Svelte tracks it; superForm calls this to get initial data. */
	const getInitialFormState = () => ({ title: list.title }) satisfies EditListFormData;

	const form = superForm(getInitialFormState(), { SPA: true, validators: false });
	const { form: formData, errors } = form;

	let submitting = $state(false);

	async function handleSubmit() {
		submitting = true;
		const url = buildApiUrl(page.url.origin, `list/${list.id}`);
		const result = await mutateData<List, Record<string, { message: string }[]>>({
			fetch,
			url: url.toString(),
			method: 'PATCH',
			body: $formData,
		});
		submitting = false;

		if (result.error == null && result.data != null) {
			await refreshAll();
			goto(resolve(`list/${list.id}`), { replace: true });
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
	<FormElementField {form} name="title">
		{#snippet children(_)}
			<FormControl>
				{#snippet children({ props: controlProps })}
					<FormLabel>Nom de la liste</FormLabel>
					<Input
						{...controlProps}
						placeholder="Le nom de ta liste 🛒🛍️"
						bind:value={$formData.title}
					/>
				{/snippet}
			</FormControl>
			<FormDescription>Tu vas mettre quoi dans tes sacs 🛍️ ?</FormDescription>
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
