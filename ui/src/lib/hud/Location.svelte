<!-- compass/street readout, vehicle-only, only rendered while location.showing && vehicle.showing && !blindfolded -->
<script lang="ts">
	import Icon from '../Icon.svelte';
	import { appState } from '../store/app.svelte';
	import { locationState } from '../store/location.svelte';
	import { vehicleState } from '../store/vehicle.svelte';
	import { hudState } from '../store/hud.svelte';

	const visible = $derived(locationState.showing && vehicleState.showing && !appState.blindfolded);
</script>

{#if visible}
	<div class="location">
		<div class="box side" class:transparent={hudState.config.hideCompassBg}>
			<Icon name="compass" size="1.1vmin" />
			<span class="text">{locationState.location.direction}</span>
		</div>

		<div class="box center" class:transparent={hudState.config.hideCompassBg}>
			<Icon name="road" size="1.1vmin" />
			<span class="text">
				{locationState.location.main}
				{#if locationState.location.cross && !hudState.config.hideCrossStreet}
					<span class="sep">×</span>
					{locationState.location.cross}
				{/if}
			</span>
		</div>

		<div class="box side" class:transparent={hudState.config.hideCompassBg}>
			<Icon name="map" size="1.1vmin" />
			<span class="text">{locationState.location.area}</span>
		</div>
	</div>
{/if}

<style>
	.location {
		position: fixed;
		top: 2%;
		left: 50%;
		transform: translateX(-50%);
		display: flex;
		gap: 1vw;
	}

	.box {
		display: flex;
		align-items: center;
		gap: 0.5vw;
		height: 3.4vh;
		padding: 0 1vw;
		background: rgba(6, 6, 8, 0.95);
		border: var(--border-primary);
		border-radius: var(--radius);
		white-space: nowrap;
		color: var(--color-primary-light);
	}

	.box.transparent {
		background: transparent;
		border-color: transparent;
	}

	.text {
		font-size: 1.25vmin;
		color: var(--color-text);
	}

	.sep {
		margin: 0 0.3vw;
		color: var(--color-text-muted);
	}
</style>
