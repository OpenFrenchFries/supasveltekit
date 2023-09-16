<script lang="ts">
	import BroadcastChannel from "$lib/components/realtime/BroadcastChannel.svelte";

    const channelName = "any";
    const eventName = "message";
    
</script>

<BroadcastChannel let:payload let:channel {channelName} {eventName}>
    <h1>Realtime</h1>
    <p>Open this page in multiple tabs to see the realtime updates.</p>
    <p>Channel name: {channel?.topic}</p>
    <p>Event name: {eventName}</p>
    <p>Channel started: {!!channel}</p>
    <button on:click={() => {
        channel?.send({type: 'broadcast', event: eventName, message: `Hello from ${channelName}/${eventName}!`})
    }}>Send message</button>
    <p data-testid="received-message">Last message received: {payload?.message}</p>
</BroadcastChannel>