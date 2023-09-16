import { readable } from 'svelte/store';
import type { RealtimeChannel, RealtimeClient } from '@supabase/supabase-js';

type BroadcastChannelStoreValue<T> = {
	data: T | null;
	error: Error | null;
};

interface BroadcastChannelStore<T> {
	subscribe: (cb: (value: BroadcastChannelStoreValue<T>) => void) => void | (() => void);
    channel: RealtimeChannel | null;
}

export function broadcastChannelStore<T>(
	realtime: RealtimeClient,
	channelName: string,
	eventName: string
): BroadcastChannelStore<T> {
	// SSR
	if (!globalThis.window) {
		const { subscribe } = readable({ data: null, error: null });
		return {
			subscribe,
            channel: null
		};
	}

	//If the auth is not initialized, return a dummy store
	if (!realtime) {
		console.warn('Realtime is not initialized. Did you forget to create a `supabase` instance?');
		const { subscribe } = readable({ data: null, error: new Error('Realtime is not initialized') });
		return {
			subscribe,
            channel: null
		};
	}

    const channel = realtime.channel(channelName);

	const { subscribe } = readable<BroadcastChannelStoreValue<T>>({ data: null, error: null }, (set) => {
		const subscription = channel
			.on('broadcast', { event: eventName }, (payload) => {
                console.log("Broadcast received:", payload);
                set({ data: payload as T, error: null })
            })
			.subscribe((status) => {
				switch (status) {
					case 'SUBSCRIBED':
						console.log('Connected to channel', channelName);
						break;
					case 'CLOSED':
						set({ data: null, error: new Error(`Channel ${channelName} closed`) });
						break;
					case 'CHANNEL_ERROR':
						set({ data: null, error: new Error(`Channel ${channelName} error`) });
						break;
					case 'TIMED_OUT':
						set({
							data: null,
							error: new Error(`Channel ${channelName} timed out after ${channel.timeout}ms`)
						});
						break;
				}
			});

		return () => {
			subscription.unsubscribe();
		};
	});

	return {
		subscribe,
        channel
	};
}
