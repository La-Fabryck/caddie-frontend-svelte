<script lang="ts">
	import { goto } from '$app/navigation';
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
	import { mutateData } from '$lib/fetch';
	import { backendErrorsToFormErrors, type BackendFormErrors } from '$lib/helpers/form-errors';
	import { buildApiUrl } from '$lib/helpers/url';
	import { subscriberErrorMessages } from '$lib/messages/subscriber';
	import type { Subscriber } from '$lib/response/subscriber';
	import { superForm } from 'sveltekit-superforms';

	type JoinFormData = { name: string };

	const form = superForm({ name: '' } satisfies JoinFormData, {
		SPA: true,
		validators: false,
	});

	const { form: formData, errors } = form;

	let submitting = $state(false);

	async function handleSubmit() {
		submitting = true;
		const token = page.params.token ?? '';
		const result = await mutateData<
			Subscriber,
			BackendFormErrors<JoinFormData & { token: string }>
		>({
			fetch,
			url: buildApiUrl(page.url.origin, 'subscribers/join').toString(),
			method: 'POST',
			body: { token, name: $formData.name },
		});
		submitting = false;

		if (result.error == null && result.data?.listId != null) {
			goto(resolve(`/list/${result.data.listId}`), { replaceState: true });
			return;
		}

		if (result.status === 404) {
			errors.set({
				_errors: [subscriberErrorMessages.SHARE_LINK_INVALID],
			});
			return;
		}

		if (result.error != null) {
			const formErrors = backendErrorsToFormErrors(result.error, subscriberErrorMessages);
			// token is not a visible input; surface those messages as form-level errors
			if (formErrors.token != null) {
				formErrors._errors = [...(formErrors._errors ?? []), ...formErrors.token];
				delete formErrors.token;
			}
			errors.set(formErrors);
		}
	}
</script>

<h1 class="mb-8 text-center">Rejoindre une liste</h1>

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

	<FormElementField {form} name="name">
		{#snippet children(_)}
			<FormControl>
				{#snippet children({ props: controlProps })}
					<FormLabel>Ton surnom</FormLabel>
					<Input
						{...controlProps}
						placeholder="Ton surnom que tout le monde verra"
						bind:value={$formData.name}
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
			Rejoindre
		{/if}
	</Button>
</form>
