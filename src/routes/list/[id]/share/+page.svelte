<script lang="ts">
	import { page } from '$app/state';
	import { Button, Spinner } from '$lib/components/ui';
	import { mutateData } from '$lib/fetch';
	import { buildApiUrl } from '$lib/helpers/url';
	import { subscriberErrorMessages } from '$lib/messages/subscriber';
	import type { ShareLink } from '$lib/response/share-link';
	import type { PageProps } from './$types';

	let { data }: PageProps = $props();

	let creating = $state(false);
	let shareLink = $state<ShareLink | null>(null);
	let errorMessage = $state<string | null>(null);
	let copied = $state(false);

	const joinUrl = $derived(shareLink == null ? null : `${page.url.origin}/join/${shareLink.token}`);

	async function createShareLink(listId: string) {
		creating = true;
		errorMessage = null;
		copied = false;

		const result = await mutateData<ShareLink>({
			fetch,
			url: buildApiUrl(page.url.origin, `list/${listId}/share-links`).toString(),
			method: 'POST',
			body: null,
		});

		creating = false;

		if (result.data != null) {
			shareLink = result.data;
			return;
		}

		errorMessage =
			result.status === 404
				? subscriberErrorMessages.SHARE_LINK_INVALID
				: subscriberErrorMessages.REQUEST_FAILED;
	}

	async function copyJoinUrl() {
		if (joinUrl == null) {
			return;
		}

		await navigator.clipboard.writeText(joinUrl);
		copied = true;
	}
</script>

{#await data.list}
	<Spinner class="size-20" />
{:then listResult}
	{#if listResult.data == null}
		<p>Not found</p>
	{:else}
		{@const list = listResult.data}
		<div class="mx-auto my-5 max-w-2xl lg:mx-0">
			<h2 class="text-4xl font-semibold tracking-tight sm:text-5xl">Partager la liste</h2>
			<p class="mt-2 text-muted-foreground">{list.title}</p>
		</div>

		{#if shareLink == null}
			<div class="space-y-4">
				<p>Crée un lien pour inviter quelqu’un à rejoindre cette liste.</p>
				{#if errorMessage != null}
					<p class="text-destructive" role="alert">{errorMessage}</p>
				{/if}
				<Button
					class="font-semibold"
					disabled={creating}
					onclick={() => {
						void createShareLink(list.id);
					}}
				>
					{#if creating}
						<Spinner class="size-4" /> Attendez
					{:else}
						Créer un lien
					{/if}
				</Button>
			</div>
		{:else}
			<div class="space-y-4">
				<p>Partage ce lien avec la personne à inviter :</p>
				<code class="block rounded-md bg-surface0 p-3 text-sm break-all">{joinUrl}</code>
				{#if errorMessage != null}
					<p class="text-destructive" role="alert">{errorMessage}</p>
				{/if}
				<div class="flex flex-wrap gap-3">
					<Button
						class="font-semibold"
						onclick={() => {
							void copyJoinUrl();
						}}
					>
						{copied ? 'Copié !' : 'Copier le lien'}
					</Button>
					<Button
						variant="outline"
						class="font-semibold"
						disabled={creating}
						onclick={() => {
							void createShareLink(list.id);
						}}
					>
						{#if creating}
							<Spinner class="size-4" /> Attendez
						{:else}
							Créer un nouveau lien
						{/if}
					</Button>
				</div>
			</div>
		{/if}
	{/if}
{/await}
