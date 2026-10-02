<script lang="ts">
	import { goto, invalidateAll } from '$app/navigation';
	import { resolve } from '$app/paths';
	import { page } from '$app/state';
	import {
		Button,
		FormControl,
		FormDescription,
		FormElementField,
		FormFieldErrors,
		FormLabel,
		Input,
		Spinner,
	} from '$lib/components/ui';
	import { deleteData } from '$lib/fetch';
	import { backendErrorsToFormErrors } from '$lib/helpers/form-errors';
	import { buildApiUrl } from '$lib/helpers/url';
	import { subscriberErrorMessages } from '$lib/messages/subscriber';
	import type { List } from '$lib/response/list';
	import { superForm } from 'sveltekit-superforms';

	type LeaveListFormData = Pick<List, 'title'>;

	let {
		list,
		subscriptionId,
	}: {
		list: List;
		subscriptionId: string;
	} = $props();

	const getInitialFormState = () => ({ title: list.title }) satisfies LeaveListFormData;
	const form = superForm(getInitialFormState(), { SPA: true, validators: false });

	const { form: formData, errors } = form;

	let submitting = $state(false);

	async function handleSubmit() {
		submitting = true;
		const result = await deleteData<null, Record<string, { message: string }[]>>({
			fetch,
			url: buildApiUrl(page.url.origin, `subscribers/${subscriptionId}`).toString(),
		});
		submitting = false;

		if (result.error == null) {
			await invalidateAll();
			goto(resolve('/'), { replaceState: true });
			return;
		}

		const formErrors = backendErrorsToFormErrors(result.error, subscriberErrorMessages);
		errors.set(formErrors);
	}
</script>

<form
	method="POST"
	class="space-y-8"
	onsubmit={(e) => {
		e.preventDefault();
		void handleSubmit();
	}}
>
	{#if ($errors._errors?.length ?? 0) > 0}
		<ul class="text-sm font-medium text-destructive">
			{#each $errors._errors ?? [] as msg (msg)}
				<li>{msg}</li>
			{/each}
		</ul>
	{/if}

	<FormElementField {form} name="title">
		{#snippet children(_)}
			<FormControl>
				{#snippet children({ props: controlProps })}
					<FormLabel>
						Tu vas quitter cette liste. Tu pourras la rejoindre à nouveau avec un lien de partage.
					</FormLabel>
					<Input {...controlProps} disabled bind:value={$formData.title} />
				{/snippet}
			</FormControl>
			<FormDescription>Si tu es le dernier membre, la liste sera supprimée.</FormDescription>
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
			Quitter
		{/if}
	</Button>
</form>
