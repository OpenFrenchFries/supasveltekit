<script lang="ts">
    import BucketFilesList from '$lib/components/storage/BucketFilesList.svelte';
    import BucketsList from '$lib/components/storage/BucketsList.svelte';
    import DownloadURL from '$lib/components/storage/DownloadURL.svelte';
	import BucketContext from '$lib/components/storage/BucketContext.svelte';
	import Uploader from '$lib/components/storage/Uploader.svelte';
    import { getSupabaseContext } from '$lib/stores/supabase-sdk.js';

    let file: File | null = null;
    let options = { cacheControl: '3600', upsert: false };
    const storage = getSupabaseContext().storage!;

	function createFile() {
        options.upsert = true;
		file = new File(["Goodbye, world!"], "goodbye.txt", { type: "text/plain" });
	}

    function createDuplicate() {
        options.upsert = false;
		file = new File(["Hello, world!"], "hello.txt", { type: "text/plain" });
	}
</script>

<BucketsList let:buckets let:error>
    <h1>Buckets</h1>
    {#if buckets !== null}
        {#each buckets as bucket}
            <h2 data-testid="bucket-name">{bucket.name}</h2>
            <BucketFilesList bucketName={bucket.name} path="public/" let:bucketFiles let:error>
                {#if error !== null}
                    <div>{error}</div>
                {/if}
                <ul>
                    {#each bucketFiles as file}
                        <li data-testid="{file.name}">
                            <DownloadURL bucketName={bucket.name} path={"public/" + file.name} let:url let:error>
                                {#if error !== null}
                                    <div>{error}</div>
                                {/if}
                                {#if url !== null}
                                    <a href="{url}" download="{file.name}">{file.name}</a>
                                {/if}
                            </DownloadURL>
                        </li>
                    {/each}
                </ul>
            </BucketFilesList>
        {/each}
    {/if}
    {#if error !== null}
        <div>{error}</div>
    {/if}
</BucketsList>

<BucketContext bucketName="test-bucket" path="public/">
    <input type="file" on:change={(e) => file = e?.currentTarget?.files?.[0] ?? null}/>
    <button on:click={createFile}>Create file</button>
    <button on:click={createDuplicate}>Duplicate hello.txt</button>

    {#if file}
        <Uploader {file} {options} let:uploadedFile let:error>
            {#if error}
                <div data-testid="upload-error">{error.message}</div>
            {/if}
            {#if uploadedFile}
                <div data-testid="upload-filename">{uploadedFile}</div>
            {/if}
        </Uploader>
    {/if}
</BucketContext>