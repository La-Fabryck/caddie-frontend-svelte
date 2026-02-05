/**
 * Login form shape. No client-side validation; errors come from the backend.
 */
export type LoginSchema = {
	email: string;
	password: string;
};

export const initialLoginData: LoginSchema = {
	email: '',
	password: ''
};

/** Initial form state for superForm (SPA mode, no server validation). */
export function initialLoginForm() {
	return {
		id: '',
		valid: true,
		posted: false,
		errors: {} as Record<keyof LoginSchema | '_errors', string[] | undefined>,
		data: initialLoginData
	};
}
