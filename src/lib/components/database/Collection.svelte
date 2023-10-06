<script lang="ts">
	import { selectStore } from '$lib/stores/database.js';
	import { dbChangesChannelStore } from '$lib/stores/db-changes-channel.js';
	import { getSupabaseContext } from '$lib/stores/supabase-sdk.js';

	export let realtime: boolean = false;
	export let refreshKey = "id";
    export let table: string;
    export let query: string = "*";
	export let head: boolean = false
	export let schema: string = 'public';
    export let count: 'exact' | 'planned' | 'estimated' | undefined = undefined;

	const client = getSupabaseContext().client!;
	const store = selectStore(client, table, query, head, count);

	/**
	 * If realtime is enabled, this code sets up subscriptions to listen for changes to the specified table in the Supabase database.
	 * When a row is deleted, it is removed from the store. When a row is inserted, it is added to the store. When a row is updated, it is upgraded in the store.
	 */
	if(realtime){
		const realtime = getSupabaseContext().realtime!;
		
		dbChangesChannelStore(realtime, crypto.randomUUID(), 'DELETE', schema, table, null).subscribe((payload: any) => {
			if(payload?.data?.old){
				store.delete((data: any) => data[refreshKey] === payload.data?.old?.[refreshKey]);
			}
		});

		dbChangesChannelStore(realtime, crypto.randomUUID(), 'INSERT', schema, table, null).subscribe((payload: any) => {
			if(payload?.data?.new){
				store.add(payload.data?.new);
			}
		});

		dbChangesChannelStore(realtime, crypto.randomUUID(), 'UPDATE', schema, table, null).subscribe((payload: any) => {
			if(payload?.data?.new){
				store.upgrade((data: any) => data[refreshKey] === payload.data?.new?.[refreshKey] ? payload.data?.new : data);
			}
		});
	}
	interface $$Slots {
		default: {
			payload: any | null;
			error: Error | null;
		};
		loading: {};
	}
</script>

{#if $store}
	<slot payload={$store.data} error={$store.error} />
{:else}
	<slot name="loading" />
{/if}
