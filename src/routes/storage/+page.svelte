<script lang="ts">
    import BucketFilesList from '$lib/components/BucketFilesList.svelte';
</script>

<BucketFilesList bucketName="test-bucket" path="public" let:bucketFiles let:error>
    {#if error !== null}
        <div>{error}</div>
    {/if}
    {#each bucketFiles as file}
        <h2 data-testid="bucket-name">{file.name}</h2>
    {/each}
</BucketFilesList>
