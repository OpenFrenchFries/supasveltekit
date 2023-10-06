<script lang="ts">
	import Collection from "$lib/components/database/Collection.svelte";
	import { supabase } from "../constants.js";

    const table = "test";
</script>

<Collection table={table} let:payload let:error realtime={true}>
    {#if !payload}
        <p>Loading...</p>
    {:else if error}
        <p>{error.message}</p>
    {:else}
        <p>Count: <strong data-testid="items-count">{payload.length}</strong></p>
        {#each payload as entry}
            <p class="items">ID: {entry.id} Created at {entry.created_at}</p>
        {/each}
    {/if}
    <div slot="loading">
        <p>Loading...</p>
    </div>

    <button on:click={async () => {
        await supabase
            .from(table)
            .insert({})
    }}>Insert data in DB</button>

    <button on:click={async () => {
        await supabase
            .from(table)
            .delete()
            .eq('id', payload[0].id)
    }}>Delete data in DB</button>

    <button on:click={async () => {
        await supabase
            .from(table)
            .update({created_at: ((new Date()).toISOString()).toLocaleString()})
            .eq('id', payload[0].id)
    }}>Update data in DB</button>
</Collection>