import type { FormErrorsForSchema } from '$lib/helpers/form-errors';

/**
 * Add item form shape. No client-side validation; errors come from the backend.
 */
export type CreateItemSchema = {
	name: string;
};

export const initialCreateItemData: CreateItemSchema = {
	name: ''
};

/** Initial form state for superForm (SPA mode, no server validation). */
export function initialCreateItemForm() {
	return {
		id: '',
		valid: true,
		posted: false,
		errors: {} satisfies FormErrorsForSchema<CreateItemSchema>,
		data: initialCreateItemData
	};
}
