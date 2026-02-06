import type { FormErrorsForSchema } from '$lib/helpers/form-errors';
import type { Item } from '$lib/response/item';

/**
 * Edit item form shape. No client-side validation; errors come from the backend.
 */
export type EditItemSchema = {
	name: string;
	isInCart: boolean;
};

export function initialEditItemData(item: Item): EditItemSchema {
	return {
		name: item.name,
		isInCart: item.isInCart
	};
}

/** Initial form state for superForm (SPA mode, no server validation). */
export function initialEditItemForm(item: Item) {
	return {
		id: '',
		valid: true,
		posted: false,
		errors: {} satisfies FormErrorsForSchema<EditItemSchema>,
		data: initialEditItemData(item)
	};
}

export type InitialEditItemFormState = ReturnType<typeof initialEditItemForm>;
