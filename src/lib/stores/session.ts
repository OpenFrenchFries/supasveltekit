import { readable } from 'svelte/store';
import type { SupabaseAuthClient } from '@supabase/supabase-js/dist/module/lib/SupabaseAuthClient.js';
import type { Session } from '@supabase/supabase-js';

type SessionStoreValue = {
    data: Session | null;
    error: Error | null;
};

interface SessionStore {
    subscribe: (cb: (value: SessionStoreValue) => void) => void | (() => void);
}

export function sessionStore(auth: SupabaseAuthClient): SessionStore {

	// SSR
	if (!globalThis.window) {
		const { subscribe } = readable({ data: null, error: null });
		return {
			subscribe
		};
	}

	//If the auth is not initialized, return a dummy store
	if (!auth) {
		console.warn(
			'Auth is not initialized. Did you forget to create a `supabase` instance?'
		);
		const { subscribe } = readable({ data: null, error: new Error('Auth is not initialized') });
		return {
			subscribe
		};
	}

	const { subscribe } = readable<SessionStoreValue>({data: null, error: null}, (set) => {
		auth.getSession()
		.then((session) => {
            set({data: session?.data.session ?? null, error: session?.error ?? null});
		})
		.catch((error) => {
			set({data: null, error});
		});

		const unsubscribe = auth.onAuthStateChange((event, session) => {
			set({data: session ?? null, error: null});
		}).data?.subscription?.unsubscribe;

		return () => {
			unsubscribe?.();
		}
	});

	return {
		subscribe
	};
}
