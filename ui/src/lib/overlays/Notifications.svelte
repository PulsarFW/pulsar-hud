<script lang="ts">
	import { notificationsState } from '../store/notifications.svelte';
	import Notification from './Notification.svelte';

	const persistent = $derived([...notificationsState.notifications.filter((n) => n.duration <= 0)].sort((a, b) => b.created - a.created));
	const timed = $derived([...notificationsState.notifications.filter((n) => n.duration > 0)].sort((a, b) => b.created - a.created));
</script>

<div class="stack">
	{#each persistent as n, i (n._id)}
		<Notification notification={n} animationDelay={i * 100} />
	{/each}
	{#each timed as n, i (n._id)}
		<Notification notification={n} animationDelay={i * 100 + persistent.length * 100} />
	{/each}
</div>

<style>
	.stack {
		max-width: 26vw;
		width: 100%;
		position: absolute;
		right: 0;
		top: 0;
		z-index: 1000;
		padding: 1vh 1vw;
		display: flex;
		flex-direction: column;
		gap: 0.4vh;
		pointer-events: none;
	}

	.stack :global(.slide) {
		pointer-events: auto;
	}
</style>
