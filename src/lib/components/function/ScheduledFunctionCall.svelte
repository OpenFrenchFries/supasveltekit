<script lang="ts">
	import { scheduledFunctionCallStore } from '$lib/stores/function.js';
	import { getSupabaseContext } from '$lib/stores/supabase-sdk.js';
	import type { FunctionsClient } from '@supabase/functions-js';

	export let functionName: string = "";
	export let headers: any = undefined;
    export let body: any = undefined;
	export let date: Date = new Date();

	const functions = getSupabaseContext().function!;

	const store = scheduledFunctionCallStore(functions, functionName, date, headers, body);
	
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
