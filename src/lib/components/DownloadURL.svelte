<script lang="ts">
	import { downloadURLStore } from '$lib/stores/bucket.js';
	import { getSupabaseContext } from '$lib/stores/supabase-sdk.js';
	import type { StorageClient } from '@supabase/storage-js';

	export let bucketName: string;
	export let path: string = '';
	export let expiration: number = 60;

	const storage = getSupabaseContext().storage!;
	const downloadUrl = downloadURLStore(storage, bucketName, path, expiration);
	
	interface $$Slots {
		default: {
			url: string | null;
			error: Error | null;
			storage: StorageClient;
		};
	}
</script>

{#if $downloadUrl}
	<slot url={$downloadUrl.data} {storage} error={$downloadUrl.error} />
{/if}