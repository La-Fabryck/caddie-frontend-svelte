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

	<FormElementField {form} name="name">
		{#snippet children(_)}
			<FormControl>
				{#snippet children({ props: controlProps })}
					<FormLabel>Ton surnom</FormLabel>
					<Input
						{...controlProps}
						placeholder="Ton surnom par défaut pour les listes."
						bind:value={$formData.name}
					/>
				{/snippet}
			</FormControl>
			<FormDescription>Ton surnom de 2 lettres minimum, on est sérieux ici.</FormDescription>
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
