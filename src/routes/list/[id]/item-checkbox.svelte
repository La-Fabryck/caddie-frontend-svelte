<script lang="ts">
	import type { Item } from '$lib/response/item';

	type Props = {
		item: Item;
		checked: boolean;
		onChange: (checked: boolean) => void;
	};

	let { item, checked, onChange }: Props = $props();
</script>

<!-- TODO: move to shadcn components -->
<li
	class="flex w-full list-none items-center rounded-lg p-0 transition-all hover:bg-surface1 focus:bg-slate-100 active:bg-slate-100"
>
	<label
		for={item.id}
		class="flex w-full cursor-pointer items-center px-3 py-2"
		aria-labelledby="label-{item.id}"
	>
		<div class="inline-flex items-center">
			<div class="relative flex cursor-pointer items-center">
				<input
					type="checkbox"
					class="peer border-pink checked:bg-pink h-5 w-5 cursor-pointer appearance-none rounded-sm border shadow-sm outline-hidden transition-all hover:shadow-md"
					id={item.id}
					aria-labelledby="label-{item.id}"
					{checked}
					onchange={(e) => onChange(e.currentTarget.checked)}
				/>
				<svg
					class="pointer-events-none absolute ml-1 hidden h-4 w-3 stroke-crust outline-hidden peer-checked:block"
					xmlns="http://www.w3.org/2000/svg"
					viewBox="0 0 24 24"
					fill="none"
					stroke="currentColor"
					stroke-width="4"
					stroke-linecap="round"
					stroke-linejoin="round"
				>
					<polyline points="20 6 9 17 4 12"></polyline>
				</svg>
			</div>
			<span id="label-{item.id}" class="ml-2 cursor-pointer text-sm">{item.name}</span>
		</div>
	</label>
</li>
