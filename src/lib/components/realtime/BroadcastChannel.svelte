<script lang="ts">
	import { broadcastChannelStore } from '$lib/stores/channel.js';
	import { getSupabaseContext } from '$lib/stores/supabase-sdk.js';
	import type { RealtimeChannel, RealtimeClient } from '@supabase/supabase-js';

	export let channelName: string = 'any';
    export let eventName: string = 'sync';

	const realtime = getSupabaseContext().realtime!;
	const channel = broadcastChannelStore<Record<string, any>>(realtime, channelName, eventName);
	
	interface $$Slots {
		default: {
			payload: Record<string, any> | null;
			error: Error | null;
			realtime: RealtimeClient;
            channel: RealtimeChannel | null;
		};
	}
</script>

{#if $channel}
	<slot payload={$channel.data} {realtime} error={$channel.error} channel={channel.channel} />
{/if}
