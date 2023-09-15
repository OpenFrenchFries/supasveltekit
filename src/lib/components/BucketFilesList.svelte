<script lang="ts">
	import { bucketFilesListStore } from '$lib/stores/bucket.js';
	import { getBucketContext, getSupabaseContext } from '$lib/stores/supabase-sdk.js';
	import type { FileObject, StorageClient } from '@supabase/storage-js';

	export let bucketName: string = getBucketContext()?.bucketName;
	export let path: string = getBucketContext()?.path;

	const storage = getSupabaseContext().storage!;
	const bucketFiles = bucketFilesListStore(storage, bucketName, path);
	
	interface $$Slots {
		default: {
			bucketFiles: FileObject[];
			error: Error | null;
			storage: StorageClient;
		};
	}
</script>

{#if $bucketFiles}
	<slot bucketFiles={$bucketFiles.data} {storage} error={$bucketFiles.error} />
{/if}
