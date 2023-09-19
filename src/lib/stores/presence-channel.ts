import { readable, writable } from 'svelte/store';
import type { RealtimeChannel, RealtimeChannelOptions, RealtimeClient, RealtimePresenceState } from '@supabase/supabase-js';

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
	channelOptions: RealtimeChannelOptions | undefined = undefined,
	userStatus: T = {} as T
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

	const channel = realtime.channel(channelName, channelOptions);

	const { subscribe } = readable<PresenceStateStoreValue<T>>({ data: null, error: null }, (set) => {
		const subscription = channel
			.on('presence', { event: 'sync' }, () => {
				set({ data: channel.presenceState(), error: null });
			})
			.subscribe((status) => {
				switch (status) {
					case 'SUBSCRIBED':
						channel.track(userStatus);
						break;
					case 'CLOSED':
					case 'CHANNEL_ERROR':
					case 'TIMED_OUT':
						set({ data: null, error: new Error(`Channel ${channelName} error: ${status}`) });
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

type UserStatusStoreValue<T extends Record<string, unknown>> = {
	data: T | null;
	error: Error | null;
};

interface UserStatusStore<T extends Record<string, unknown>> {
	subscribe: (cb: (value: UserStatusStoreValue<T>) => void) => void | (() => void);
	updateStatus: (status: T) => void;
}

export function userStatusStore<T extends Record<string, unknown>>(
	channel: RealtimeChannel,
	userStatus: T = {} as T
): UserStatusStore<T> {
	// SSR
	if (!globalThis.window) {
		const { subscribe } = readable({ data: null, error: null });
		return {
			subscribe,
			updateStatus: () => {
				throw new Error('Not implemented');
			}
		};
	}

	//If channel is not initialized, return a dummy store
	if (!channel) {
		console.warn('Channel is not initialized. Did you forget to create a `channel` instance?');
		const { subscribe } = readable({ data: null, error: new Error('Channel is not initialized') });
		return {
			subscribe,
			updateStatus: () => {
				throw new Error('Not implemented');
			}
		};
	}

	const { subscribe, update } = writable<UserStatusStoreValue<T>>(
		{ data: userStatus, error: null }
	);

	return {
		subscribe,
		updateStatus: (status: T) => {
			update((previous) => {
				if (!status) {
					return previous;
				}
				const newValues = {...previous.data, ...status};
				channel.track(newValues);
				return { data: newValues, error: null };
			});
		}
	};
}
