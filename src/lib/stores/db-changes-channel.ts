import { readable } from 'svelte/store';
import type { RealtimeChannel, RealtimeClient, RealtimePostgresChangesFilter, RealtimePostgresChangesPayload } from '@supabase/supabase-js';

export type DbChangeEventTypes = "INSERT" | "UPDATE" | "DELETE" | "*";

type DbChangesStoreValue<T extends Record<string, unknown>> = {
	data: RealtimePostgresChangesPayload<T> | null;
	error: Error | null;
};

interface DbChangesChannelStore<T extends Record<string, unknown>> {
	subscribe: (cb: (value: DbChangesStoreValue<T>) => void) => void | (() => void);
    channel: RealtimeChannel | null;
}

export function dbChangesChannelStore<T extends Record<string, unknown>, EventType extends "*" | "INSERT" | "UPDATE" | "DELETE">(
	realtime: RealtimeClient,
	channelName: string,
	event: EventType,
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

	let params: Partial<RealtimePostgresChangesFilter<EventType>> = { event, schema };
	
	if(table) { 
		params = { ...params, table };
	}
	if(filter) {
		params = { ...params, filter };
	}

    const channel = realtime.channel(channelName);

	const { subscribe } = readable<DbChangesStoreValue<T>>({ data: null, error: null }, (set) => {
		const subscription = channel
			.on('postgres_changes', params, (payload: RealtimePostgresChangesPayload<T>) => {
                set({ data: payload, error: null })
            })
			.subscribe((status) => {
				switch (status) {
					case 'CLOSED':
					case 'CHANNEL_ERROR':
					case 'TIMED_OUT':
						set({
							data: null,
							error: new Error(`Channel error: ${channelName} - ${status}`)
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
