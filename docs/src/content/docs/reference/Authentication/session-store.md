---
title: Session Store
description: How to use the Session Store.
---

The `SessionStore` component is used to store the session data in a Svelte store, which can then be used throughout your app. This is useful for accessing the session data in components that are not children of the `SupabaseApp` component. 

The session store is a readable store that contains the session data. It can be used to access the session data and subscribe to changes in the session data.

## Usage

```svelte
<script lang="ts">
    import { sessionStore } from "supasveltekit";
    
    const supabaseUrl = "https://<your-supabase-url>.supabase.co";
    const supabaseKey = "<your-supabase-key>";
    const supabase = createClient(supabaseUrl, supabaseKey);

    const session = sessionStore(supabase.auth);
</script>

{#if $session.data !== null}
    <h1>Welcome, {$session.data.user?.identities?.[0]?.identity_data?.email}!</h1>
    <button on:click={() => supabase.auth.signOut()}>Sign Out</button>
{:else}
    <h1>Sign in to continue</h1>
    <button on:click={() => supabase.auth.signInWithPassword(...)}>Sign In</button>
{/if}
```