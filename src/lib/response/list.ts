import type { DateString } from '$lib/helpers/date';

export type List = {
	id: string;
	title: string;
	createdAt: DateString;
	updatedAt: DateString;
};
