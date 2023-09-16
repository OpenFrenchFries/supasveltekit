---
title: Buckets List
description: How to use the Buckets List component.
---

The `BucketsList` component displays a list of buckets retrieved from Supabase Storage. It uses the `bucketsListStore` store to fetch the list of buckets and the `getSupabaseContext` function to get the Supabase Storage client. This component must be a child of the `SupabaseApp` component to work.

You should have the `select` permission on `storage.buckets` to be able to list buckets.

### Props

This component has no props.

### Slots

This component has one slot named `default` which accepts the following props:

| Name      | Description                                                                                |
| --------- | ------------------------------------------------------------------------------------------ |
| `buckets` | An array of `Bucket` objects representing the list of buckets.                             |
| `error`   | An `Error` object representing any error that occurred while fetching the list of buckets. |
| `storage` | A `StorageClient` object representing the Supabase Storage client.                         |

## Usage

```svelte
<script lang="ts">
	import { BucketsList } from 'supasveltekit';
</script>

<BucketsList let:buckets let:error>
	{#if error !== null}
		<div>{error}</div>
	{/if}
	<ul>
		{#each buckets as bucket}
			<li>
				{bucket.name}
			</li>
		{/each}
	</ul>
</BucketsList>
```
