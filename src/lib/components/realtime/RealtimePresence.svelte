<script lang="ts">
	import { presenceStateStore, userStatusStore } from '$lib/stores/presence-channel.js';
	import { getSupabaseContext } from '$lib/stores/supabase-sdk.js';
	import type { RealtimeChannel, RealtimeChannelOptions, RealtimeClient, RealtimePresenceState } from '@supabase/supabase-js';
	import { createEventDispatcher } from 'svelte';

	export let channelName: string = 'any';
	export let userStatus: Record<string, any> | undefined = undefined;
	export let channelOptions: RealtimeChannelOptions | undefined = undefined;

	const dispatcher = createEventDispatcher();

	const realtime = getSupabaseContext().realtime!;
	const store = presenceStateStore<Record<string, any>>(realtime, channelName, channelOptions, userStatus);

	const status = userStatusStore(store.channel!, userStatus);

	$: store?.channel
		?.on('presence', { event: 'join' }, ({ key, newPresences }) => {
			dispatcher('join', { key, newPresences });
		})
		?.on('presence', { event: 'leave' }, ({ key, leftPresences }) => {
			dispatcher('leave', { key, leftPresences });
		})
		

	interface $$Slots {
		default: {
			state: RealtimePresenceState<any> | null;
			error: Error | null;
			realtime: RealtimeClient;
			channel: RealtimeChannel | null;
			updateStatus: (status: Record<string, any>) => void;
		};
	}
</script>

{#if $store && $status}
	<slot state={$store.data} {realtime} error={$store.error} channel={store.channel} updateStatus={status.updateStatus} />
{/if}
