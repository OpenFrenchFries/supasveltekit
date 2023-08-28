<script lang="ts">
	import { setSupabaseContext } from "$lib/stores/supabase-sdk.js";

    export let supabase;

    setSupabaseContext(supabase.auth);
</script>