<!-- honors config.showRPM consistently, unlike the original Minimalistic variant which always showed the RPM ring -->
<script lang="ts">
	import Icon from '../Icon.svelte';
	import { hudState } from '../store/hud.svelte';
	import { vehicleState } from '../store/vehicle.svelte';
	import { isVehicleShiftedUp, formatSpeed, fuelColor } from './vehicleLayout';

	const shiftedUp = $derived(isVehicleShiftedUp());
	const rpmPct = $derived(hudState.config.showRPM && vehicleState.ignition ? vehicleState.rpm * 100 : 0);
</script>

{#if vehicleState.showing}
	<div class="wrapper" style:bottom="{shiftedUp ? 75 : 30}px">
		{#if vehicleState.ignition && !vehicleState.fuelHide}
			<div class="side-gauge left">
				<div class="quarter-ring" style:background="conic-gradient({fuelColor(vehicleState.fuel)} {vehicleState.fuel * 1.8}deg, rgba(232, 232, 236, 0.12) 0deg)"></div>
				<Icon name="gas-pump" size="14px" />
			</div>
		{/if}

		<div class="main-ring" style:background={hudState.config.showRPM ? `conic-gradient(var(--color-primary) ${rpmPct * 3.6}deg, rgba(232, 232, 236, 0.12) 0deg)` : 'none'}>
			<div class="main-inner">
				{#if vehicleState.ignition}
					<span class="speed-text">{formatSpeed(vehicleState.speed)}</span>
					<span class="speed-measure">{vehicleState.speedMeasure}</span>
				{:else}
					<span class="speed-text">Off</span>
				{/if}
			</div>

			<div class="badges">
				{#if !vehicleState.seatbeltHide}
					<span class="badge" class:active={!vehicleState.seatbelt}>
						<Icon name="triangle-exclamation" size="14px" />
					</span>
				{/if}
				<span class="badge" class:active={vehicleState.cruise}>
					<Icon name="gauge" size="14px" />
				</span>
				<span class="badge" class:active={vehicleState.checkEngine}>
					<Icon name="car-burst" size="14px" />
				</span>
			</div>
		</div>

		{#if vehicleState.ignition && vehicleState.nos > 0}
			<div class="side-gauge right">
				<div class="quarter-ring" style:background="conic-gradient(#0078ec {vehicleState.nos * 1.8}deg, rgba(232, 232, 236, 0.12) 0deg)"></div>
				<Icon name="wine-bottle" size="14px" />
			</div>
		{/if}
	</div>
{/if}

<style>
	.wrapper {
		position: absolute;
		right: 1.6vw;
		width: fit-content;
		display: flex;
		align-items: center;
		gap: 14px;
		color: var(--color-text);
		filter: drop-shadow(0 0 2px rgba(0, 0, 0, 0.85));
	}

	.main-ring {
		position: relative;
		width: 110px;
		height: 110px;
		border-radius: 50%;
		display: flex;
		align-items: center;
		justify-content: center;
	}

	.main-inner {
		width: 92px;
		height: 92px;
		border-radius: 50%;
		background: rgba(14, 13, 19, 0.9);
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
	}

	.speed-text {
		font-family: var(--font-lcd);
		font-size: 30px;
	}

	.speed-measure {
		font-size: 12px;
		color: var(--color-text-muted);
	}

	.badges {
		position: absolute;
		bottom: -6px;
		display: flex;
		gap: 4px;
	}

	.badge {
		width: 20px;
		height: 20px;
		border-radius: 50%;
		background: var(--color-bg-panel);
		display: flex;
		align-items: center;
		justify-content: center;
		color: rgba(117, 116, 127, 0.5);
	}

	.badge.active {
		color: var(--color-warning);
	}

	.side-gauge {
		position: relative;
		width: 44px;
		height: 44px;
		display: flex;
		align-items: center;
		justify-content: center;
	}

	.quarter-ring {
		position: absolute;
		inset: 0;
		border-radius: 50%;
	}

	.side-gauge :global(svg) {
		z-index: 1;
	}
</style>
