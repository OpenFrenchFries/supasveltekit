---
title: Realtime Presence
description: How to use the Realtime Presence component.
---

The `RealtimePresence` component is used to listen to a channel on the Supabase Realtime service to track users' presence. It uses a svelte store to store and forward the data received from the channel to wrapped components. It also provides two dispatch functions to receive join and leave events. This component is responsible for managing the presence of users in a Supabase Realtime channel. It leverages the `presenceStateStore` and `userStatusStore`, which are used to manage the state of the presence channel and the user's status, respectively.

This component must be a child of the `SupabaseApp` component to work.

### Props:

| Prop Name        | Type                                  | Description                                                                 |
| ---------------- | ------------------------------------- | --------------------------------------------------------------------------- |
| `channelName`    | `string`                              | The name of the channel to connect to. Defaults to `'any'`.                 |
| `userStatus`     | `Record<string, any> \| undefined`    | The default user's status. Defaults to `undefined`.                         |
| `channelOptions` | `RealtimeChannelOptions \| undefined` | The options to use when connecting to the channel. Defaults to `undefined`. |

### Slots:

| Prop Name      | Type                                    | Description                                                       |
| -------------- | --------------------------------------- | ----------------------------------------------------------------- |
| `state`        | `RealtimePresenceState<any> \| null`    | The state containing presences data.                              |
| `realtime`     | `RealtimeClient`                        | The Supabase Realtime client.                                     |
| `error`        | `Error \| null`                         | The error, if any, that occurred while connecting to the channel. |
| `channel`      | `RealtimeChannel \| null`               | The Supabase Realtime channel.                                    |
| `updateStatus` | `(status: Record<string, any>) => void` | A function that can be used to update the user's status.          |

## Usage

```svelte
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
```
