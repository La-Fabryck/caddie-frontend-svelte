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
	import { deleteData } from '#lib/fetch/index.js';
	import { backendErrorsToFormErrors } from '#lib/helpers/form-errors.js';
	import { buildApiUrl } from '#lib/helpers/url.js';
	import { subscriberErrorMessages } from '#lib/messages/subscriber.js';
	import type { List } from '#lib/response/list.js';
	import { goto, refreshAll } from '$app/navigation';
	import { resolve } from '$app/paths';
	import { page } from '$app/state';
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
			await refreshAll();
			goto(resolve(''), { replace: true });
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
