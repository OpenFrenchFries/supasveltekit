<script lang="ts">
	import FunctionCall from '$lib/components/function/FunctionCall.svelte';
	import IntervalFunctionCall from '$lib/components/function/IntervalFunctionCall.svelte';
	import DelayedFunctionCall from '$lib/components/function/DelayedFunctionCall.svelte';
	import ScheduledFunctionCall from '$lib/components/function/ScheduledFunctionCall.svelte';

	const interval = 2000;
	const delay = 2000;
	const schedule = new Date(Date.now() + delay * 2);
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
