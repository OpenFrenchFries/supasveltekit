import { readable, writable } from 'svelte/store';
import type {PostgrestSingleResponse, SupabaseClient } from '@supabase/supabase-js';
import { error } from '@sveltejs/kit';

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

function deleteFromState<T>(state: T[] | T | null, deleteCb: (data: T) => boolean): T | T[] | null {
	if (Array.isArray(state)) {
		const data = state as T[];
		return data.filter((d: T) => !deleteCb(d));
	} else if (deleteCb(state as T)) {
		return null;
	}
	return state;
}

function insertIntoState<T>(state: T[] | T | null, data: T): T[] | T {
	if (Array.isArray(state)) {
		return [...state, data];
	}
	return data;
}

function updateState<T>(state: T[] | T | null, updateCb: (data: T) => T): T[] | T | null {
	if (Array.isArray(state)) {
		const data = state as T[];
		return data.map(updateCb);
	} else if (state) {
		return updateCb(state as T);
	}
	return state;
}