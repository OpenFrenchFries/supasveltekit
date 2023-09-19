<script lang="ts">
	import BroadcastChannel from "$lib/components/realtime/BroadcastChannel.svelte";
	import RealtimePresence from "$lib/components/realtime/RealtimePresence.svelte";

    const channelName = "any";
    const eventName = "message";

    let userStatus = {userName: "John Doe", status: "offline"};
    
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

<RealtimePresence channelName="multiplayer" {userStatus} let:state let:updateStatus on:join={(userData) => console.log("New user joined")} on:leave={() => console.log("User left")}>
    <h2>Presence</h2>
    <p>Channel name: {channelName}</p>
    {#if state}
    <p>Users online: <span data-testid="users-online">{Object.values(state).flatMap(v => v.filter(x => x.status === "online")).length}</span></p>
    <ul>
        {#each Object.values(state).flatMap(v => v.filter(x => x.status === "online")) as user}
            <li data-testid="{user.userName}">{user.userName}</li>
        {/each}
    </ul>
    <input data-testid="username" type="text" bind:value={userStatus.userName} />
    <button on:click={() => updateStatus({...userStatus, status: "online"})}>Set status to online</button>
    {:else}
    <p>Users online: <span>0</span></p>
    {/if}
</RealtimePresence>