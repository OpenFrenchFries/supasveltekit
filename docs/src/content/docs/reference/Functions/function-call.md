---
title: Function call
description: How to use the Function Call component.
---

This component represents a function call to a Supabase function.

## Props

| Prop           | Type   | Description                                       |
| -------------- | ------ | ------------------------------------------------- |
| `functionName` | string | The name of the Supabase function to call.        |
| `headers`      | any    | Optional headers to include in the function call. |
| `body`         | any    | Optional body to include in the function call.    |

## Slots

- `default`: This slot is rendered when the function call is successful. It has the following scope variables:

| Variable    | Type              | Description                                       |
| ----------- | ----------------- | ------------------------------------------------- |
| `payload`   | `any\| null`      | The response payload from the function call.      |
| `error`     | `Error\| null`    | Any error that occurred during the function call. |
| `functions` | `FunctionsClient` | The Supabase functions client.                    |

- `loading`: This slot is rendered while the function call is in progress.

## Usage

```svelte
<script lang="ts">
	import { FunctionCall } from 'supasveltekit';
</script>

<FunctionCall functionName="get-time" let:payload let:error>
	<div data-testid="function-call">
		{#if payload}
			<h1>The time is {payload.time}</h1>
		{:else if error}
			<h1>There was an error: {JSON.stringify(error)}</h1>
		{:else}
			<h1>Loading...</h1>
		{/if}
	</div>
</FunctionCall>
```
