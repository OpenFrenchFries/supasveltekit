<script lang="ts">
    import BucketFilesList from '$lib/components/BucketFilesList.svelte';
    import BucketsList from '$lib/components/BucketsList.svelte';
    import DownloadURL from '$lib/components/DownloadURL.svelte';
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