<!-- no RPM display at all, matches the original Simple variant, config.showRPM is intentionally irrelevant here -->
<script lang="ts">
	import Icon from '../Icon.svelte';
	import { vehicleState } from '../store/vehicle.svelte';
	import { isVehicleShiftedUp, formatSpeed, fuelColor } from './vehicleLayout';

	const shiftedUp = $derived(isVehicleShiftedUp());
</script>

{#if vehicleState.showing}
	<div class="wrapper" style:bottom="{shiftedUp ? 85 : 20}px">
		<div class="left">
			{#if vehicleState.ignition}
				<div class="speed-text">{formatSpeed(vehicleState.speed)}</div>
				<div class="speed-measure">{vehicleState.speedMeasure}</div>
			{:else}
				<div class="speed-text">Off</div>
			{/if}
		</div>
		<div class="right">
			<span class="dash-icon" class:active={vehicleState.checkEngine}>
				<Icon name="car-burst" size="20px" />
			</span>
			<span class="dash-icon" class:active={vehicleState.cruise}>
				<Icon name="gauge" size="20px" />
			</span>
			{#if !vehicleState.seatbeltHide}
				<span class="dash-icon" class:active={!vehicleState.seatbelt}>
					<Icon name="triangle-exclamation" size="20px" />
				</span>
			{/if}
		</div>
		<div class="bars">
			{#if vehicleState.ignition && !vehicleState.fuelHide}
				<div class="veh-bar">
					<div class="bar-bg">
						<div class="bar-fill" class:flash={vehicleState.fuel <= 10} style:height="{vehicleState.fuel}%" style:background={fuelColor(vehicleState.fuel)}></div>
					</div>
					<Icon name="gas-pump" size="16px" />
				</div>
			{/if}
			{#if vehicleState.ignition && vehicleState.nos > 0}
				<div class="veh-bar">
					<div class="bar-bg">
						<div class="bar-fill nos" style:height="{vehicleState.nos}%"></div>
					</div>
					<Icon name="wine-bottle" size="16px" />
				</div>
			{/if}
		</div>
	</div>
{/if}

<style>
	.wrapper {
		position: absolute;
		display: flex;
		right: 1.6vw;
		width: fit-content;
		height: 155px;
		color: var(--color-text);
		text-align: center;
		filter: drop-shadow(0 0 2px rgba(0, 0, 0, 0.85));
	}

	.left {
		height: 100%;
		width: 100px;
		position: relative;
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
	}

	.speed-text {
		font-family: var(--font-lcd);
		font-size: 44px;
	}

	.speed-measure {
		font-size: 18px;
	}

	.right {
		padding-left: 10px;
		display: flex;
		flex-direction: column;
		gap: 6px;
		justify-content: center;
	}

	.dash-icon {
		color: rgba(117, 116, 127, 0.5);
	}

	.dash-icon.active {
		color: var(--color-info);
	}

	.bars {
		display: flex;
		height: 100%;
		gap: 8px;
	}

	.veh-bar {
		height: 100%;
		display: flex;
		flex-direction: column;
		gap: 4px;
		align-items: center;
	}

	.bar-bg {
		flex: 1;
		width: 14px;
		border-radius: 8px 8px 0 0;
		position: relative;
		background: rgba(14, 13, 19, 0.9);
		display: flex;
		align-items: flex-end;
	}

	.bar-fill {
		width: 100%;
		border-radius: 8px 8px 0 0;
		transition: height 150ms ease-in;
	}

	.bar-fill.flash {
		animation: flash 0.5s linear infinite;
	}

	.bar-fill.nos {
		background: #0078ec;
	}

	@keyframes flash {
		50% {
			opacity: 0.35;
		}
	}
</style>
