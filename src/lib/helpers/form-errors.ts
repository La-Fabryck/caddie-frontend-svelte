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

/** Superforms errors object shape for a given schema (field keys + _errors). Keys optional so {} is valid. */
export type FormErrorsForSchema<T extends Record<string, unknown>> = Partial<
	Record<keyof T | '_errors', string[]>
>;

export function backendErrorsToFormErrors<T extends Record<string, unknown>>(
	error: BackendFormErrors<T>,
	errorMessages: Record<string, string>
): FormErrorsForSchema<T> {
	const out: FormErrorsForSchema<T> = {};

	for (const [key, value] of Object.entries(error)) {
		const messageKey = value.find((item) => item.message != null)?.message;
		const message =
			messageKey != null ? (errorMessages[messageKey] ?? DEFAULT_MESSAGE) : DEFAULT_MESSAGE;
		if (key === 'root' || key.startsWith('root.')) {
			out._errors = [...(out._errors ?? []), message];
		} else {
			(out as Record<string, string[]>)[key] = [message];
		}
	}

	return out;
}
