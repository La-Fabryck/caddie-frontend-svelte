<script lang="ts">
	import { goto } from '$app/navigation';
	import { resolve } from '$app/paths';

	type Props = {
		listId: string;
		items: unknown[] | null;
	};

	let { listId, items }: Props = $props();

	$effect(() => {
		if (items?.length === 0) {
			goto(resolve(`/list/${listId}/items/add`));
		}
	});
</script>
