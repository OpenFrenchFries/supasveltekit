---
title: Delayed function call
description: How to use the Delayed Function Call component.
---

A Svelte component that allows for delayed function calls using Supabase Functions.

## Props

| Parameter      | Type   | Description                                       |
| -------------- | ------ | ------------------------------------------------- |
| `functionName` | string | The name of the Supabase Function to call.        |
| `headers`      | any    | Optional headers to include in the function call. |
| `body`         | any    | Optional body to include in the function call.    |
| `delay`        | number | The delay in milliseconds before making the call. |

## Slots

- `default`: The default slot that receives the payload, error, and functions client.

| Parameter   | Type              | Description                                       |
| ----------- | ----------------- | ------------------------------------------------- |
| `payload`   | `any \| null`     | The payload returned by the function call.        |
| `error`     | `Error \| null`   | Any error that occurred during the function call. |
| `functions` | `FunctionsClient` | The Supabase Functions client.                    |

- `loading`: The slot to show while the function call is being delayed.

## Usage

```svelte
<script lang="ts">
	import { DelayedFunctionCall } from 'supasveltekit';
	const delay = 2000;
</script>

<DelayedFunctionCall functionName="get-time" let:payload let:error {delay}>
	<div data-testid="delayed-function-call">
		{#if payload}
			<h1>The time is {payload.time}</h1>
		{:else if error}
			<h1>There was an error: {JSON.stringify(error)}</h1>
		{:else}
			<h1>Loading...</h1>
		{/if}
	</div>
</DelayedFunctionCall>
```
