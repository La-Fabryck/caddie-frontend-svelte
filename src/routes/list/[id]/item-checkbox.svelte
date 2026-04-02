<script lang="ts">
	import { Checkbox } from '$lib/components/ui';
	import type { Item } from '$lib/response/item';

	type Props = {
		item: Item;
		checked: boolean;
		onChange: (checked: boolean) => void;
	};

	let { item, checked, onChange }: Props = $props();

	// bits-ui can report "indeterminate" (third state: neither fully checked nor unchecked), e.g. for
	// “select all” rows. This list row is strictly boolean, so we ignore it.
	function handleCheckedChange(v: boolean | 'indeterminate') {
		if (v === 'indeterminate') return;
		onChange(v);
	}
</script>

<li
	class="flex w-full list-none items-center rounded-lg p-0 transition-all hover:bg-surface1 focus:bg-slate-100 active:bg-slate-100"
>
	<label
		for={item.id}
		class="flex w-full cursor-pointer items-center px-3 py-2"
		aria-labelledby="label-{item.id}"
	>
		<div class="inline-flex items-center">
			<Checkbox
				id={item.id}
				class="size-5 shrink-0 cursor-pointer border-pink shadow-sm transition-shadow hover:shadow-md focus-visible:border-pink focus-visible:ring-pink/40 data-[state=checked]:border-pink data-[state=checked]:bg-pink data-[state=checked]:text-crust dark:bg-input/30 dark:data-[state=checked]:border-pink dark:data-[state=checked]:bg-pink"
				{checked}
				onCheckedChange={handleCheckedChange}
				aria-labelledby="label-{item.id}"
			/>
			<span id="label-{item.id}" class="ml-2 cursor-pointer text-sm">{item.name}</span>
		</div>
	</label>
</li>
