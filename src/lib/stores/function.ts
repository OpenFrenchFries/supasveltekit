import { readable, writable } from 'svelte/store';
import type { FunctionsClient } from '@supabase/functions-js';

type Payload = 
| string
| File
| Blob
| ArrayBuffer
| FormData
| ReadableStream<Uint8Array>
| Record<string, unknown>
| undefined

type FunctionStoreValue<T> = {
	data: T | null;
	error: Error | null;
};

interface FunctionStore<T> {
	subscribe: (cb: (value: FunctionStoreValue<T>) => void) => void | (() => void);
	refresh: () => Promise<void>;
}

interface IntervalFunctionStore<T> {
	subscribe: (cb: (value: FunctionStoreValue<T>) => void) => void | (() => void);
	stop: () => void;
}

interface DelayedFunctionStore<T> {
	subscribe: (cb: (value: FunctionStoreValue<T>) => void) => void | (() => void);
}

const defaultCb = () => {
	return Promise.resolve();
};

function functionCall<T>(
	functionClient: FunctionsClient,
	functionName: string,
	payload: Payload,
	headers: Record<string, string> | undefined,
	updateCb: (payload: { data: T | null; error: Error }) => void
) {
	return functionClient
		.invoke(functionName, { body: payload, headers })
		.then(({ data, error }) => {
			updateCb({ data, error });
		})
		.catch((error) => {
			updateCb({ data: null, error });
		});
}

export function functionCallStore<T>(
	functionClient: FunctionsClient,
	functionName: string,
	headers: Record<string, string> | undefined,
	payload: Payload,
): FunctionStore<T> {
	// SSR
	if (!globalThis.window) {
		const { subscribe } = writable({ data: null, error: null });
		return {
			subscribe,
			refresh: defaultCb
		};
	}

	//If function is not initialized, return a dummy store
	if (!functionClient) {
		console.warn('Function is not initialized. Did you forget to create a `supabase` instance?');
		const { subscribe } = writable({ data: null, error: new Error('Function is not initialized') });
		return {
			subscribe,
			refresh: defaultCb
		};
	}

	const { subscribe, update } = writable<FunctionStoreValue<T>>(
		{ data: null, error: null },
		(set) => {
			functionCall(functionClient, functionName, payload, headers, set);
		}
	);

	return {
		subscribe,
		refresh: () => {
			return functionCall(
				functionClient,
				functionName,
				payload,
				headers,
				(payload: { data: T | null; error: Error }) =>
					update(() => ({ data: payload.data, error: payload.error }))
			);
		}
	};
}

export function intervalFunctionCallStore<T>(
	functionClient: FunctionsClient,
	functionName: string,
	interval: number,
	headers: Record<string, string> | undefined,
	payload: Payload,
): IntervalFunctionStore<T> {
	const functionStore = functionCallStore<T>(functionClient, functionName, headers, payload);

	const intervalId = setInterval(() => {
		functionStore.refresh();
	}, interval);

	return {
		subscribe: (cb: (value: FunctionStoreValue<T>) => void) => {
			functionStore.subscribe(cb);

			return () => {
				clearInterval(intervalId);
			};
		},
		stop: () => {
			clearInterval(intervalId);
		}
	};
}

export function delayedFunctionCallStore<T>(
	functionClient: FunctionsClient,
	functionName: string,
	delay: number,
	headers: Record<string, string> | undefined,
	payload: Payload,
): DelayedFunctionStore<T> {
	// SSR
	if (!globalThis.window) {
		const { subscribe } = writable({ data: null, error: null });
		return {
			subscribe,
		};
	}

	//If function is not initialized, return a dummy store
	if (!functionClient) {
		console.warn('Function is not initialized. Did you forget to create a `supabase` instance?');
		const { subscribe } = writable({ data: null, error: new Error('Function is not initialized') });
		return {
			subscribe,
		};
	}

	const { subscribe } = readable<FunctionStoreValue<T>>(
		{ data: null, error: null },
		(set) => {
			const timeoutId = setTimeout(() => {
				functionCall(functionClient, functionName, payload, headers, set);
				clearTimeout(timeoutId);
			}, delay);

			return () => {
                clearTimeout(timeoutId);
            };
		}
	);

	return {
		subscribe,
	};
}

export function scheduledFunctionCallStore<T>(
	functionClient: FunctionsClient,
	functionName: string,
	date: Date,
	headers: Record<string, string> | undefined,
	payload: Payload,
): DelayedFunctionStore<T> {
	const delay = date.getTime() - Date.now();
	return delayedFunctionCallStore<T>(functionClient, functionName, delay, headers, payload);
}