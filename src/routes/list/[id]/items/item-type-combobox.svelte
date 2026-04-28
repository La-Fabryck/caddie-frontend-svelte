<script lang="ts">
	import { page } from '$app/state';
	import CheckIcon from '@lucide/svelte/icons/check';
	import ChevronsUpDownIcon from '@lucide/svelte/icons/chevrons-up-down';
	import { Button, Spinner } from '$lib/components/ui';
	import {
		Command,
		CommandEmpty,
		CommandGroup,
		CommandInput,
		CommandItem,
		CommandList
	} from '$lib/components/ui/command';
	import { Popover, PopoverContent, PopoverTrigger } from '$lib/components/ui/popover';
	import { fetchData, mutateData } from '$lib/fetch';
	import { buildApiUrl } from '$lib/helpers/url';
	import { cn } from '$lib/utils';
	import type { ItemType } from '$lib/response/item-type';

	type Props = {
		selectedItemTypeId?: string | null;
	};

	let { selectedItemTypeId = $bindable(null) }: Props = $props();

	let itemTypes = $state<ItemType[]>([]);
	let loading = $state(true);
	let creating = $state(false);
	let submitError = $state<string | null>(null);
	let open = $state(false);
	let searchValue = $state('');

	const normalizedQuery = $derived(searchValue.trim().toLowerCase());
	const hasQuery = $derived(normalizedQuery.length > 0);
	const selectedLabel = $derived(
		itemTypes.find((itemType) => itemType.id === selectedItemTypeId)?.label
	);

	const canCreate = $derived(
		hasQuery &&
			!itemTypes.some((itemType) => itemType.label.toLowerCase() === normalizedQuery) &&
			!creating
	);

	$effect(() => {
		loadItemTypes();
	});

	async function loadItemTypes() {
		loading = true;
		submitError = null;

		const url = buildApiUrl(page.url.origin, 'item-types');
		const result = await fetchData<ItemType[]>({ fetch, url: url.toString() });
		loading = false;

		if (result.data != null) {
			itemTypes = result.data;
		} else {
			submitError = "Impossible de charger les types d'articles.";
		}
	}

	async function createItemType() {
		if (!canCreate) return;
		creating = true;
		submitError = null;

		const label = searchValue.trim();
		const url = buildApiUrl(page.url.origin, 'item-types');
		const result = await mutateData<ItemType>({
			fetch,
			url: url.toString(),
			method: 'POST',
			body: { label }
		});
		creating = false;

		if (result.data != null) {
			itemTypes = [...itemTypes, result.data];
			selectedItemTypeId = result.data.id;
			searchValue = '';
			open = false;
			return;
		}

		submitError = "Impossible de creer ce type d'article.";
	}

	function clearSelection() {
		selectedItemTypeId = null;
		open = false;
	}
</script>

<div class="space-y-3">
	<Popover bind:open>
		<PopoverTrigger>
			<Button
				type="button"
				variant="outline"
				role="combobox"
				aria-expanded={open}
				class="min-h-11 w-full justify-between"
			>
				{selectedLabel ?? "Choisir un type d'article..."}
				<ChevronsUpDownIcon class="ml-2 size-4 shrink-0 opacity-50" />
			</Button>
		</PopoverTrigger>

		<PopoverContent class="max-h-[50svh] w-(--radix-popover-trigger-width) p-0">
			<Command>
				<CommandInput placeholder="Rechercher un type..." bind:value={searchValue} />
				<CommandList class="max-h-[calc(50svh-3rem)]">
					{#if loading}
						<div class="flex items-center gap-2 p-3 text-sm text-muted-foreground">
							<Spinner class="size-4" /> Chargement...
						</div>
					{:else}
						<CommandEmpty>Aucun type trouve.</CommandEmpty>
						<CommandGroup>
							<CommandItem value="none" class="min-h-11" onclick={clearSelection}>
								Aucun type
								<CheckIcon
									class={cn(
										'ml-auto size-4',
										selectedItemTypeId == null ? 'opacity-100' : 'opacity-0'
									)}
								/>
							</CommandItem>

							{#each itemTypes as itemType (itemType.id)}
								<CommandItem
									value={itemType.label}
									class="min-h-11"
									onclick={() => {
										selectedItemTypeId = itemType.id;
										open = false;
									}}
								>
									{itemType.label}
									<CheckIcon
										class={cn(
											'ml-auto size-4',
											selectedItemTypeId === itemType.id ? 'opacity-100' : 'opacity-0'
										)}
									/>
								</CommandItem>
							{/each}
						</CommandGroup>

						{#if canCreate}
							<CommandGroup>
								<CommandItem
									value={`create-${normalizedQuery}`}
									class="min-h-11"
									disabled={creating}
									onclick={createItemType}
								>
									{#if creating}
										<Spinner class="size-4" />
									{:else}
										Creer "{searchValue.trim()}"
									{/if}
								</CommandItem>
							</CommandGroup>
						{/if}
					{/if}
				</CommandList>
			</Command>
		</PopoverContent>
	</Popover>

	{#if submitError != null}
		<p class="text-sm text-destructive">{submitError}</p>
	{/if}
</div>
