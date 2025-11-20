<script lang="ts">
	import { Plus } from 'lucide-svelte';
	import { formatDateToISO, formatDateToLongFormat } from '$lib/helpers/date';
	import { buttonVariants } from '$lib/components/ui/button';
	import type { PageProps } from './$types';
	import Loader from '$lib/components/loader.svelte';
	import { onMount } from 'svelte';

	let props: PageProps = $props();
	let isLoading = $state(true);
	const { data } = props;
	const { data: allLists = [] } = data;

	onMount(async () => {
		isLoading = data.isLoading;
	});
</script>

<a
	class={buttonVariants({ variant: 'default', size: 'lg', class: 'font-semibold' })}
	href="/list/create"
>
	<Plus />
	Nouvelle liste
</a>

<div class="mx-auto my-5 max-w-2xl lg:mx-0">
	<h2 class="text-4xl font-semibold tracking-tight sm:text-5xl">Mes listes de courses</h2>
</div>

{#if isLoading}
	<Loader />
{:else if !allLists?.length}
	<p>Créé ta première liste nondidju !</p>
{:else}
	<ul>
		{#each allLists as list (list.id)}
			<li>
				<!-- eslint-disable-next-line svelte/no-navigation-without-resolve -->
				<a
					href="/list/{list.id}"
					class="bg-surface0 hover:bg-surface1 my-2 flex justify-between gap-x-6 p-5"
				>
					<div class="flex min-w-0 gap-x-4">
						<div class="min-w-0 flex-auto">
							<p class="text-lg font-bold">{list.title}</p>
							<p class="mt-1 truncate text-xs/5">
								Créé le <time datetime={formatDateToISO(list.createdAt)}
									>{formatDateToLongFormat(list.createdAt)}</time
								>
							</p>
						</div>
					</div>
					<div class="flex flex-col items-center sm:items-end">
						<div class="mt-1 flex items-center gap-x-1.5">
							<div class="hidden shrink-0 sm:flex sm:flex-col sm:items-end">
								<p class="text-xs/5">En cours</p>
							</div>
							<div class="bg-green rounded-full p-1">
								<div class="bg-green size-1.5 rounded-full"></div>
							</div>
						</div>
						<div class="mt-1 hidden shrink-0 sm:flex sm:flex-col sm:items-end">
							<p class="text-xs/5">
								Modifié le <time datetime={formatDateToISO(list.updatedAt)}
									>{formatDateToLongFormat(list.updatedAt)}</time
								>
							</p>
						</div>
						<div class="mt-2">
							<!-- TODO: -->
							<!-- <Menu items={[
                { label: 'Modifier', path: `/list/${list.id}/edit` },
                { label: 'Supprimer', path: `/list/${list.id}/delete` }
              ]}>
                <Settings size="36" />
              </Menu> -->
						</div>
					</div>
				</a>
			</li>
		{/each}
	</ul>
{/if}
