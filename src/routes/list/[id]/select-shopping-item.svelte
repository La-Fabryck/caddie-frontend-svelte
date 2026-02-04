<script lang="ts">
	import { page } from '$app/state';
	import type { Item } from '$lib/response/item';
	import { mutateData } from '$lib/fetch';
	import { buildApiUrl } from '$lib/helpers/url';
	import { debounce } from '$lib/helpers/debounce';
	import ItemCheckbox from './item-checkbox.svelte';

	type Props = {
		item: Item;
		invalidateItems: () => void;
	};

	let { item, invalidateItems }: Props = $props();

	// Writable derived: from item.isInCart, overridable on PATCH success; resyncs when item updates (e.g. after invalidate)
	// Question : Wouldn't this be a problem ? Do we need to reload every time ? Planning on moving to SSE anyway
	let isInCart = $derived(item.isInCart);

	const debouncedPatch = debounce(async (checked: boolean, currentItem: Item) => {
		if (currentItem.isInCart === checked) return;
		const url = buildApiUrl(page.url.origin, `list/${currentItem.listId}/items/${currentItem.id}`);
		const result = await mutateData<Item>({
			fetch,
			url: url.toString(),
			method: 'PATCH',
			body: { isInCart: checked }
		});
		if (result.data != null) {
			isInCart = checked;
			invalidateItems();
		}
	});

	function handleChange(checked: boolean) {
		debouncedPatch(checked, item);
	}
</script>

<ItemCheckbox {item} checked={isInCart} onChange={handleChange} />
