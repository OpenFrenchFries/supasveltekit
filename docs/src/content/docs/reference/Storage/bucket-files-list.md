---
title: Bucket Files List
description: How to use the Bucket Files List component.
---

The `BucketFilesList` component is used to list files in a bucket. This component must be a child of the `SupabaseApp` component to work.

To use this component, you must provide a bucket name and path. The bucket name is the name of the bucket you want to list files from. The path is the path in the bucket you want to list files from. If you want to list files from the root of the bucket, you can leave the path empty.

You should have the `select` permission on `storage.objects` or on your bucket to be able to list files in it.

## Props

| Prop name    | Type   | Description                                                                                                    |
| ------------ | ------ | -------------------------------------------------------------------------------------------------------------- |
| `bucketName` | string | The name of the bucket to retrieve files from. Defaults to the bucket name from the `BucketContext`.           |
| `path`       | string | The path of the directory in the bucket to retrieve files from. Defaults to the path from the `BucketContext`. |

## Slots

| Prop name     | Type     | Description                                                                 |
| ------------- | -------- | --------------------------------------------------------------------------- |
| `bucketFiles` | `Array`  | An array of file objects retrieved from the specified bucket and path.      |
| `storage`     | `Object` | The storage client object from the Supabase SDK.                            |
| `error`       | `Error`  | An error object if there was an error retrieving the files, otherwise null. |

## Usage

```svelte
<script lang="ts">
	import { BucketFilesList } from 'supasvelte';
</script>

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
```
