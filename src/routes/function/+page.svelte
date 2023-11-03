<script lang="ts">
	import FunctionCall from "$lib/components/function/FunctionCall.svelte";	
</script>

<FunctionCall functionName="get-time" let:payload let:error>
    {#if payload}
        <h1>The time is {payload.time}</h1>
    {:else if error}
        <h1>There was an error: {JSON.stringify(error)}</h1>
    {:else}
        <h1>Loading...</h1>
    {/if}
</FunctionCall>