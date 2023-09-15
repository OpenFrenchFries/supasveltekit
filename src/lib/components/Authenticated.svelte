## Authenticated Component

This component is responsible for rendering its child components only if the user is authenticated. It uses the `sessionStore` and `getSupabaseContext` functions to retrieve the user session and authentication client respectively.

### Props

This component does not accept any props.

### Slots

This component has one default slot that accepts the following props:

- `session`: The user session data.
- `auth`: The Supabase authentication client.
- `error`: The authentication error, if any.
- `signOut`: A function that signs out the user.

### Example Usage
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
