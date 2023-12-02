---
title: Scheduled function call
description: How to use the Scheduled Function Call component.
---

This component represents a scheduled supabase function call. It allows users to specify the function name, headers, body, and date for the function call.

## Props

| Prop         | Description                                                       |
| ------------ | ----------------------------------------------------------------- |
| functionName | The name of the function to be called.                            |
| headers      | Optional headers to be included in the function call.             |
| body         | Optional body data to be sent with the function call.             |
| date         | The date and time at which the function call should be scheduled. |

## Slots

| Slot    | Description                                                                  |
| ------- | ---------------------------------------------------------------------------- |
| default | The default slot receives the payload, error, and functions client as props. |
| loading | The loading slot is rendered when the function call is being processed.      |

## Usage

```svelte
<script lang="ts">
	import { ScheduledFunctionCall } from 'supasveltekit';
	const schedule = new Date(Date.now() + delay * 2);
</script>

<ScheduledFunctionCall functionName="get-time" let:payload let:error date={schedule}>
	<div data-testid="scheduled-function-call">
		{#if payload}
			<h1>The time is {payload.time}</h1>
		{:else if error}
			<h1>There was an error: {JSON.stringify(error)}</h1>
		{:else}
			<h1>Loading...</h1>
		{/if}
	</div>
</ScheduledFunctionCall>
```
