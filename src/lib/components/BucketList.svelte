<script lang="ts">
	import { bucketListStore } from '$lib/stores/bucket.js';
	import { getSupabaseContext } from '$lib/stores/supabase-sdk.js';
	import type { Bucket, StorageClient } from '@supabase/storage-js';

	const storage = getSupabaseContext().storage!;
	const buckets = bucketListStore(storage);
	
	interface $$Slots {
		default: {
			bucketList: Bucket[];
			error: Error | null;
			storage: StorageClient;
		};
	}
</script>

{#if $buckets}
	<slot bucketList={$buckets.data} {storage} error={$buckets.error}} />
{/if}
