import { readable } from 'svelte/store';
import type { SupabaseAuthClient } from '@supabase/supabase-js/dist/module/lib/SupabaseAuthClient.js';
import type { Session } from '@supabase/supabase-js';

export function sessionStore(auth: SupabaseAuthClient) {

	// SSR
	if (!globalThis.window) {
		const { subscribe } = readable(null);
		return {
			subscribe
		};
	}

	//If the auth is not initialized, return a dummy store
	if (!auth) {
		console.warn(
			'Auth is not initialized. Did you forget to create a `supabase` instance?'
		);
		const { subscribe } = readable(null);
		return {
			subscribe
		};
	}

	const { subscribe } = readable<Session | null>(null, (set) => {
		auth.getSession().then((session) => {
            set(session?.data.session ?? null);
		});

		const unsubscribe = auth.onAuthStateChange((event, session) => {
			set(session ?? null);
		}).data?.subscription?.unsubscribe;

		return () => {
			unsubscribe?.();
		}
	});

	return {
		subscribe
	};
}
