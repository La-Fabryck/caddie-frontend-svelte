<script lang="ts">
	import { page } from '$app/state';
	import type { Item } from '$lib/response/item';
	import { buildApiUrl } from '$lib/helpers/url';
	import ItemCheckbox from './item-checkbox.svelte';

	export type ItemToDeleteTuple = [string, () => Promise<void>];

	type Props = {
		item: Item;
		itemsToDelete: ItemToDeleteTuple[];
		onItemsToDeleteChange: (items: ItemToDeleteTuple[]) => void;
	};

	let { item, itemsToDelete, onItemsToDeleteChange }: Props = $props();

	async function doDelete() {
		const url = buildApiUrl(page.url.origin, `list/${item.listId}/items/${item.id}`);
		await fetch(url.toString(), { method: 'DELETE' });
	}

	const isChecked = $derived(itemsToDelete.some(([id]) => id === item.id));

	function handleChange(checked: boolean) {
		if (checked) {
			onItemsToDeleteChange([...itemsToDelete, [item.id, doDelete]]);
		} else {
			onItemsToDeleteChange(itemsToDelete.filter(([id]) => id !== item.id));
		}
	}
</script>

<ItemCheckbox {item} checked={isChecked} onChange={handleChange} />
