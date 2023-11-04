<script lang="ts">
	import { setSupabaseContext } from '$lib/stores/supabase-sdk.js';
	import type { SupabaseClient } from '@supabase/supabase-js';

	export let supabase: SupabaseClient;

    setSupabaseContext({
        client: supabase,
		auth: supabase.auth,
		storage: supabase.storage,
		realtime: supabase.realtime,
		function: supabase.functions,
	});
</script>

<slot />
