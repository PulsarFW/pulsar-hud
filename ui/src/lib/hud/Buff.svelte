<!-- single buff chip, bare icon with an underline bar ('bar' variant) or a draining ring ('circle' variant), driven by config.statusType -->
<script lang="ts">
	import { onDestroy } from 'svelte';
	import Icon from '../Icon.svelte';
	import { statusState } from '../store/status.svelte';
	import type { BuffInstance } from '../types';

	let { buff, variant = 'bar' }: { buff: BuffInstance; variant?: 'bar' | 'circle' } = $props();

	const buffDef = $derived(statusState.buffDefs[buff.buff]);
	const color = $derived(buffDef?.color || 'var(--color-primary)');

	// live countdown for 'timed' buffs, pct counts down from 100 to 0 as elapsed approaches buff.val
	let elapsed = $state(0);
	let timer: ReturnType<typeof setInterval> | undefined;

	$effect(() => {
		if (buffDef?.type !== 'timed' || !buff.startTime) return;
		const tick = () => {
			elapsed = Date.now() / 1000 - buff.startTime!;
		};
		tick();
		const interval = (buff.options?.customInterval as number) ?? 500;
		timer = setInterval(tick, interval);
		return () => clearInterval(timer);
	});

	onDestroy(() => timer && clearInterval(timer));

	const expired = $derived(buffDef?.type === 'timed' && !!buff.val && elapsed > buff.val);
	const pct = $derived.by(() => {
		if (!buffDef) return 0;
		if (buffDef.type === 'permanent') return 100;
		if (buffDef.type === 'timed') {
			if (!buff.val) return 100;
			return Math.max(0, (1 - elapsed / buff.val) * 100);
		}
		return buff.val ?? 100;
	});
	const overrideText = $derived(typeof buff.override === 'string' ? buff.override : '');
	const overrideSmall = $derived(overrideText.length > 2);

	const RING_SIZE = 30;
	const RING_STROKE = 2;
	const r = (RING_SIZE - RING_STROKE * 2) / 2;
	const cx = RING_SIZE / 2;
	const cy = RING_SIZE / 2;
	const circ = 2 * Math.PI * r;
	const offset = $derived(circ * (1 - pct / 100));
</script>

{#if buffDef && !expired}
	<div class="buff">
		{#if variant === 'circle'}
			<div class="ring" style:width="{RING_SIZE}px" style:height="{RING_SIZE}px">
				<svg width={RING_SIZE} height={RING_SIZE}>
					<circle cx={cx} cy={cy} r={r} fill="none" stroke={color} stroke-opacity="0.15" stroke-width={RING_STROKE} />
					<circle
						cx={cx}
						cy={cy}
						r={r}
						fill="none"
						stroke={color}
						stroke-width={RING_STROKE}
						stroke-dasharray={circ}
						stroke-dashoffset={offset}
						stroke-linecap="round"
						transform="rotate(-90 {cx} {cy})"
						class="fill-ring"
					/>
				</svg>
				<div class="ring-icon" style:color>
					{#if overrideText}
						<span class="override" class:small={overrideSmall}>{overrideText}</span>
					{:else}
						<Icon name={buffDef.icon} size="10px" />
					{/if}
				</div>
			</div>
		{:else}
			<div class="icon" style:color>
				{#if overrideText}
					<span class="override" class:small={overrideSmall}>{overrideText}</span>
				{:else}
					<Icon name={buffDef.icon} size="1.5vmin" />
				{/if}
			</div>
			<div class="track">
				<div class="fill" style:width="{pct}%" style:background={color}></div>
			</div>
		{/if}
	</div>
{/if}

<style>
	.buff {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 2px;
		flex-shrink: 0;
	}

	.icon {
		display: flex;
		align-items: center;
		justify-content: center;
		width: 1.8vmin;
		height: 1.8vmin;
	}

	.track {
		width: 1.8vmin;
		height: 3px;
		border-radius: 1px;
		background: rgba(232, 232, 236, 0.08);
		overflow: hidden;
		flex-shrink: 0;
	}

	.fill {
		height: 100%;
		border-radius: 1px;
		transition: width 500ms linear;
	}

	.override {
		font-size: 1vmin;
		font-weight: 700;
	}

	.override.small {
		font-size: 0.8vmin;
	}

	.ring {
		position: relative;
		flex-shrink: 0;
	}

	.fill-ring {
		transition: stroke-dashoffset 400ms ease;
	}

	.ring-icon {
		position: absolute;
		inset: 0;
		display: flex;
		align-items: center;
		justify-content: center;
	}
</style>
