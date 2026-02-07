<script lang="ts">
	import type { Pathname } from '$app/types';
	import { resolve } from '$app/paths';
	import {
		DropdownMenu,
		DropdownMenuContent,
		DropdownMenuItem,
		DropdownMenuTrigger
	} from '$lib/components/ui/dropdown-menu';
	import type { Snippet } from 'svelte';

	interface MenuItem {
		label: string;
		path: Pathname;
	}

	let {
		items,
		children
	}: {
		items: MenuItem[];
		children: Snippet;
	} = $props();
</script>

<DropdownMenu>
	<DropdownMenuTrigger
		class="inline-flex size-9 shrink-0 items-center justify-center rounded-md outline-none select-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 [&_svg]:pointer-events-none [&_svg]:shrink-0"
	>
		{@render children()}
	</DropdownMenuTrigger>
	<DropdownMenuContent>
		{#each items as { label, path } (path)}
			<DropdownMenuItem textValue={label}>
				<a href={resolve(path)}>{label}</a>
			</DropdownMenuItem>
		{/each}
	</DropdownMenuContent>
</DropdownMenu>
