<script lang="ts">
	import { presenceStateStore } from '$lib/stores/presence-channel.js';
	import { getSupabaseContext } from '$lib/stores/supabase-sdk.js';
	import type { RealtimeChannel, RealtimeClient, RealtimePresenceState } from '@supabase/supabase-js';
	import { createEventDispatcher } from 'svelte';

	export let channelName: string = 'any';
	export let userStatus: Record<string, any> | undefined = undefined;

	const dispatcher = createEventDispatcher();

	const realtime = getSupabaseContext().realtime!;
	const store = presenceStateStore<Record<string, any>>(realtime, channelName, userStatus);

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
		};
	}
</script>

{#if $store}
	<slot state={$store.data} {realtime} error={$store.error} channel={store.channel} />
{/if}
