import { readable, writable, type Writable } from 'svelte/store';
import type {PostgrestSingleResponse, SupabaseClient } from '@supabase/supabase-js';

export type DbChangeEventTypes = "INSERT" | "UPDATE" | "DELETE" | "*";

type ArrayOrSingle<T> = T[] | T | null;

type DbValue<T> = {
	data: ArrayOrSingle<T>;
	error: Error | null;
};

interface DbItemsStore<T> {
	subscribe: (cb: (value: DbValue<T>) => void) => void | (() => void);
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
): DbItemsStore<T> {
	return dbStore(client, () => {
		const queryBuilder = client.from(table);
	
		return writable<DbValue<T>>({ data: null, error: null }, (set) => {
			queryBuilder
				.select(query, { head, count })
				.then((data: PostgrestSingleResponse<unknown>) => {
					set({ data: Array.isArray(data.data) ? data.data as T[] : data.data as T, error: null });
				}, (error) => {
					set({ data: null, error });
				});
		});
	})
}

export function itemStore<T>(
	client: SupabaseClient,
	table: string,
    refKey: string,
	refValue: unknown | null
): DbItemsStore<T> {
	return dbStore(client, () => {
		const queryBuilder = client.from(table);

		return writable<DbValue<T>>({ data: null, error: null }, (set) => {
			queryBuilder
				.select()
				.eq(refKey, refValue)
				.then((data: PostgrestSingleResponse<unknown>) => {
					set({ data: Array.isArray(data.data) ? data.data as T[] : data.data as T, error: null });
				}, (error) => {
					set({ data: null, error });
				});
		});
	})
}



export function dbStore<T>(
	client: SupabaseClient,
    writableStoreBuilder: () => Writable<DbValue<T>>
): DbItemsStore<T> {
	// SSR
	if (!globalThis.window) {
		const { subscribe } = readable({ data: null, error: null });
		return {
			subscribe,
			delete: defaultCb,
			add: defaultCb,
			upgrade: defaultCb
		};
	}

	//If supabase is not initialized, return a dummy store
	if (!client) {
		console.warn('Client is not initialized. Did you forget to create a `supabase` instance?');
		const { subscribe } = readable({ data: null, error: new Error('Client is not initialized') });
		return {
			subscribe,
			delete: defaultCb,
			add: defaultCb,
			upgrade: defaultCb
		};
	}

	const { subscribe, update } = writableStoreBuilder();

	return {
		subscribe,
		add: (data: T) => {
			update((state) => ({
				data: insertIntoState(state.data, data),
				error: null
			}));
		},
		upgrade(updateCb: (data: T) => T) {
			update((state) => ({
				data: updateState(state.data, updateCb),
				error: null
			}));
		},
		delete: (deleteCb: (data: T) => boolean) => {
			update((state) => ({
				data: deleteFromState(state.data, deleteCb),
				error: null
			}));
		}
	};
}

function defaultCb(){return}

function deleteFromState<T>(state: ArrayOrSingle<T>, deleteCb: (data: T) => boolean): T | T[] | null {
	if (Array.isArray(state)) {
		const data = state as T[];
		return data.filter((d: T) => !deleteCb(d));
	} else if (deleteCb(state as T)) {
		return null;
	}
	return state;
}

function insertIntoState<T>(state: ArrayOrSingle<T>, data: T): T[] | T {
	if (Array.isArray(state)) {
		return [...state, data];
	}
	return data;
}

function updateState<T>(state: ArrayOrSingle<T>, updateCb: (data: T) => T): ArrayOrSingle<T> {
	if (Array.isArray(state)) {
		const data = state as T[];
		return data.map(updateCb);
	} else if (state) {
		return updateCb(state as T);
	}
	return state;
}