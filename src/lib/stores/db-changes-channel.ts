import { readable } from 'svelte/store';
import type { RealtimeChannel, RealtimeClient } from '@supabase/supabase-js';

export type DbChangeEventTypes = "INSERT" | "UPDATE" | "DELETE" | "*";

export type DbChangeData<T> = {
	schema:string,
	table: string, 
	commit_timestamp:string,
	eventType: DbChangeEventTypes,
	new: T,
	old: T,
	errors: Error[]
}

type DbChangesStoreValue<T> = {
	data: DbChangeData<T> | null;
	error: Error | null;
};

interface DbChangesChannelStore<T> {
	subscribe: (cb: (value: DbChangesStoreValue<T>) => void) => void | (() => void);
    channel: RealtimeChannel | null;
}

export function dbChangesChannelStore<T>(
	realtime: RealtimeClient,
	channelName: string,
	event: string,
	schema: string,
	table: string | null,
	filter: string | null
): DbChangesChannelStore<T> {
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

	let params: Partial<{event: string, schema: string, table: string, filter: string}> = { event, schema };
	if(table) params = { ...params, table };
	if(filter) params = { ...params, filter };
    const channel = realtime.channel(channelName);

	const { subscribe } = readable<DbChangesStoreValue<T>>({ data: null, error: null }, (set) => {
		const subscription = channel
			.on('postgres_changes', params, (payload: DbChangeData<T>) => {
                set({ data: payload, error: null })
            })
			.subscribe((status) => {
				switch (status) {
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
