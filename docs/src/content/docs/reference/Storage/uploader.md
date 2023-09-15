---
title: Uploader
description: How to use the Uploader component.
---

The `Uploader` component is used to upload files to a bucket.

This component must be a child of the `SupabaseApp` component to work.

### Props

| Prop name | Type   | Description                                                                      |
| --------- | ------ | -------------------------------------------------------------------------------- |
| `file`    | File   | The file to upload.                                                              |
| `options` | object | The options to pass to the `storage.upload` method. Defaults to an empty object. |

### Slots

| Prop name      | Type     | Description                                                                 |
| -------------- | -------- | --------------------------------------------------------------------------- |
| `storage`      | `Object` | The storage client object from the Supabase SDK.                            |
| `error`        | `Error`  | An error object if there was an error uploading the file, otherwise null.   |
| `uploadedFile` | `string` | The name of the uploaded file if the upload was successful, otherwise null. |

## Usage

```svelte
<script lang="ts">
	import { BucketContext, Uploader } from 'supasvelte';

	let file: File | null = null;
</script>

<BucketContext bucketName="test-bucket" path="public/">
	<input type="file" on:change={(e) => (file = e?.currentTarget?.files?.[0] ?? null)} />

	{#if file}
		<Uploader {file} {options} let:uploadedFile let:error>
			{#if error}
				<div data-testid="upload-error">{error.message}</div>
			{/if}
			{#if uploadedFile}
				<div data-testid="upload-filename">{uploadedFile}</div>
			{/if}
		</Uploader>
	{/if}
</BucketContext>
```
