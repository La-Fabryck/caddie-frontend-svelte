<script lang="ts">
	import '../app.css';
	import favicon from '$lib/assets/favicon.svg';
	import { navigationMenuTriggerStyle } from '$lib/components/ui/navigation-menu/navigation-menu-trigger.svelte';
	import { NavigationMenu } from 'bits-ui';
	import { resolve } from '$app/paths';

	let { children } = $props();
</script>

<svelte:head>
	<link rel="icon" href={favicon} />
</svelte:head>

<!-- <div
	class="preview flex w-full justify-center p-10 data-[align=center]:items-center data-[align=end]:items-end data-[align=start]:items-start"
> -->
<div class="container-wrapper 3xl:fixed:px-0 px-6">
	<div class="3xl:fixed:container h-(--header-height) gap-2 **:data-[slot=separator]:h-4!">
		<NavigationMenu.Root>
			<NavigationMenu.List class="flex flex-row items-center justify-center">
				<NavigationMenu.Item>
					<NavigationMenu.Link>
						{#snippet child()}
							<a href={resolve('/')} class={navigationMenuTriggerStyle()}>Home</a>
						{/snippet}
					</NavigationMenu.Link>
				</NavigationMenu.Item>

				<NavigationMenu.Item>
					<NavigationMenu.Link>
						{#snippet child()}
							<a href="/login" class={navigationMenuTriggerStyle()}>Login</a>
						{/snippet}
					</NavigationMenu.Link>
				</NavigationMenu.Item>

				<NavigationMenu.Item>
					<NavigationMenu.Link>
						{#snippet child()}
							<a href="/404" class={navigationMenuTriggerStyle()}>404</a>
						{/snippet}
					</NavigationMenu.Link>
				</NavigationMenu.Item>
			</NavigationMenu.List>
		</NavigationMenu.Root>
	</div>
</div>

<main>
	<div class="py-5">
		<div class="mx-auto max-w-7xl px-6 lg:px-8">
			{@render children()}
		</div>
	</div>
</main>
