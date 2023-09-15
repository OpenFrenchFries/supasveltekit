<script lang="ts">
	import { uploadStore, type UploaderStore } from '$lib/stores/bucket.js';
	import { getBucketContext, getSupabaseContext } from '$lib/stores/supabase-sdk.js';
	import type { FileOptions, StorageClient } from '@supabase/storage-js';

	export let bucketName: string = getBucketContext()?.bucketName;
	export let path: string = getBucketContext()?.path;
	export let file: File | null;
	export let options: FileOptions | undefined = undefined;

	const storage = getSupabaseContext().storage!;

	let fileUploaderStore: UploaderStore;
	
	fileUploaderStore = uploadStore(storage, bucketName, path, file, options);
	
	interface $$Slots {
		default: {
			uploadedFile?: string | null;
			error?: Error | null;
			storage: StorageClient;
		};
	}
</script>

{#if !$fileUploaderStore}
	<slot {storage} />
{:else}
	<slot uploadedFile={$fileUploaderStore.data} error={$fileUploaderStore.error} {storage}/>
{/if}