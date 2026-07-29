<!-- segmented tick-bar fill instead of a solid bar, driven by a local client-side timer, not a percentage pushed from Lua -->
<script lang="ts">
	import { Nui } from '../nui';
	import { progressState, finishProgressLocally } from '../store/dialogs.svelte';

	const TICK_COUNT = 24;

	let curr = $state(0);
	let visible = $state(false);
	let hideTimeout: ReturnType<typeof setTimeout> | undefined;
	let tickInterval: ReturnType<typeof setInterval> | undefined;

	$effect(() => {
		// resets on a fresh START_PROGRESS, guarded on `showing` so it doesn't fire once on mount at startTime's initial 0
		progressState.startTime;
		if (!progressState.showing) return;
		curr = 0;
		visible = true;
		if (hideTimeout) clearTimeout(hideTimeout);
	});

	$effect(() => {
		if (progressState.cancelled || progressState.finished || progressState.failed) {
			curr = 0;
			if (hideTimeout) clearTimeout(hideTimeout);
			hideTimeout = setTimeout(() => {
				visible = false;
				progressState.showing = false;
			}, 1800);
		}
	});

	$effect(() => {
		if (!progressState.showing) return;
		tickInterval = setInterval(() => {
			if (progressState.failed || progressState.finished || progressState.cancelled) return;
			if (curr + 10 > progressState.duration) {
				finishProgressLocally();
				Nui.progressFinish();
			} else {
				curr += 10;
			}
		}, 10);
		return () => clearInterval(tickInterval);
	});

	type Phase = 'active' | 'finished' | 'failed' | 'cancelled';
	const phase = $derived<Phase>(
		progressState.finished ? 'finished' : progressState.failed ? 'failed' : progressState.cancelled ? 'cancelled' : 'active',
	);
	const displayLabel = $derived({ finished: 'Done', failed: 'Failed', cancelled: 'Cancelled', active: progressState.label }[phase]);
	const pct = $derived(phase !== 'active' ? 100 : progressState.duration > 0 ? (curr / progressState.duration) * 100 : 0);
	const litTicks = $derived(Math.round((pct / 100) * TICK_COUNT));
	const secsLeft = $derived(Math.max(0, Math.ceil((progressState.duration - curr) / 1000)));
</script>

{#if visible}
	<div class="progress" class:finished={phase === 'finished'} class:failed={phase === 'failed'} class:cancelled={phase === 'cancelled'}>
		<div class="header">
			<span class="label">{displayLabel}</span>
			{#if phase === 'active' && progressState.duration > 0}
				<span class="timer">{secsLeft}<span class="unit">s</span></span>
			{/if}
		</div>

		<div class="ticks">
			{#each { length: TICK_COUNT } as _, i (i)}
				<div class="tick" class:lit={i < litTicks} class:leading={i === litTicks - 1}></div>
			{/each}
		</div>
	</div>
{/if}

<style>
	.progress {
		width: fit-content;
		position: absolute;
		bottom: 19vh;
		left: 50%;
		transform: translateX(-50%);
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 0.8vh;
		filter: drop-shadow(0 1px 6px rgba(0, 0, 0, 0.95));
	}

	.header {
		display: flex;
		align-items: baseline;
		justify-content: space-between;
		gap: 0.6vw;
		width: 100%;
	}

	.label {
		font-size: 1.35vmin;
		font-weight: 600;
		letter-spacing: 0.1em;
		text-transform: uppercase;
		color: var(--color-primary-light);
		white-space: nowrap;
	}

	.timer {
		font-family: var(--font-lcd);
		font-size: 1.25vmin;
		color: var(--color-warning);
		letter-spacing: 0.04em;
		min-width: 2.2vw;
		text-align: right;
	}

	.timer .unit {
		font-family: var(--font-body);
		font-size: 0.7em;
		color: var(--color-text-muted);
		margin-left: 0.2em;
	}

	.ticks {
		display: flex;
		align-items: center;
		gap: 0.35vw;
	}

	.tick {
		width: 0.4vw;
		height: 1.3vh;
		border-radius: 1px;
		background: rgba(232, 232, 236, 0.08);
		transition:
			background 80ms ease,
			box-shadow 80ms ease,
			height 80ms ease;
		flex-shrink: 0;
	}

	.tick.lit {
		background: var(--color-primary);
	}

	.tick.leading {
		height: 1.8vh;
		box-shadow:
			0 0 10px var(--color-primary),
			0 0 4px var(--color-primary);
		animation: tick-bounce 0.6s ease-in-out infinite;
	}

	.progress.finished .tick.lit {
		background: var(--color-success);
	}

	.progress.finished .tick.leading {
		box-shadow:
			0 0 10px var(--color-success),
			0 0 4px var(--color-success);
		animation: none;
	}

	.progress.failed .tick.lit,
	.progress.cancelled .tick.lit {
		background: var(--color-error);
	}

	.progress.failed .tick.leading,
	.progress.cancelled .tick.leading {
		box-shadow:
			0 0 10px var(--color-error),
			0 0 4px var(--color-error);
		animation: none;
	}

	@keyframes tick-bounce {
		0%,
		100% {
			transform: scaleY(1);
		}
		50% {
			transform: scaleY(1.15);
		}
	}
</style>
