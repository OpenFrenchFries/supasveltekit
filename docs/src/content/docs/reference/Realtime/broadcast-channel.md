---
title: Broadcast Channel
description: How to use the Broadcast Channel component.
---

The `BroadcastChannel` component is used to listen to a channel on the Supabase Realtime service. It uses a svelte store to store and forward the data received from the channel to wrapped components.

This component must be a child of the `SupabaseApp` component to work.

### Props

| Prop name     | Type     | Default value | Description                           |
| ------------- | -------- | ------------- | ------------------------------------- |
| `channelName` | `string` | `'any'`       | The name of the channel to listen to. |
| `eventName`   | `string` | `'sync'`      | The name of the event to listen to.   |

### Slots

| Property   | Type                          | Description                                                                                                                                     |
| ---------- | ----------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------- |
| `payload`  | `Record<string, any> \| null` | The data payload received from the channel.                                                                                                     |
| `error`    | `Error \| null`               | The error object if there was an error receiving the payload.                                                                                   |
| `realtime` | `RealtimeClient`              | The Supabase RealtimeClient instance.                                                                                                           |
| `channel`  | `RealtimeChannel \| null`     | The RealtimeChannel instance for the channel being listened to. This will be `null` if the channel has not been successfully subscribed to yet. |

## Usage

```svelte
<script lang="ts">
	import { BroadcastChannel } from 'supasvelte';
</script>

<BroadcastChannel channelName="any" eventName="sync" let:payload let:error let:realtime let:channel>
	{#if error !== null}
		<div>{error.message}</div>
	{/if}
	{#if payload !== null}
		<div>{JSON.stringify(payload)}</div>
	{/if}
</BroadcastChannel>
```
