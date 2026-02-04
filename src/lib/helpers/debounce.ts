const DEFAULT_DELAY = 500;

export function debounce<A extends unknown[]>(
	func: (...args: A) => Promise<void>,
	delay = DEFAULT_DELAY
): (...args: A) => void {
	let timeout: ReturnType<typeof setTimeout>;

	return function (...args: A) {
		clearTimeout(timeout);
		timeout = setTimeout(() => {
			void func(...args);
		}, delay);
	};
}
