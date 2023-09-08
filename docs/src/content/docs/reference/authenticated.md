---
title: Authenticated
description: How to use the Authenticated component.
---

The `Authenticated` component is used to render content only when a user is authenticated. It also provides a `signOut` function that can be used to sign the user out.

This component must be a child of the `SupabaseApp` component to work.

## Usage

```svelte
<script lang="ts">
    import { Authenticated } from "supasvelte";
</script>

<Authenticated let:session let:signOut>
    <h1>Only authenticated users can see this</h1>
    <button on:click={() => signOut()}>Sign Out</button>
</Authenticated>
```