/**
 * Backend errors: { "email": [{ "message": "INVALID_EMAIL" }], "root": [...] }
 * Maps to superforms ValidationErrors via errorMessages (key → display string).
 */
const DEFAULT_MESSAGE = 'Une erreur est survenue.';

type ErrorMessage = { message: string };
type DefaultKeys = `root.${string}` | 'root';

type ErrorKeys<T> = keyof T | DefaultKeys;

/** Backend error shape */
export type BackendFormErrors<T> = Record<ErrorKeys<T>, ErrorMessage[]>;

/** Superforms: each key maps to string[] (field errors or _errors for form-level). */
export type ValidationErrorsLike = Record<string, string[]>;

export function backendErrorsToFormErrors<T extends Record<string, unknown>>(
	error: BackendFormErrors<T>,
	errorMessages: Record<string, string>
): ValidationErrorsLike {
	const out: ValidationErrorsLike = {};

	for (const [key, value] of Object.entries(error)) {
		const messageKey = value.find((item) => item.message != null)?.message;
		const message =
			messageKey != null ? (errorMessages[messageKey] ?? DEFAULT_MESSAGE) : DEFAULT_MESSAGE;
		if (key === 'root') {
			out._errors = [...(out._errors ?? []), message];
		} else {
			out[key] = [message];
		}
	}

	return out;
}
