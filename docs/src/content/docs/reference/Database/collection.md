---
title: Collection
description: How to use the Collection component.
---

The `Collection` component is used to fetch data from a Supabase database table. It uses a svelte store to store and forward the data received from the table to wrapped components.

This component must be a child of the `SupabaseApp` component to work. It offers a real-time mode that listens for changes to the table and updates the store accordingly.

### Props

This component is responsible for fetching and displaying data from a Supabase database table. It uses the `selectStore` function from the `database.js` store to fetch the data and store it in a Svelte store. The component accepts the following props:

| Prop Name     | Type    | Description                                                                                                                                                                                                                                                                                                                                                                  |
| ------------- | ------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `realtime`    | Boolean | Determines whether the component should listen for real-time changes to the table. When set to `true`, the component sets up subscriptions to listen for changes to the specified table in the Supabase database. When a row is deleted, it is removed from the store. When a row is inserted, it is added to the store. When a row is updated, it is upgraded in the store. |
| `refreshKey`  | String  | Specifies the key to use when refreshing the data in the store.                                                                                                                                                                                                                                                                                                              |
| `table`       | String  | Specifies the name of the table to fetch data from.                                                                                                                                                                                                                                                                                                                          |
| `selectQuery` | String  | Specifies the SQL query to use when fetching data from the table. Defaults to `*`.                                                                                                                                                                                                                                                                                           |
| `head`        | Boolean | Determines whether to include the column names in the data. Defaults to `false`.                                                                                                                                                                                                                                                                                             |
| `schema`      | String  | Specifies the schema to use when fetching data from the table. Defaults to `public`.                                                                                                                                                                                                                                                                                         |
| `count`       | String  | Specifies the type of count to use when fetching data from the table. Can be one of `'exact'`, `'planned'`, `'estimated'`, or `undefined`. Defaults to `undefined`.                                                                                                                                                                                                          |

### Slots

The component has two slots:

- `default`: This slot is rendered when the data has been fetched successfully. It receives the following props:
  - `payload`: The data fetched from the table.
  - `error`: An error object if an error occurred while fetching the data, otherwise `null`.
- `loading`: This slot is rendered while the data is being fetched.

## Usage

```svelte
<script lang="ts">
	import { Collection } from 'supasveltekit';
	const table = 'test';
</script>

<Collection table={table} let:payload let:error realtime={true}>
    {#if !payload}
        <p>Loading...</p>
    {:else if error}
        <p>{error.message}</p>
    {:else}
        <p class="items-count">Count: <strong data-testid="items-count">{payload.length}</strong></p>
        {#each payload as entry}
            <p class="items">ID: {entry.id} Created at {entry.created_at}</p>
        {/each}
    {/if}
    <div slot="loading">
        <p>Loading...</p>
    </div>
</Collection>
```
