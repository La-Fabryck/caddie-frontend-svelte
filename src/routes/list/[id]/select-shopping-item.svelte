<script lang="ts">
	import { mutateData } from '#lib/fetch/index.js';
	import { debounce } from '#lib/helpers/debounce.js';
	import { buildApiUrl } from '#lib/helpers/url.js';
	import type { Item } from '#lib/response/item.js';
	import { page } from '$app/state';
	import ItemCheckbox from './item-checkbox.svelte';

	type Props = {
		item: Item;
		invalidateItems: () => void;
	};

	let { item, invalidateItems }: Props = $props();

	// Derived from server state, but assignable for optimistic UI (see Svelte “Overriding derived values”).
	// handleChange assigns before the debounced PATCH so the checkbox updates immediately.
	let isInCart = $derived(item.isInCart);

	const debouncedPatch = debounce(async (checked: boolean, currentItem: Item) => {
		if (currentItem.isInCart === checked) return;
		const url = buildApiUrl(page.url.origin, `list/${currentItem.listId}/items/${currentItem.id}`);
		const result = await mutateData<Item>({
			fetch,
			url: url.toString(),
			method: 'PATCH',
			body: { isInCart: checked },
		});
		if (result.data != null) {
			invalidateItems();
		}
	});

	function handleChange(checked: boolean) {
		isInCart = checked;
		debouncedPatch(checked, item);
	}
</script>

<ItemCheckbox {item} checked={isInCart} onChange={handleChange} />
