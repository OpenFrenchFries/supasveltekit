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
¨