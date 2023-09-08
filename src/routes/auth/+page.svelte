<script lang="ts">
	import Authenticated from "$lib/components/Authenticated.svelte";
	import Unauthenticated from "$lib/components/Unauthenticated.svelte";
	import { getSupabaseContext } from "$lib/stores/supabase-sdk.js";
    import { PUBLIC_TEST_USER_EMAIL, PUBLIC_TEST_USER_PASSWORD } from "$env/static/public";

    const auth = getSupabaseContext().auth!;
</script>

<Unauthenticated>
    <h1>Sign in to continue</h1>
    <button on:click={() => auth.signInWithPassword({email: PUBLIC_TEST_USER_EMAIL, password:PUBLIC_TEST_USER_PASSWORD})}>Sign in</button>
</Unauthenticated>

<Authenticated let:session let:signOut>
    <h1>Welcome {session?.user?.identities?.[0]?.identity_data?.email}</h1>
    <button on:click={() => signOut()}>Sign out</button>
</Authenticated>