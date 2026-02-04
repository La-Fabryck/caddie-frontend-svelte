<script lang="ts">
	import { SquareCheckBig, SquarePen, Trash } from '@lucide/svelte';
	import { Button } from '$lib/components/ui';
	import { cn } from '$lib/utils';

	export type Action = 'selection' | 'edition' | 'deletion';

	type Props = {
		action: Action;
		onActionChange: (value: Action) => void;
	};

	let { action, onActionChange }: Props = $props();

	const baseClass =
		'min-w-0 flex-1 shrink-0 rounded-none shadow-none first:rounded-l-md last:rounded-r-md focus:z-10 focus-visible:z-10 border-l-0 first:border-l';
</script>

<div
	class="group/toggle-group flex w-full items-center rounded-md border shadow-xs"
	role="group"
	aria-label="Mode"
>
	<Button
		variant="outline"
		size="lg"
		class={cn(baseClass, 'border', action === 'selection' && 'bg-accent text-accent-foreground')}
		aria-pressed={action === 'selection'}
		aria-label="selection"
		onclick={() => onActionChange('selection')}
	>
		<SquareCheckBig />
	</Button>
	<Button
		variant="outline"
		size="lg"
		class={cn(baseClass, action === 'edition' && 'bg-accent text-accent-foreground')}
		aria-pressed={action === 'edition'}
		aria-label="edition"
		onclick={() => onActionChange('edition')}
	>
		<SquarePen />
	</Button>
	<Button
		variant="outline"
		size="lg"
		class={cn(baseClass, action === 'deletion' && 'bg-accent text-accent-foreground')}
		aria-pressed={action === 'deletion'}
		aria-label="deletion"
		onclick={() => onActionChange('deletion')}
	>
		<Trash />
	</Button>
</div>
