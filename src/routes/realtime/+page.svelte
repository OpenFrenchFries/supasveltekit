<script lang="ts">
	import BroadcastChannel from "$lib/components/realtime/BroadcastChannel.svelte";
	import RealtimePresence from "$lib/components/realtime/RealtimePresence.svelte";

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

<RealtimePresence channelName="multiplayer" let:state on:join={(userData) => console.log("New user joined")}>
    <h2>Presence</h2>
    <p>Channel name: {channelName}</p>
    <p>Users online: {Object.keys(state ?? {}).length}</p>
    {#if state}
    <ul>
        {#each Object.values(state) as user}
            {#each user as userData}
                <li>{userData.presence_ref}</li>
            {/each}
        {/each}
    </ul>
    {/if}
</RealtimePresence>