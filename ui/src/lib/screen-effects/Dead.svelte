<script lang="ts">
	import { appState } from '../store/app.svelte';
	import { statusState } from '../store/status.svelte';

	const visible = $derived(statusState.isDead && !appState.blindfolded);
</script>

<div class="dead" class:visible></div>

<style>
	.dead {
		position: absolute;
		inset: 0;
		background: #1a0e0e50;
		opacity: 0;
		transition: opacity 300ms ease;
		pointer-events: none;
	}

	.dead.visible {
		opacity: 1;
	}
</style>
