<script lang="ts">
	import { itemStore } from '$lib/stores/database.js';
	import { dbChangesChannelStore } from '$lib/stores/db-changes-channel.js';
	import { getSupabaseContext } from '$lib/stores/supabase-sdk.js';

	export let realtime: boolean = false;
	export let refKey = "id";
	export let refValue: unknown | null = null;
    export let table: string;
	export let schema: string = 'public';

	const client = getSupabaseContext().client!;
	const store = itemStore(client, table, refKey, refValue);

	/**
	 * If realtime is enabled, this code sets up subscriptions to listen for changes to the specified table in the Supabase database.
	 * When a row is deleted, it is removed from the store. When a row is inserted, it is added to the store. When a row is updated, it is upgraded in the store.
	 */
	if(realtime){
		const realtime = getSupabaseContext().realtime!;
		
		dbChangesChannelStore(realtime, crypto.randomUUID(), 'DELETE', schema, table, `${refKey}=eq.${refValue}`).subscribe((payload: any) => {
			if(payload?.data?.old){
				store.delete((data: any) => data?.[refKey] === payload?.data?.old?.[refKey] && data?.[refKey] === refValue);
			}
		});

		dbChangesChannelStore(realtime, crypto.randomUUID(), 'INSERT', schema, table, `${refKey}=eq.${refValue}`).subscribe((payload: any) => {
			if(payload?.data?.new){
				store.add(payload.data?.new);
			}
		});

		dbChangesChannelStore(realtime, crypto.randomUUID(), 'UPDATE', schema, table, `${refKey}=eq.${refValue}`).subscribe((payload: any) => {
			if(payload?.data?.new){
				store.upgrade((data: any) => payload.data?.new);
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
