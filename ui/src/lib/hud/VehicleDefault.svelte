<!-- rotated circular RPM gauge with fuel/NOS arcs and a center speed/RPM readout, unlike the flat bar-stack other variants use.
	turn signals/headlights/door-lock/mileage come from client/hud.lua's UPDATE_SIGNALS thread, real native calls not invented data -->
<script lang="ts">
	import Icon from '../Icon.svelte';
	import { hudState } from '../store/hud.svelte';
	import { vehicleState } from '../store/vehicle.svelte';
	import { isVehicleShiftedUp, fuelColor } from './vehicleLayout';

	const shiftedUp = $derived(isVehicleShiftedUp());

	const SIZE = 250;
	const CX = SIZE / 2;
	const CY = SIZE / 2;
	const R = 100;
	const GAUGE_START = 155;
	const GAUGE_SWEEP = 240;

	const ZONE1 = 0.6;
	const ZONE2 = 0.2;
	const ZONE3 = 0.2;
	const ZONE_ARC_LEN = 2 * Math.PI * R * ((GAUGE_SWEEP * 0.2) / 360);
	const ZONE_GAP = 6;
	const ZONE_DASH = (ZONE_ARC_LEN - 2 * ZONE_GAP) / 3;

	const R_FUEL = R - 16;
	const FUEL_MAX_DEG = GAUGE_SWEEP;
	const FUEL_ARC_LEN = 2 * Math.PI * R_FUEL * (FUEL_MAX_DEG / 360);
	const FUEL_GAP = 4;
	const FUEL_DASH = (FUEL_ARC_LEN - 3 * FUEL_GAP) / 4;

	const TICKS = [
		{ label: '0', deg: 155 },
		{ label: '2', deg: 215 },
		{ label: '4', deg: 275 },
		{ label: '6', deg: 335 },
		{ label: '8', deg: 35 },
	];
	const LABEL_R = R + 16;

	function toRad(deg: number) {
		return (deg * Math.PI) / 180;
	}

	function arcPoint(cx: number, cy: number, r: number, deg: number) {
		return { x: cx + r * Math.cos(toRad(deg)), y: cy + r * Math.sin(toRad(deg)) };
	}

	function arcPath(cx: number, cy: number, r: number, startDeg: number, sweepDeg: number): string {
		if (sweepDeg <= 0) return '';
		const clampedSweep = Math.min(sweepDeg, 359.99);
		const endDeg = startDeg + clampedSweep;
		const s = arcPoint(cx, cy, r, startDeg);
		const e = arcPoint(cx, cy, r, endDeg);
		const largeArc = clampedSweep > 180 ? 1 : 0;
		return `M ${s.x.toFixed(3)} ${s.y.toFixed(3)} A ${r} ${r} 0 ${largeArc} 1 ${e.x.toFixed(3)} ${e.y.toFixed(3)}`;
	}

	function tickLabelTransform(deg: number) {
		const x = CX + LABEL_R * Math.cos(toRad(deg));
		const y = CY + LABEL_R * Math.sin(toRad(deg));
		return { x, y };
	}

	function rpmDigitColor(v: number) {
		if (v >= 0.85) return 'var(--color-error)';
		if (v >= 0.65) return 'var(--color-warning)';
		return 'var(--color-primary-light)';
	}

	// subtle idle jitter on the RPM needle so it doesn't look like a dead-flat gauge at 0
	let jitter = $state(0);
	let jitterT = 0;
	$effect(() => {
		if (!(vehicleState.ignition && vehicleState.rpm < 0.3)) {
			jitter = 0;
			return;
		}
		const id = setInterval(() => {
			jitterT += 0.025;
			jitter = Math.sin(jitterT * 1.1) * 0.018 + Math.sin(jitterT * 0.5) * 0.012;
		}, 50);
		return () => clearInterval(id);
	});

	const rpmNorm = $derived(Math.min(1, Math.max(0, vehicleState.rpm)));
	const rpmFinal = $derived(Math.max(0, Math.min(1, rpmNorm + jitter)));
	const fuelNorm = $derived(Math.min(1, Math.max(0, vehicleState.fuel / 100)));
	const nosNorm = $derived(Math.min(1, Math.max(0, vehicleState.nos / 100)));

	const rpmSweep = $derived(rpmFinal * GAUGE_SWEEP);
	const fuelSweep = $derived(fuelNorm * FUEL_MAX_DEG);
	const nosSweep = $derived(nosNorm * GAUGE_SWEEP);

	const fuelCol = $derived(fuelColor(vehicleState.fuel));
	const fuelPath = $derived(arcPath(CX, CY, R_FUEL, GAUGE_START, fuelSweep));
	const nosPath = $derived(arcPath(CX, CY, R_FUEL, GAUGE_START, nosSweep));
</script>

{#if vehicleState.showing}
	<div class="wrapper" style:bottom="{shiftedUp ? 65 : 20}px">
		<div class="gauge-shell">
			<svg viewBox="0 0 {SIZE} {SIZE}" class="gauge-svg">
				<path
					d={arcPath(CX, CY, R, GAUGE_START, GAUGE_SWEEP * ZONE1)}
					fill="none"
					stroke="rgba(232, 232, 236, 0.22)"
					stroke-width="8"
					stroke-linecap="butt"
				/>
				<path
					d={arcPath(CX, CY, R, GAUGE_START + GAUGE_SWEEP * ZONE1, GAUGE_SWEEP * ZONE2)}
					fill="none"
					stroke="rgba(240, 168, 72, 0.5)"
					stroke-width="8"
					stroke-linecap="butt"
					stroke-dasharray="{ZONE_DASH} {ZONE_GAP}"
				/>
				<path
					d={arcPath(CX, CY, R, GAUGE_START + GAUGE_SWEEP * (ZONE1 + ZONE2), GAUGE_SWEEP * ZONE3)}
					fill="none"
					stroke="rgba(229, 72, 77, 0.55)"
					stroke-width="8"
					stroke-linecap="butt"
					stroke-dasharray="{ZONE_DASH} {ZONE_GAP}"
				/>

				{#if rpmFinal > 0}
					<path
						d={arcPath(CX, CY, R, GAUGE_START, Math.min(rpmSweep, GAUGE_SWEEP * ZONE1))}
						fill="none"
						stroke={vehicleState.ignition ? 'var(--color-primary)' : 'rgba(232, 232, 236, 0.06)'}
						stroke-width="8"
						stroke-linecap="butt"
						class="rpm-fill"
					/>
				{/if}
				{#if rpmFinal > ZONE1}
					<path
						d={arcPath(
							CX,
							CY,
							R,
							GAUGE_START + GAUGE_SWEEP * ZONE1,
							Math.min((rpmFinal - ZONE1) / ZONE2, 1) * GAUGE_SWEEP * ZONE2,
						)}
						fill="none"
						stroke={vehicleState.ignition ? 'var(--color-warning)' : 'rgba(232, 232, 236, 0.06)'}
						stroke-width="8"
						stroke-linecap="butt"
						stroke-dasharray="{ZONE_DASH} {ZONE_GAP}"
					/>
				{/if}
				{#if rpmFinal > ZONE1 + ZONE2}
					<path
						d={arcPath(
							CX,
							CY,
							R,
							GAUGE_START + GAUGE_SWEEP * (ZONE1 + ZONE2),
							Math.min((rpmFinal - ZONE1 - ZONE2) / ZONE3, 1) * GAUGE_SWEEP * ZONE3,
						)}
						fill="none"
						stroke={vehicleState.ignition ? 'var(--color-error)' : 'rgba(232, 232, 236, 0.06)'}
						stroke-width="8"
						stroke-linecap="butt"
						stroke-dasharray="{ZONE_DASH} {ZONE_GAP}"
					/>
				{/if}

				{#if !vehicleState.fuelHide}
					<path
						d={arcPath(CX, CY, R_FUEL, GAUGE_START, FUEL_MAX_DEG)}
						fill="none"
						stroke="rgba(232, 232, 236, 0.22)"
						stroke-width="8"
						stroke-linecap="butt"
						stroke-dasharray="{FUEL_DASH} {FUEL_GAP}"
					/>
					{#if fuelSweep > 0}
						<path d={fuelPath} fill="none" stroke={fuelCol} stroke-width="8" stroke-linecap="butt" stroke-dasharray="{FUEL_DASH} {FUEL_GAP}" />
					{/if}
				{/if}

				{#if vehicleState.nos > 0 && nosSweep > 0}
					<path d={nosPath} fill="none" stroke="#0078ec" stroke-width="6" stroke-linecap="round" />
				{/if}

				{#each TICKS as tick (tick.label)}
					{@const pos = tickLabelTransform(tick.deg)}
					<text x={pos.x} y={pos.y} text-anchor="middle" dominant-baseline="middle" class="tick-label" transform="rotate(-25, {pos.x}, {pos.y})">
						{tick.label}
					</text>
				{/each}
			</svg>

			<div class="center">
				{#if vehicleState.ignition}
					<div class="signals">
						<span class="signal" class:active={vehicleState.leftSignal}><Icon name="arrow-left" size="19px" /></span>
						<span class="signal" class:active={vehicleState.rightSignal}><Icon name="arrow-right" size="19px" /></span>
					</div>
				{/if}

				{#if vehicleState.cruise}
					<div class="cruise"><Icon name="gauge" size="24px" /></div>
				{/if}

				{#if vehicleState.ignition}
					<div class="readout">
						<span class="speed-text">{Math.round(vehicleState.speed)}</span>
						<div class="divider"></div>
						<div class="rpm-col">
							<span class="rpm-text" style:color={rpmDigitColor(rpmNorm)}>{(rpmFinal * 8).toFixed(1)}</span>
							<span class="rpm-unit">×1000</span>
						</div>
					</div>
				{:else}
					<span class="off-text">OFF</span>
				{/if}

				<span class="speed-measure">{vehicleState.speedMeasure}</span>
			</div>

			{#if vehicleState.ignition && !vehicleState.fuelHide}
				<div class="fuel-icon" style:color={fuelCol} class:flash={vehicleState.fuel <= 10}>
					<Icon name="gas-pump" size="15px" />
				</div>
				<span class="fuel-pct" style:color={fuelCol}>{Math.round(vehicleState.fuel)}%</span>
			{/if}

			{#if vehicleState.ignition && vehicleState.mileage != null}
				<div class="mileage">{Math.round(vehicleState.mileage).toLocaleString()} mi</div>
			{/if}

			{#if !vehicleState.seatbeltHide}
				<div class="seatbelt" class:buckled={vehicleState.seatbelt}>
					<Icon name="user-shield" size="24px" />
				</div>
			{/if}

			<div class="status-row">
				<span class="status-icon" class:active={vehicleState.checkEngine} class:flash={vehicleState.checkEngine}>
					<Icon name="oil-can" size="24px" />
				</span>
				<span class="status-icon" class:on={vehicleState.headlights}>
					<Icon name="lightbulb" size="24px" />
				</span>
				<span class="status-icon" class:locked={vehicleState.doorLock}>
					<Icon name={vehicleState.doorLock ? 'lock' : 'lock-open'} size="24px" />
				</span>
			</div>
		</div>
	</div>
{/if}

<style>
	.wrapper {
		position: absolute;
		right: 1.6vw;
		width: fit-content;
		filter: drop-shadow(0 1px 4px rgba(0, 0, 0, 0.85));
	}

	.gauge-shell {
		position: relative;
		width: 250px;
		height: 250px;
		color: var(--color-text);
	}

	.gauge-svg {
		position: absolute;
		inset: 0;
		width: 250px;
		height: 250px;
		transform: rotate(25deg);
		overflow: visible;
	}

	.rpm-fill {
		transition: stroke 200ms ease;
	}

	.tick-label {
		fill: rgba(232, 232, 236, 0.9);
		font-size: 16px;
		font-weight: 700;
		font-family: var(--font-heading);
	}

	.center {
		position: absolute;
		inset: 0;
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		padding-bottom: 10px;
		padding-left: 14px;
	}

	.signals {
		display: flex;
		align-items: center;
		gap: 8px;
		margin-bottom: 6px;
		margin-top: -16px;
		margin-left: -14px;
	}

	.signal {
		display: flex;
		color: rgba(232, 232, 236, 0.35);
	}

	.signal.active {
		color: var(--color-success);
		animation: hud-flash 0.6s linear infinite;
	}

	.cruise {
		color: var(--color-primary);
		margin-bottom: 4px;
	}

	.readout {
		display: flex;
		align-items: center;
		gap: 8px;
	}

	.speed-text {
		font-family: var(--font-lcd);
		font-size: 34px;
		font-weight: 700;
		line-height: 1;
		color: #ffffff;
		letter-spacing: -0.02em;
	}

	.divider {
		width: 1px;
		height: 28px;
		background: rgba(232, 232, 236, 0.2);
		flex-shrink: 0;
	}

	.rpm-col {
		display: flex;
		flex-direction: column;
		align-items: center;
	}

	.rpm-text {
		font-family: var(--font-lcd);
		font-size: 19px;
		font-weight: 700;
		line-height: 1;
	}

	.rpm-unit {
		font-size: 11px;
		color: rgba(232, 232, 236, 0.4);
		letter-spacing: 0.08em;
		line-height: 1;
		margin-top: 5px;
	}

	.off-text {
		font-size: 24px;
		color: rgba(232, 232, 236, 0.25);
		letter-spacing: 0.14em;
	}

	.speed-measure {
		font-size: 12px;
		color: rgba(232, 232, 236, 0.65);
		letter-spacing: 0.12em;
		text-transform: uppercase;
		margin-top: 3px;
	}

	.fuel-icon {
		position: absolute;
		left: 54px;
		top: 108px;
	}

	.fuel-icon.flash {
		animation: hud-flash 0.5s linear infinite;
	}

	.fuel-pct {
		position: absolute;
		left: 33px;
		top: 128px;
		font-size: 11px;
		font-weight: 600;
		line-height: 1;
	}

	.mileage {
		position: absolute;
		bottom: 74px;
		left: 60px;
		right: 0;
		text-align: center;
		font-family: var(--font-lcd);
		font-size: 15px;
		font-weight: 700;
		color: var(--color-warning);
		letter-spacing: 0.06em;
	}

	.seatbelt {
		position: absolute;
		bottom: 74px;
		left: 0;
		right: 124px;
		display: flex;
		justify-content: center;
		color: var(--color-error);
	}

	.seatbelt.buckled {
		color: var(--color-success);
	}

	.status-row {
		position: absolute;
		bottom: 32px;
		left: 0;
		right: 56px;
		display: flex;
		justify-content: center;
		gap: 10px;
	}

	.status-icon {
		color: rgba(232, 232, 236, 0.65);
	}

	.status-icon.active {
		color: var(--color-error);
	}

	.status-icon.flash {
		animation: hud-flash-mild 1s linear infinite;
	}

	.status-icon.on {
		color: #ffffff;
	}

	.status-icon.locked {
		color: var(--color-error);
	}

	@keyframes hud-flash {
		50% {
			opacity: 0.35;
		}
	}

	@keyframes hud-flash-mild {
		50% {
			opacity: 0.5;
		}
	}
</style>
