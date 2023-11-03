<script lang="ts">
	import { functionCallStore } from '$lib/stores/function.js';
	import { getSupabaseContext } from '$lib/stores/supabase-sdk.js';
	import type { FunctionsClient } from '@supabase/functions-js';

	export let functionName: string = "";
	export let headers: any = undefined;
    export let body: any = undefined;

	const functions = getSupabaseContext().function!;
	const store = functionCallStore(functions, functionName, headers, body);
	
	interface $$Slots {
		default: {
			payload: any | null;
			error: Error | null;
			functions: FunctionsClient;
		};
		loading: {};
	}
</script>

{#if $store}
	<slot payload={$store.data} {functions} error={$store.error} />
{:else}
	<slot name="loading" />
{/if}
