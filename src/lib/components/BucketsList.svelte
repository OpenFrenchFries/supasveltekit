## BucketsList.svelte

This component displays a list of buckets retrieved from Supabase Storage. It uses the `bucketsListStore` store to fetch the list of buckets and the `getSupabaseContext` function to get the Supabase Storage client.

### Props

This component has no props.

### Slots

This component has one slot named `default` which accepts the following props:

- `buckets`: An array of `Bucket` objects representing the list of buckets.
- `error`: An `Error` object representing any error that occurred while fetching the list of buckets.
- `storage`: A `StorageClient` object representing the Supabase Storage client.

### Example
<script lang="ts">
	import { bucketsListStore } from '$lib/stores/bucket.js';
	import { getSupabaseContext } from '$lib/stores/supabase-sdk.js';
	import type { Bucket, StorageClient } from '@supabase/storage-js';

	const storage = getSupabaseContext().storage!;
	const buckets = bucketsListStore(storage);
	
	interface $$Slots {
		default: {
			buckets: Bucket[];
			error: Error | null;
			storage: StorageClient;
		};
	}
</script>

{#if $buckets}
	<slot buckets={$buckets.data} {storage} error={$buckets.error} />
{/if}
