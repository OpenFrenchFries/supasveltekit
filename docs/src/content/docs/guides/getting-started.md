---
title: Getting Started
description: A guide page to a quick first use of SupaSvelte.
---

## 🚀 Quick Start

1. Install SupaSvelte:

```bash
npm install supasvelte
```

2. Initialize your Supabase client:

```ts
import { PUBLIC_SUPABASE_KEY, PUBLIC_SUPABASE_URL } from "$env/static/public";
import { createClient } from "@supabase/supabase-js";

export const supabaseUrl = PUBLIC_SUPABASE_URL;
export const supabaseKey = PUBLIC_SUPABASE_KEY;

export const supabase = createClient(supabaseUrl, supabaseKey);
```

3. Use SupaSvelte components in your SvelteKit app:

```svelte
<script lang="ts">
    import { supabase } from "$lib/supabase";
    import { Authenticated, Unauthenticated, signIn, signOut } from "supasvelte";
</script>
<SupabaseApp {supabase}>
    <Authenticated let:session let:signOut>    
        <h1>Welcome, {session?.user?.identities?.[0]?.identity_data?.email}!</h1>
        <button on:click={() => signOut()}>Sign Out</button>
    </Authenticated>

    <Unauthenticated>
        <h1>Sign in to continue</h1>
        <button on:click={() => signIn()}>Sign In</button>
    </Unauthenticated>

</SupabaseApp>
```
