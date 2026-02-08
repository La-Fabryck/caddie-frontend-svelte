<script lang="ts">
	import { page } from '$app/state';
	import { goto } from '$app/navigation';
	import { resolve } from '$app/paths';
	import * as Form from '$lib/components/ui/form/index.js';
	import { Button, buttonVariants, Input, Spinner } from '$lib/components/ui';
	import { mutateData } from '$lib/fetch';
	import { buildApiUrl } from '$lib/helpers/url';
	import { backendErrorsToFormErrors, type BackendFormErrors } from '$lib/helpers/form-errors';
	import { userCreationErrorMessages } from '$lib/messages/user-creation';
	import { superForm } from 'sveltekit-superforms';
	import { SquareArrowOutUpRight } from '@lucide/svelte';
	import type { User } from '$lib/response/user';

	type CreateAccountFormData = Omit<User, 'id'>;

	const form = superForm({ email: '', name: '', password: '' } satisfies CreateAccountFormData, {
		SPA: true,
		validators: false
	});

	const { form: formData, errors } = form;

	let submitting = $state(false);

	async function handleSubmit() {
		submitting = true;
		const url = buildApiUrl(page.url.origin, 'users');
		const result = await mutateData<null, BackendFormErrors<CreateAccountFormData>>({
			fetch,
			url: url.toString(),
			method: 'POST',
			body: $formData
		});
		submitting = false;

		if (result.error == null) {
			goto(resolve('/'), { replaceState: true });
		} else {
			const formErrors = backendErrorsToFormErrors(result.error, userCreationErrorMessages);
			errors.set(formErrors);
		}
	}
</script>

<h1 class="mb-8 text-center">Créer son compte</h1>
<a
	class={buttonVariants({ variant: 'link', class: 'mb-8 w-full text-center' })}
	href={resolve('/login')}
>
	Vous avez déjà un compte ? S'authentifier <SquareArrowOutUpRight />
</a>

<form
	method="POST"
	class="space-y-8"
	onsubmit={(e) => {
		e.preventDefault();
		handleSubmit();
	}}
>
	{#if ($errors._errors?.length ?? 0) > 0}
		<ul class="text-sm font-medium text-destructive">
			{#each $errors._errors ?? [] as msg (msg)}
				<li>{msg}</li>
			{/each}
		</ul>
	{/if}

	<Form.ElementField {form} name="email">
		{#snippet children(_)}
			<Form.Control>
				{#snippet children({ props: controlProps })}
					<Form.Label>Email</Form.Label>
					<Input
						{...controlProps}
						type="email"
						placeholder="ton@email.com"
						bind:value={$formData.email}
					/>
				{/snippet}
			</Form.Control>
			<Form.Description>Rentre ton email.</Form.Description>
			<Form.FieldErrors />
		{/snippet}
	</Form.ElementField>

	<Form.ElementField {form} name="name">
		{#snippet children(_)}
			<Form.Control>
				{#snippet children({ props: controlProps })}
					<Form.Label>Ton surnom</Form.Label>
					<Input
						{...controlProps}
						placeholder="Ton surnom par défaut pour les listes."
						bind:value={$formData.name}
					/>
				{/snippet}
			</Form.Control>
			<Form.Description>Ton surnom de 2 lettres minimum, on est sérieux ici.</Form.Description>
			<Form.FieldErrors />
		{/snippet}
	</Form.ElementField>

	<Form.ElementField {form} name="password">
		{#snippet children(_)}
			<Form.Control>
				{#snippet children({ props: controlProps })}
					<Form.Label>Mot de Passe</Form.Label>
					<Input
						{...controlProps}
						type="password"
						placeholder="Mot de passe super sécurisé"
						bind:value={$formData.password}
					/>
				{/snippet}
			</Form.Control>
			<Form.Description>Ton mot de passe personnel.</Form.Description>
			<Form.FieldErrors />
		{/snippet}
	</Form.ElementField>

	<Button class="font-semibold" type="submit" disabled={submitting}>
		{#if submitting}
			<Spinner class="size-4" /> Attendez
		{:else}
			S'authentifier
		{/if}
	</Button>
</form>
