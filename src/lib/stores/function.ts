import { readable } from 'svelte/store';
import type { FunctionsClient } from '@supabase/functions-js';

type FunctionStoreValue<T> = {
	data: T | null;
	error: Error | null;
};

interface FunctionStore<T> {
	subscribe: (cb: (value: FunctionStoreValue<T>) => void) => void | (() => void);
}

export function functionCallStore<T>(
	functionClient: FunctionsClient,
	functionName: string,
	headers?: any,
    payload?: any,
): FunctionStore<T> {
	// SSR
	if (!globalThis.window) {
		const { subscribe } = readable({ data: null, error: null });
		return {
			subscribe,
		};
	}

	//If function is not initialized, return a dummy store
	if (!functionClient) {
		console.warn('Function is not initialized. Did you forget to create a `supabase` instance?');
		const { subscribe } = readable({ data: null, error: new Error('Function is not initialized') });
		return {
			subscribe,
		};
	}

	const { subscribe } = readable<FunctionStoreValue<T>>({ data: null, error: null }, (set) => {
		functionClient.invoke(functionName, { body: payload, headers })
		.then(({ data, error }) => {
			console.log(data);
            set({ data, error });
        }).catch((error) => {
			console.error(error);
			set({ data: null, error });
		});
	});

	return {
		subscribe,
	};
}
