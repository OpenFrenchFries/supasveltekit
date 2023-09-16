---
title: Bucket Context
description: How to use the Bucket Context.
---

The `BucketContext` component is used to provide a bucket to `BucketFilesList`, `DownloadURL` and `Uploader`. It can be used to provide a bucket name and path to any other component that needs it.

This component must be a child of the `SupabaseApp` component to work.

### Props

| Prop name    | Type   | Description                                                   |
| ------------ | ------ | ------------------------------------------------------------- |
| `bucketName` | string | The name of the bucket to set the context for.                |
| `path`       | string | The path to set the context for. Defaults to an empty string. |

### Slots

This component has no slots.

## Usage

```svelte
<script lang="ts">
	import { BucketContext, BucketFilesList } from 'supasveltekit';
</script>

<BucketContext name="test-bucket" path="public/">
	<BucketFilesList let:bucketFiles let:error>
		{#if error !== null}
			<div>{error}</div>
		{/if}
		<ul>
			{#each bucketFiles as file}
				<li data-testid={file.name}>
					{file.name}
				</li>
			{/each}
		</ul>
	</BucketFilesList>
</BucketContext>
```
