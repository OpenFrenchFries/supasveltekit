---
title: Item
description: How to use the Item component.
---

The `Item` component is used to display a single item from a Supabase database table. It uses the `itemStore` store to fetch the item and the `getSupabaseContext` function to get the Supabase client.

This component must be a child of the `SupabaseApp` component to work.

### Props

This component is used to display a single item from a Supabase database table. It takes in the following props:

| Prop     | Description                                                                                   |
|----------|-----------------------------------------------------------------------------------------------|
| realtime | A boolean that determines whether or not to listen for real-time changes to the specified table |
| refKey   | The name of the column that serves as the reference key for the item                            |
| refValue | The value of the reference key for the item                                                    |
| table    | The name of the table to retrieve the item from                                                |
| schema   | The name of the schema that the table belongs to (defaults to 'public')                        |

If realtime is enabled, the component sets up subscriptions to listen for changes to the specified table in the Supabase database. When a row is deleted, it is removed from the store. When a row is inserted, it is added to the store. When a row is updated, it is upgraded in the store.

### Slots

The component has two slots:
- default: this slot is used to display the item data. It receives the following props:
	- payload: the data for the item
	- error: any error that occurred while retrieving the item
- loading: this slot is used to display a loading indicator while the item is being retrieved from the database.

## Usage

```svelte
<script lang="ts">
	import { BroadcastChannel } from 'supasveltekit';

	const table = 'test';
	const realtimeItemId = 1;
</script>

<Item table={table} refValue={realtimeItemId} let:payload let:error realtime={true}>
        <p>{JSON.stringify(payload)}</p>
</Item>
```
