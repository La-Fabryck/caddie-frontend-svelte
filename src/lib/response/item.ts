export type ItemTypeInItem = {
	id: string;
	label: string;
};

export type Item = {
	id: string;
	listId: string;
	name: string;
	quantity: number;
	isInCart: boolean;
	itemTypeId: string | null;
	itemType: ItemTypeInItem | null;
};
