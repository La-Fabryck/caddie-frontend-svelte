import type { FormErrorsForSchema } from '$lib/helpers/form-errors';

/**
 * Create account form shape. No client-side validation; errors come from the backend.
 */
export type CreateAccountSchema = {
	email: string;
	name: string;
	password: string;
};

export const initialCreateAccountData: CreateAccountSchema = {
	email: '',
	name: '',
	password: ''
};

/** Initial form state for superForm (SPA mode, no server validation). */
export function initialCreateAccountForm() {
	return {
		id: '',
		valid: true,
		posted: false,
		errors: {} satisfies FormErrorsForSchema<CreateAccountSchema>,
		data: initialCreateAccountData
	};
}
