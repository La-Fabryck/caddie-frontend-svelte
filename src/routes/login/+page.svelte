<script lang="ts">
	import { page } from '$app/state';
	import { goto } from '$app/navigation';
	import { resolve } from '$app/paths';
	import {
		Button,
		buttonVariants,
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

	<FormElementField {form} name="email">
		{#snippet children(_)}
			<FormControl>
				{#snippet children({ props: controlProps })}
					<FormLabel>Email</FormLabel>
					<Input
						{...controlProps}
						type="email"
						placeholder="ton@email.com"
						bind:value={$formData.email}
					/>
				{/snippet}
			</FormControl>
			<FormDescription>Rentre ton email.</FormDescription>
			<FormFieldErrors />
		{/snippet}
	</FormElementField>

	<FormElementField {form} name="password">
		{#snippet children(_)}
			<FormControl>
				{#snippet children({ props: controlProps })}
					<FormLabel>Mot de Passe</FormLabel>
					<Input
						{...controlProps}
						type="password"
						placeholder="Mot de passe super sécurisé"
						bind:value={$formData.password}
					/>
				{/snippet}
			</FormControl>
			<FormDescription>Ton mot de passe personnel.</FormDescription>
			<FormFieldErrors />
		{/snippet}
	</FormElementField>

	<Button class="font-semibold" type="submit" disabled={submitting}>
		{#if submitting}
			<Spinner class="size-4" /> Attendez
		{:else}
			S'authentifier
		{/if}
	</Button>
</form>
