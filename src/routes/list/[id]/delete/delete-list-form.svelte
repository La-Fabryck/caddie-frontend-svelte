<script lang="ts">
	import {
		Button,
		FormControl,
		FormDescription,
		FormFieldErrors,
		FormElementField,
		FormLabel,
		Input,
		Spinner,
	} from '#lib/components/ui/index.js';
	import { deleteData } from '#lib/fetch/index.js';
	import { backendErrorsToFormErrors } from '#lib/helpers/form-errors.js';
	import { buildApiUrl } from '#lib/helpers/url.js';
	import { listErrorMessages } from '#lib/messages/list.js';
	import type { List } from '#lib/response/list.js';
	import { goto, refreshAll } from '$app/navigation';
	import { resolve } from '$app/paths';
	import { page } from '$app/state';
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
			url: url.toString(),
		});
		submitting = false;

		if (result.error == null) {
			await refreshAll();
			goto(resolve(''), { replace: true });
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
					<FormLabel>
						Cette action est irréversible. Es-tu que tu tu tu turlututu es sur de chez sur ? La
						liste suivante va être supprimée. Oh non 😢
					</FormLabel>
					<Input {...controlProps} disabled bind:value={$formData.title} />
				{/snippet}
			</FormControl>
			<FormDescription>Tu vas mettre quoi dans tes sacs 🛍️ ?</FormDescription>
			<FormFieldErrors />
		{/snippet}
	</FormElementField>

	<Button
		class="font-semibold text-destructive-foreground"
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
