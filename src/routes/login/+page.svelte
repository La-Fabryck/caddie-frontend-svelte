<script lang="ts">
	import { page } from '$app/state';
	import { goto } from '$app/navigation';
	import { resolve } from '$app/paths';
	import * as Form from '$lib/components/ui/form/index.js';
	import { Button, buttonVariants, Input, Spinner } from '$lib/components/ui';
	import { mutateData } from '$lib/fetch';
	import { buildApiUrl } from '$lib/helpers/url';
	import { backendErrorsToFormErrors, type BackendFormErrors } from '$lib/helpers/form-errors';
	import { loginErrorMessages } from '$lib/messages/login';
	import { superForm } from 'sveltekit-superforms';
	import { SquareArrowOutUpRight } from '@lucide/svelte';
	import type { User } from '$lib/response/user';

	type LoginFormData = Pick<User, 'email' | 'password'>;

	const form = superForm({ email: '', password: '' } satisfies LoginFormData, {
		SPA: true,
		validators: false
	});

	const { form: formData, errors } = form;

	let submitting = $state(false);

	async function handleSubmit() {
		submitting = true;
		const url = buildApiUrl(page.url.origin, 'authentication/login');
		const result = await mutateData<null, BackendFormErrors<LoginFormData>>({
			fetch,
			url: url.toString(),
			method: 'POST',
			body: $formData
		});
		submitting = false;

		// Success: no error (response.ok). Body may be empty so result.data can be null.
		if (result.error == null) {
			window.localStorage.setItem('isAuthenticated', '1');
			goto(resolve('/'), { replaceState: true });
		} else {
			const formErrors = backendErrorsToFormErrors(result.error, loginErrorMessages);
			errors.set(formErrors);
		}
	}
</script>

<h1 class="text-center">S'authentifier</h1>
<a
	class={buttonVariants({ variant: 'link', class: 'my-8 w-full text-center' })}
	href={resolve('/create-account')}
>
	Vous n'avez pas encore de compte ? Créer votre compte <SquareArrowOutUpRight />
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
