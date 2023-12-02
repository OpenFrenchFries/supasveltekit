---
title: Interval function call
description: How to use the Interval Function Call component.
---

This component represents a Supabase function call that is executed at regular intervals.

## Props

| Prop           | Description                                                                   |
| -------------- | ----------------------------------------------------------------------------- |
| `functionName` | The name of the function to call.                                             |
| `headers`      | Optional headers to include in the function call.                             |
| `body`         | Optional body to include in the function call.                                |
| `interval`     | The interval (in milliseconds) at which the function call should be executed. |

## Slots

- `default`: This slot is rendered when the `store` is truthy. It receives the following context variables:

| Variable    | Description                                       |
| ----------- | ------------------------------------------------- |
| `payload`   | The data returned by the function call.           |
| `error`     | Any error that occurred during the function call. |
| `functions` | The `FunctionsClient` instance.                   |

- `loading`: This slot is rendered when the `store` is falsy.

## Usage

```svelte
<script lang="ts">
	import { IntervalFunctionCall } from 'supasveltekit';
	const interval = 2000;
</script>

<IntervalFunctionCall functionName="get-time" let:payload let:error {interval}>
	<div data-testid="interval-function-call">
		{#if payload}
			<h1>The time is {payload.time}</h1>
		{:else if error}
			<h1>There was an error: {JSON.stringify(error)}</h1>
		{:else}
			<h1>Loading...</h1>
		{/if}
	</div>
</IntervalFunctionCall>
```
