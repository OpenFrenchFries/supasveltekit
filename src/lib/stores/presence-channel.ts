import { readable } from 'svelte/store';
import type { RealtimeChannel, RealtimeClient, RealtimePresenceState } from '@supabase/supabase-js';

type PresenceStateStoreValue<T extends Record<string, unknown>> = {
	data: RealtimePresenceState<T> | null;
	error: Error | null;
};

interface PresenceChannelStore<T extends Record<string, unknown>> {
	subscribe: (cb: (value: PresenceStateStoreValue<T>) => void) => void | (() => void);
    channel: RealtimeChannel | null;
}

export function presenceStateStore<T extends Record<string, unknown>>(
	realtime: RealtimeClient,
	channelName: string,
	userStatus: T = {} as T,
): PresenceChannelStore<T> {
	// SSR
	if (!globalThis.window) {
		const { subscribe } = readable({ data: null, error: null });
		return {
			subscribe,
            channel: null
		};
	}

	//If realtime is not initialized, return a dummy store
	if (!realtime) {
		console.warn('Realtime is not initialized. Did you forget to create a `supabase` instance?');
		const { subscribe } = readable({ data: null, error: new Error('Realtime is not initialized') });
		return {
			subscribe,
            channel: null
		};
	}

    const channel = realtime.channel(channelName);

	const { subscribe } = readable<PresenceStateStoreValue<T>>({ data: null, error: null }, (set) => {
		const subscription = channel
			.on("presence", { event: "sync" }, () => {
                set({ data: channel.presenceState(), error: null })
            })
			.subscribe((status) => {
				switch (status) {
					case 'SUBSCRIBED':
						channel.track(userStatus);
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
