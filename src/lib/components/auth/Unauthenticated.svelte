<script lang="ts">
	import { sessionStore } from '$lib/stores/session.js';
	import { getSupabaseContext } from '$lib/stores/supabase-sdk.js';
	import type { SupabaseAuthClient } from '@supabase/supabase-js/dist/module/lib/SupabaseAuthClient.js';

	const auth = getSupabaseContext().auth!;
	const session = sessionStore(auth);
	
	interface $$Slots {
		default: {
			auth: SupabaseAuthClient;
			error: Error | null;
		};
		loading: {};
	}
</script>

{#if !$session}
	<slot name="loading" />
{:else if !$session.data || !!$session.error}
	<slot {auth} error={$session?.error} />
{/if}
