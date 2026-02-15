<script lang="ts">
	import '../app.css';
	import favicon from '$lib/assets/favicon.svg';
	import { navigationMenuTriggerStyle } from '$lib/components/ui/navigation-menu/navigation-menu-trigger.svelte';
	import { resolve } from '$app/paths';
	import {
		NavigationMenuItem,
		NavigationMenuLink,
		NavigationMenuList,
		NavigationMenuRoot
	} from '$lib/components/ui';

	let { children } = $props();
</script>

<svelte:head>
	<link rel="icon" href={favicon} />
</svelte:head>

<header class="flex justify-end bg-crust">
	<nav
		class="preview flex w-full justify-center p-2 data-[align=center]:items-center data-[align=end]:items-end data-[align=start]:items-start"
	>
		<div class="container-wrapper 3xl:fixed:px-0 px-6">
			<div class="3xl:fixed:container h-(--header-height) gap-2 **:data-[slot=separator]:h-4!">
				<NavigationMenuRoot>
					<NavigationMenuList class="flex flex-row items-center justify-center">
						<NavigationMenuItem>
							<NavigationMenuLink>
								{#snippet child()}
									<a
										href={resolve('/')}
										class={navigationMenuTriggerStyle({
											class: 'bg-transparent hover:bg-mantle data-[state=open]:bg-mantle'
										})}>Home</a
									>
								{/snippet}
							</NavigationMenuLink>
						</NavigationMenuItem>

						<NavigationMenuItem>
							<NavigationMenuLink>
								{#snippet child()}
									<a
										href={resolve('/login')}
										class={navigationMenuTriggerStyle({
											class: 'bg-transparent hover:bg-mantle data-[state=open]:bg-mantle'
										})}>Login</a
									>
								{/snippet}
							</NavigationMenuLink>
						</NavigationMenuItem>

						<NavigationMenuItem>
							<NavigationMenuLink>
								{#snippet child()}
									<a
										href="/404"
										class={navigationMenuTriggerStyle({
											class: 'bg-transparent hover:bg-mantle data-[state=open]:bg-mantle'
										})}>404</a
									>
								{/snippet}
							</NavigationMenuLink>
						</NavigationMenuItem>
					</NavigationMenuList>
				</NavigationMenuRoot>
			</div>
		</div>
	</nav>
</header>

<main>
	<div class="py-5">
		<div class="mx-auto max-w-7xl px-6 lg:px-8">
			{@render children()}
		</div>
	</div>
</main>
