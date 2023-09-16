<script lang="ts">
	/**
	 * DownloadURL component that retrieves a download URL for a file in a Supabase Storage bucket.
	 * @module DownloadURL
	 *
	 * @param {string} bucketName - The name of the bucket containing the file.
	 * @param {string} path - The path to the file in the bucket.
	 * @param {number} expiration - The number of seconds until the download URL expires.
	 *
	 * @slot default - The default slot that receives the download URL, storage client, and any errors.
	 *
	 * @example
	 * <DownloadURL bucketName="my-bucket" path="path/to/file.jpg" expiration={3600}>
	 *   <div slot="default" let:url let:storage let:error>
	 *     {#if url}
	 *       <a href={url} download>Download file</a>
	 *     {:else if error}
	 *       <p>Error: {error.message}</p>
	 *     {:else}
	 *       <p>Loading...</p>
	 *     {/if}
	 *   </div>
	 * </DownloadURL>
	 */

	import { downloadURLStore } from '$lib/stores/bucket.js';
	import { getSupabaseContext, getBucketContext } from '$lib/stores/supabase-sdk.js';
	import type { StorageClient } from '@supabase/storage-js';

	export let bucketName: string = getBucketContext()?.bucketName;
	export let path: string = getBucketContext()?.path;
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