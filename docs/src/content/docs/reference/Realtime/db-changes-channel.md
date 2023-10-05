---
title: DB Changes
description: How to use the DB Changes component.
---

The `DBChanges` component is used to listen to changes on a table in the Supabase Realtime service. It uses a svelte store to store and forward the data received from the channel to wrapped components.

This component must be a child of the `SupabaseApp` component to work.

## Props

| Prop name     | Description                                                                                               | Default value |
| ------------- | --------------------------------------------------------------------------------------------------------- | ------------- |
| `channelName` | The name of the channel to listen to changes on.                                                          | `'any'`       |
| `event`       | The type of event to listen to changes for. Can be one of `"*"`, `"INSERT"`, `"UPDATE"`, or `"DELETE"`.   | `"*"`         |
| `schema`      | The name of the schema to listen to changes on.                                                           | `"*"`         |
| `table`       | The name of the table to listen to changes on. If `null`, listens to changes on all tables in the schema. | `null`        |
| `filter`      | A filter expression to apply to the changes. If `null`, no filter is applied.                             | `null`        |

## Slots

- `default`: The default slot is rendered with the latest changes. It has access to the following props:

  | Property   | Description                                                 |
  | ---------- | ----------------------------------------------------------- |
  | `payload`  | The latest changes to the database table.                   |
  | `error`    | An error object if there was an error listening to changes. |
  | `realtime` | The Supabase RealtimeClient instance.                       |
  | `channel`  | The Supabase RealtimeChannel instance.                      |

- `loading`: The loading slot is rendered while the component is waiting for the initial changes to load.

## Usage

```svelte
<script lang="ts">
	import { DbChanges } from 'supasveltekit';
</script>

<DbChanges channelName="db" event="*" schema="public" table="test" let:payload>
	{#if error !== null}
		<div>{error.message}</div>
	{/if}
	{#if payload !== null}
		<p>Last change received: >{payload?.eventType ?? "none"}</strong></p>
	{/if}
</DbChanges>
```
