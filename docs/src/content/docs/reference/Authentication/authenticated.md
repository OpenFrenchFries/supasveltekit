---
title: Authenticated
description: How to use the Authenticated component.
---

The `Authenticated` component is used to render content only when a user is authenticated. It also provides a `signOut` function that can be used to sign the user out.

This component must be a child of the `SupabaseApp` component to work.

### Props

This component does not accept any props.

### Slots

| Property  | Description                         |
| --------- | ----------------------------------- |
| `session` | The user session data.              |
| `auth`    | The Supabase authentication client. |
| `error`   | The authentication error, if any.   |
| `signOut` | A function that signs out the user. |

## Usage

```svelte
<script lang="ts">
	import { Authenticated } from 'supasveltekit';
</script>

<Authenticated let:session let:signOut>
	<h1>Only authenticated users can see this</h1>
	<button on:click={() => signOut()}>Sign Out</button>
</Authenticated>
```
