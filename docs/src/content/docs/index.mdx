---
title: Getting Started
description: A guide page to a quick first use of SupaSvelteKit.
---

## 🚀 Quick Start

1. Install SupaSvelteKit:

```bash
npm install supasveltekit
```

2. Initialize your Supabase client:

```ts
import { PUBLIC_SUPABASE_KEY, PUBLIC_SUPABASE_URL } from "$env/static/public";
import { createClient } from "@supabase/supabase-js";

export const supabaseUrl = PUBLIC_SUPABASE_URL;
export const supabaseKey = PUBLIC_SUPABASE_KEY;

export const supabase = createClient(supabaseUrl, supabaseKey);
```

3. Use SupaSvelteKit components in your SvelteKit app:

```svelte
<script lang="ts">
    import { supabase } from "$lib/supabase";
    import { Authenticated, Unauthenticated, BucketFilesList, RealtimePresence } from "supasveltekit";
</script>
<SupabaseApp {supabase}>
	<Authenticated let:session let:signOut>
		<h1>Welcome, {session?.user?.identities?.[0]?.identity_data?.email}!</h1>
		<button on:click={() => signOut()}>Sign Out</button>

		<BucketFilesList bucketName="test-bucket" path="public/" let:bucketFiles let:error>
			{#if error !== null}
				<div>{error}</div>
			{/if}
			<ul>
				{#each bucketFiles as file}
					<li>
						{file.name}
					</li>
				{/each}
			</ul>
		</BucketFilesList>

		<RealtimePresence channelName="my-channel">
			<div slot="default" let:state let:error let:realtime let:channel let:updateStatus>
				{#if error}
					<p>Error: {error.message}</p>
				{:else if !state}
					<p>Loading...</p>
				{:else}
					<p>Connected to channel {channel?.name}</p>
					<p>Number of users: {state?.count}</p>
					<button on:click={() => updateStatus({ status: 'online' })}>Go online</button>
					<button on:click={() => updateStatus({ status: 'offline' })}>Go offline</button>
				{/if}
			</div>
		</RealtimePresence>
	</Authenticated>

	<Unauthenticated>
		<h1>Sign in to continue</h1>
		<button on:click={() => signIn()}>Sign In</button>
	</Unauthenticated>
</SupabaseApp>
```
