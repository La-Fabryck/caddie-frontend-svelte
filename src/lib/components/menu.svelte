<script lang="ts">
	import {
		DropdownMenu,
		DropdownMenuContent,
		DropdownMenuItem,
		DropdownMenuTrigger,
	} from '#lib/components/ui/dropdown-menu/index.js';
	import { resolve } from '$app/paths';
	import type { Path } from '$app/types';
	import type { Snippet } from 'svelte';

	type MenuLinkItem = { label: string; path: Path };
	type MenuActionItem = { label: string; action: () => void; disabled?: boolean };
	type MenuItem = MenuLinkItem | MenuActionItem;

	function isLinkItem(item: MenuItem): item is MenuLinkItem {
		return 'path' in item;
	}

	let {
		items,
		children,
		label = 'Actions',

		/** Accessible name for the icon-only trigger. */
	}: { items: MenuItem[]; children: Snippet; label?: string } = $props();
</script>

<DropdownMenu>
	<DropdownMenuTrigger
		aria-label={label}
		class="inline-flex size-9 shrink-0 items-center justify-center rounded-md outline-none select-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 [&_svg]:pointer-events-none [&_svg]:shrink-0"
	>
		{@render children()}
	</DropdownMenuTrigger>
	<DropdownMenuContent>
		{#each items as item, index (isLinkItem(item) ? item.path : `${item.label}-${index}`)}
			{#if isLinkItem(item)}
				{@const href = resolve(item.path)}
				<DropdownMenuItem class="cursor-pointer" textValue={item.label}>
					{#snippet child({ props })}
						<a {...props} {href}>{item.label}</a>
					{/snippet}
				</DropdownMenuItem>
			{:else}
				<DropdownMenuItem
					class="cursor-pointer"
					textValue={item.label}
					disabled={item.disabled}
					onSelect={() => item.action()}
				>
					{item.label}
				</DropdownMenuItem>
			{/if}
		{/each}
	</DropdownMenuContent>
</DropdownMenu>
