import type { FormErrorsForSchema } from '$lib/helpers/form-errors';

/**
 * Create list form shape. No client-side validation; errors come from the backend.
 */
export type CreateListSchema = {
	title: string;
	pseudonym: string;
};

export const initialCreateListData: CreateListSchema = {
	title: '',
	pseudonym: ''
};

/** Initial form state for superForm (SPA mode, no server validation). */
export function initialCreateListForm() {
	return {
		id: '',
		valid: true,
		posted: false,
		errors: {} satisfies FormErrorsForSchema<CreateListSchema>,
		data: initialCreateListData
	};
}
