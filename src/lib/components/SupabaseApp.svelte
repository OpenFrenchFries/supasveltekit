<script lang="ts">
	import { setSupabaseContext } from "$lib/stores/supabase-sdk.js";
	import type { SupabaseClient } from "@supabase/supabase-js";

    export let supabase: SupabaseClient;

    setSupabaseContext({auth: supabase.auth, storage: supabase.storage});
</script>

<slot />