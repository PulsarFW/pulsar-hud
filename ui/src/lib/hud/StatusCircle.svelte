<!-- 270° arc gauge with a 90° gap at the bottom, drawn via SVG stroke-dasharray/dashoffset, glows at or below 25% -->
<script lang="ts">
	import Icon from '../Icon.svelte';
	import { hudState } from '../store/hud.svelte';
	import { statusState } from '../store/status.svelte';
	import type { StatusEntry } from '../types';

	let { status, size = 44 }: { status: StatusEntry; size?: number } = $props();

	const ARC_FRAC = 0.75;

	const customMax = $derived(status.options.customMax);
	const hidden = $derived(
		(status.options.hideZero && status.value <= 0) ||
			(status.value >= (customMax ? customMax / 0.9 : 90) && status.options.hideHigh) ||
			(statusState.isDead && !status.options.visibleWhileDead),
	);

	const stroke = $derived(size >= 40 ? 3 : 2.5);
	const r = $derived((size - stroke * 2) / 2);
	const cx = $derived(size / 2);
	const cy = $derived(size / 2);
	const circ = $derived(2 * Math.PI * r);
	const arcLen = $derived(circ * ARC_FRAC);
	const frac = $derived(Math.min(1, Math.max(0, (customMax ? status.value / customMax : status.value / 100))));
	const offset = $derived(arcLen * (1 - frac));
	const low = $derived(frac <= 0.25);
	const iconSize = $derived(`${Math.round(size * 0.4)}px`);
	const showNumber = $derived(hudState.config.circleNumbers && !status.options.forceIcon);
	const displayValue = $derived(Math.round(status.value));
</script>

{#if !hidden}
	<div class="arc-gauge" style:width="{size}px" style:height="{size}px">
		<svg width={size} height={size} viewBox="0 0 {size} {size}">
			<circle
				cx={cx}
				cy={cy}
				r={r}
				fill="none"
				stroke={status.color}
				stroke-opacity="0.25"
				stroke-width={stroke}
				stroke-dasharray="{arcLen} {circ}"
				stroke-linecap="round"
				transform="rotate(135 {cx} {cy})"
			/>
			<circle
				class="fill-arc"
				class:low
				cx={cx}
				cy={cy}
				r={r}
				fill="none"
				stroke={status.color}
				stroke-width={stroke}
				stroke-dasharray="{arcLen} {circ}"
				stroke-dashoffset={offset}
				stroke-linecap="round"
				transform="rotate(135 {cx} {cy})"
				style:filter={low ? `drop-shadow(0 0 5px ${status.color})` : 'none'}
			/>
		</svg>
		<div class="icon" class:low style:color={status.color}>
			{#if showNumber}
				<span class="number" style:font-size={iconSize}>{displayValue}</span>
			{:else}
				<Icon name={status.icon} size={iconSize} />
			{/if}
		</div>
	</div>
{/if}

<style>
	.arc-gauge {
		position: relative;
		flex-shrink: 0;
	}

	.fill-arc {
		transition: stroke-dashoffset 350ms cubic-bezier(0.4, 0, 0.2, 1);
	}

	.icon {
		position: absolute;
		inset: 0;
		display: flex;
		align-items: center;
		justify-content: center;
		opacity: 0.85;
		transition: opacity 300ms ease;
	}

	.icon.low {
		opacity: 1;
	}

	.number {
		font-family: var(--font-lcd);
		font-weight: 600;
		line-height: 1;
	}
</style>
