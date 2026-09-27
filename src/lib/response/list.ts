import type { DateString } from '$lib/helpers/date';

/** Backend min for GET /list `limit` is 10. */
export const LIST_PAGE_LIMIT = 10;

export type List = {
	id: string;
	title: string;
	isArchived: boolean;
	createdAt: DateString;
	updatedAt: DateString;
};

export type PaginatedLists = {
	items: List[];
	total: number;
	limit: number;
	offset: number;
};
