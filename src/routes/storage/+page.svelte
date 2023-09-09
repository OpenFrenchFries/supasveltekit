<script lang="ts">
    import BucketList from '$lib/components/BucketList.svelte';
</script>

<BucketList let:bucketList let:error>
    {#if error}
        <div>{error}</div>
    {/if}
    {#each bucketList as bucket}
        <h2 data-testid="bucket-name">{bucket.name}</h2>
    {/each}
</BucketList>