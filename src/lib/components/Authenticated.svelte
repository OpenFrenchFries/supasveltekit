<script lang="ts">
	import { sessionStore } from '$lib/stores/session.js';
	import { getSupabaseContext } from '$lib/stores/supabase-sdk.js';
	import type { AuthError, Session } from '@supabase/supabase-js';
	import type { SupabaseAuthClient } from '@supabase/supabase-js/dist/module/lib/SupabaseAuthClient.js';

	const auth = getSupabaseContext().auth!;
	const session = sessionStore(auth);
	
	interface $$Slots {
		default: {
			session: Session;
			error: Error | null;
			auth: SupabaseAuthClient;
			signOut: () => Promise<{ error: AuthError | null }>;
		};
	}
</script>

{#if $session && $session?.data}
	<slot session={$session.data} {auth} error={$session.error} signOut={() => auth.signOut()} />
{/if}
