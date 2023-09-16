---
title: Unauthenticated
description: How to use the Unauthenticated component.
---

The `Unauthenticated` component is used to render content only when a user is not authenticated.

This component must be a child of the `SupabaseApp` component to work.

### Props

This component does not accept any props.

### Slots

| Property  | Description                         |
| --------- | ----------------------------------- |
| `auth`    | The Supabase authentication client. |
| `error`   | The authentication error, if any.   |

## Usage

```svelte
<script lang="ts">
    import { Unauthenticated } from "supasveltekit";
</script>

<Unauthenticated>
    <h1>Only unauthenticated users can see this!</h1>
</Unauthenticated>
```