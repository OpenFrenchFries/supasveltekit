---
title: Download URL
description: How to use the Download URL component.
---

The `DownloadURL` component retrieves a download URL for a file in a Supabase Storage bucket.

This component must be a child of the `SupabaseApp` component to work.

## Props

| Prop         | Type     | Default | Required | Description                                           |
| ------------ | -------- | ------- | -------- | ----------------------------------------------------- |
| `bucketName` | `string` |         | Yes      | The name of the bucket containing the file.           |
| `path`       | `string` |         | Yes      | The path to the file in the bucket.                   |
| `expiration` | `number` | `60`    | No       | The number of seconds until the download URL expires. |

## Slots

| Name      | Description                                                                      |
| --------- | -------------------------------------------------------------------------------- |
| `default` | The default slot that receives the download URL, storage client, and any errors. |

## Usage

```svelte
<script lang="ts">
	import { BucketContext, BucketFilesList } from 'supasvelte';
</script>

<DownloadURL bucketName="my-bucket" path="path/to/file.jpg" let:url let:storage let:error expiration={3600}>
	{#if url}
		<a href={url} download>Download file</a>
	{:else if error}
		<p>Error: {error.message}</p>
	{:else}
		<p>Loading...</p>
	{/if}
</DownloadURL>
```
