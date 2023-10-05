<script lang="ts">
	import { dbChangesChannelStore } from '$lib/stores/db-changes-channel.js';
	import { getSupabaseContext } from '$lib/stores/supabase-sdk.js';
	import type { RealtimeChannel, RealtimeClient, RealtimePostgresChangesPayload } from '@supabase/supabase-js';

	export let channelName: string = 'any';
	export let event: "*" | "INSERT" | "UPDATE" | "DELETE"  = '*';
    export let schema: string = '*';
    export let table: string | null = null;
    export let filter: string | null = null;

	const realtime = getSupabaseContext().realtime!;
	const channel = dbChangesChannelStore(realtime, channelName, event, schema, table, filter);
	
	interface $$Slots {
		default: {
			payload: RealtimePostgresChangesPayload<Record<string, unknown>> | null;
			error: Error | null;
			realtime: RealtimeClient;
            channel: RealtimeChannel | null;
		};
		loading: {};
	}
</script>

{#if $channel}
	<slot payload={$channel.data} {realtime} error={$channel.error} channel={channel.channel} />
{:else}
	<slot name="loading" />
{/if}
