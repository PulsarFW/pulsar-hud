<!-- icon-fill gauge pip: a ghost copy of the icon tinted with the stat's own color, plus a full-color copy clipped from the top for pct%.
	the glow filter lives on the outer .gauge wrapper, not the clipped .fill layer, since drop-shadow blur ignores clip-path and smears outward otherwise -->
<script lang="ts">
	import Icon from '../Icon.svelte';
	import { statusState } from '../store/status.svelte';
	import type { StatusEntry } from '../types';

	let { status, size = '1.9vmin' }: { status: StatusEntry; size?: string } = $props();

	const customMax = $derived(status.options.customMax);
	const pct = $derived(Math.min(100, Math.max(0, customMax ? (status.value / customMax) * 100 : status.value)));
	const hidden = $derived(
		(status.options.hideZero && status.value <= 0) ||
			(status.value >= (customMax ? customMax / 0.9 : 90) && status.options.hideHigh) ||
			(statusState.isDead && !status.options.visibleWhileDead),
	);
	const low = $derived(pct <= 25);
</script>

{#if !hidden}
	<div class="gauge" class:low style:width={size} style:height={size} style:color={status.color}>
		<div class="ghost">
			<Icon name={status.icon} {size} />
		</div>
		<div class="fill" class:flash={low && status.flash} style:clip-path="inset({100 - pct}% 0 0 0)">
			<Icon name={status.icon} {size} />
		</div>
	</div>
{/if}

<style>
	.gauge {
		position: relative;
		flex-shrink: 0;
		transition: filter 300ms ease;
	}

	.gauge.low {
		filter: drop-shadow(0 0 5px currentColor);
	}

	.ghost {
		position: absolute;
		inset: 0;
		color: currentColor;
		opacity: 0.56;
	}

	.fill {
		position: absolute;
		inset: 0;
		color: currentColor;
		transition: clip-path 350ms cubic-bezier(0.4, 0, 0.2, 1);
	}

	.fill.flash {
		animation: hud-flash 1.4s ease-in-out infinite;
	}

	@keyframes hud-flash {
		0%,
		100% {
			opacity: 1;
		}
		50% {
			opacity: 0.1;
		}
	}
</style>
