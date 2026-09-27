<script lang="ts">
	import { resolve } from '$app/paths';
	import { page } from '$app/state';
	import Menu from '$lib/components/menu.svelte';
	import { Button, Spinner } from '$lib/components/ui';
	import { fetchData, mutateData } from '$lib/fetch';
	import { formatDateToISO, formatDateToLongFormat } from '$lib/helpers/date';
	import { buildApiUrl, buildListCollectionUrl } from '$lib/helpers/url';
	import { LIST_PAGE_LIMIT, type List, type PaginatedLists } from '$lib/response/list';
	import { Settings } from '@lucide/svelte';
	import { untrack } from 'svelte';

	type Props = {
		initial: PaginatedLists;
	};

	let { initial }: Props = $props();

	// Seed once from SSR/first page; load-more and archive mutate local copies.
	let lists = $state<List[]>(untrack(() => [...initial.items]));
	let total = $state(untrack(() => initial.total));
	let loadingMore = $state(false);
	let togglingId = $state<string | null>(null);

	const hasMore = $derived(lists.length < total);

	async function loadMore() {
		if (loadingMore || !hasMore) {
			return;
		}

		loadingMore = true;
		const result = await fetchData<PaginatedLists>({
			fetch,
			url: buildListCollectionUrl(page.url.origin, {
				limit: LIST_PAGE_LIMIT,
				offset: lists.length,
			}),
		});
		loadingMore = false;

		if (result.data == null) {
			return;
		}

		lists = [...lists, ...result.data.items];
		total = result.data.total;
	}

	async function toggleArchive(list: List) {
		if (togglingId != null) {
			return;
		}

		togglingId = list.id;
		const nextArchived = !list.isArchived;
		const result = await mutateData<List>({
			fetch,
			url: buildApiUrl(page.url.origin, `list/${list.id}`).toString(),
			method: 'PATCH',
			body: { isArchived: nextArchived },
		});
		togglingId = null;

		if (result.data == null) {
			return;
		}

		const updated = result.data;
		lists = lists.map((entry) => (entry.id === list.id ? updated : entry));
	}
</script>

{#if lists.length === 0}
	<p>Créé ta première liste nondidju !</p>
{:else}
	<ul>
		{#each lists as list (list.id)}
			<li class="my-2 flex justify-between gap-x-6 bg-surface0 p-5 hover:bg-surface1">
				<a href={resolve(`/list/${list.id}`)} class="flex min-w-0 flex-auto gap-x-4">
					<div class="min-w-0 flex-auto">
						<p class="text-lg font-bold">{list.title}</p>
						<p class="mt-1 truncate text-xs/5">
							Créé le <time datetime={formatDateToISO(list.createdAt)}
								>{formatDateToLongFormat(list.createdAt)}</time
							>
						</p>
					</div>
					<div class="flex flex-col items-center sm:items-end">
						<div class="mt-1 flex items-center gap-x-1.5">
							<div class="hidden shrink-0 sm:flex sm:flex-col sm:items-end">
								<p class="text-xs/5">{list.isArchived ? 'Archivée' : 'En cours'}</p>
							</div>
							<div
								class="rounded-full p-1 {list.isArchived ? 'bg-destructive' : 'bg-green'}"
								aria-hidden="true"
							>
								<div
									class="size-1.5 rounded-full {list.isArchived ? 'bg-destructive' : 'bg-green'}"
								></div>
							</div>
						</div>
						<div class="mt-1 hidden shrink-0 sm:flex sm:flex-col sm:items-end">
							<p class="text-xs/5">
								Modifié le <time datetime={formatDateToISO(list.updatedAt)}
									>{formatDateToLongFormat(list.updatedAt)}</time
								>
							</p>
						</div>
					</div>
				</a>
				<div class="mt-2 shrink-0">
					<Menu
						label="Actions de la liste"
						items={[
							{ label: 'Modifier', path: `/list/${list.id}/edit` },
							{
								label:
									togglingId === list.id
										? 'Mise à jour…'
										: list.isArchived
											? 'Désarchiver'
											: 'Archiver',
								disabled: togglingId === list.id,
								action: () => {
									void toggleArchive(list);
								},
							},
							{ label: 'Supprimer', path: `/list/${list.id}/delete` },
						]}
					>
						<Settings size={36} />
					</Menu>
				</div>
			</li>
		{/each}
	</ul>

	{#if hasMore}
		<div class="mt-4 flex justify-center">
			<Button
				variant="outline"
				class="font-semibold"
				disabled={loadingMore}
				onclick={() => {
					void loadMore();
				}}
			>
				{#if loadingMore}
					<Spinner class="size-4" /> Chargement
				{:else}
					Charger plus
				{/if}
			</Button>
		</div>
	{/if}
{/if}
