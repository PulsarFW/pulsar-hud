<!-- single switch on config.layout, only 'minimap' and 'center' remain, any stale saved layout value falls through to minimap not a blank HUD
	status positioning is static CSS, not tied to the live minimap rect, simple fixed placement near where the minimap sits by default -->
<script lang="ts">
	import { hudState } from '../store/hud.svelte';
	import Location from './Location.svelte';
	import StatusRow from './StatusRow.svelte';
	import VehicleCluster from './VehicleCluster.svelte';

	const layout = $derived(hudState.config.layout);
</script>

{#if hudState.showing}
	<div class="shell">
		<Location />
		<div class="status" class:center={layout === 'center'}>
			<StatusRow />
		</div>
		<VehicleCluster />
	</div>
{/if}

<style>
	.shell {
		position: relative;
		width: 100%;
		height: 100%;
	}

	.status {
		position: absolute;
		bottom: 1.5vh;
		left: 1.6vw;
	}

	.status.center {
		left: 50%;
		transform: translateX(-50%);
	}
</style>
