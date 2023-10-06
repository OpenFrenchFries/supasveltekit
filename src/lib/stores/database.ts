import { readable, writable } from 'svelte/store';
import type {PostgrestSingleResponse, SupabaseClient } from '@supabase/supabase-js';

export type DbChangeEventTypes = "INSERT" | "UPDATE" | "DELETE" | "*";

type DbSelectValue<T> = {
	data: T[] | T | null;
	error: Error | null;
};

interface DbSelectStore<T> {
	subscribe: (cb: (value: DbSelectValue<T>) => void) => void | (() => void);
	delete: (deleteCb: (data: T) => boolean) => void;
	add: (data: T) => void;
	upgrade: (updateCb: (data: T) => T) => void;
}

export function selectStore<T>(
	client: SupabaseClient,
	table: string,
    query: string,
	head: boolean,
    count: 'exact' | 'planned' | 'estimated' | undefined
): DbSelectStore<T> {
	// SSR
	if (!globalThis.window) {
		const { subscribe } = readable({ data: null, error: null });
		return {
			subscribe,
			delete: () => { return },
			add: () => { return },
			upgrade: () => { return }
		};
	}

	//If supabase is not initialized, return a dummy store
	if (!client) {
		console.warn('Client is not initialized. Did you forget to create a `supabase` instance?');
		const { subscribe } = readable({ data: null, error: new Error('Client is not initialized') });
		return {
			subscribe,
			delete: () => { return },
			add: () => { return },
			upgrade: () => { return }
		};
	}

    const queryBuilder = client.from(table);

	const { subscribe, update } = writable<DbSelectValue<T>>({ data: null, error: null }, (set) => {
		queryBuilder
			.select(query, { head, count })
			.then((data: PostgrestSingleResponse<unknown>) => {
				set({ data: Array.isArray(data.data) ? data.data as T[] : data.data as T, error: null });
			}, (error) => {
				set({ data: null, error });
			});
	});

	return {
		subscribe,
		add: (data: T) => {
			update((state) => {
				if (Array.isArray(state.data)) {
					return {data: [...state.data, data], error: null};
				} else if (state.data) {
					return {data: [state.data as T, data], error: null};
				} else {
					return {data, error: null};
				}
			});
		},
		upgrade(updateCb: (data: T) => T) {
			update((state) => {
				if (Array.isArray(state.data)) {
					return {data: (state.data as T[]).map(updateCb), error: null};
				} else if (state.data) {
					return {data: updateCb(state.data as T), error: null};
				}
				return state;
			});
		},
		delete: (deleteCb: (data: T) => boolean) => {
			update((state) => {
				if (Array.isArray(state.data)) {
					const data = state.data as T[];
					return {data: data.filter((d: T) => !deleteCb(d)), error: null};
				} else if (state.data && deleteCb(state.data as T)) {
					return {data: null, error: null};
				}
				return state;
			});
		}
	};
}
