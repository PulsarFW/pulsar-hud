<!-- uppercase status title (red for dead, amber for knocked out), a countdown line using the same key-chip as Action.svelte, muted hint line -->
<script lang="ts">
	import { onDestroy } from 'svelte';
	import { appState } from '../store/app.svelte';

	let now = $state(Date.now());
	let ticker: ReturnType<typeof setInterval>;
	ticker = setInterval(() => (now = Date.now()), 1000);
	onDestroy(() => clearInterval(ticker));

	function formatCountdown(toMs: number): string {
		const remaining = Math.max(0, toMs - now);
		const totalSeconds = Math.ceil(remaining / 1000);
		const m = Math.floor(totalSeconds / 60);
		const s = totalSeconds % 60;
		return `${m}:${String(s).padStart(2, '0')}`;
	}

	const releaseDate = $derived(appState.releaseTimer);
	const medicalAvailableAt = $derived(appState.deathTime + 1000 * 60 * 2);
	const releaseReady = $derived(now > releaseDate);
	const medicalReady = $derived(now > medicalAvailableAt);
	const isDeath = $derived(appState.releaseType === 'death');

	const visible = $derived(appState.isDeathTexts && !!appState.releaseType && !!appState.releaseTimer);

	const title = $derived.by(() => {
		switch (appState.releaseType) {
			case 'knockout':
				return 'Knocked Out';
			case 'death':
				return 'You Are Dead';
			case 'hospital':
				return 'Taken To Hospital';
			case 'hospital_rp':
				return 'Medical Attention Required';
			default:
				return '';
		}
	});

	const releasingLabel = $derived.by(() => {
		switch (appState.releaseType) {
			case 'knockout':
				return 'Standing Up...';
			case 'death':
				return 'Respawning...';
			default:
				return 'Getting Up...';
		}
	});

	const countdownLabel = $derived.by(() => {
		switch (appState.releaseType) {
			case 'knockout':
				return 'Can Stand Up In';
			case 'death':
				return 'Respawn Available In';
			case 'hospital':
				return 'Being Treated';
			default:
				return '';
		}
	});

	const releaseAction = $derived.by(() => {
		switch (appState.releaseType) {
			case 'knockout':
				return 'To Stand Up';
			case 'death':
				return `To Respawn ($${appState.medicalPrice})`;
			default:
				return 'To Get Out Of Bed';
		}
	});
</script>

{#if visible}
	<div class="death-screen">
		<div class="header">
			<div class="title" class:amber={!isDeath}>{title}</div>
			<div class="accent" class:amber={!isDeath}></div>
		</div>

		{#if appState.isReleasing}
			<div class="status">{releasingLabel}</div>
		{:else if appState.releaseType === 'hospital_rp' || releaseReady}
			<div class="key-hint"><span class="key">{appState.releaseKey}</span> {releaseAction}</div>
		{:else}
			<div class="countdown">
				<span class="label">{countdownLabel}</span>
				<span class="timer">{formatCountdown(releaseDate)}</span>
			</div>
		{/if}

		{#if isDeath && !appState.isReleasing}
			<div class="sub">
				{#if !medicalReady}
					Call For Medical Available In <span class="sub-timer">{formatCountdown(medicalAvailableAt)}</span>
				{:else}
					<span class="key sub-key">{appState.helpKey}</span> To Call For Medical Assistance
				{/if}
			</div>
		{/if}
	</div>
{/if}

<style>
	.death-screen {
		position: absolute;
		bottom: 18vh;
		left: 0;
		right: 0;
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 1vh;
		text-align: center;
		pointer-events: none;
	}

	.header {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 0.6vh;
		margin-bottom: 0.4vh;
	}

	.title {
		font-family: var(--font-heading);
		font-size: 2.1vmin;
		font-weight: 700;
		letter-spacing: 0.1em;
		text-transform: uppercase;
		color: var(--color-error);
		text-shadow: 0 0 6px #000000;
		line-height: 1;
	}

	.title.amber {
		color: var(--color-warning);
	}

	.accent {
		width: 3.2vw;
		height: 2px;
		background: var(--color-error);
		opacity: 0.6;
	}

	.accent.amber {
		background: var(--color-warning);
	}

	.status {
		font-size: 1.25vmin;
		font-weight: 600;
		letter-spacing: 0.12em;
		text-transform: uppercase;
		color: var(--color-primary-light);
		text-shadow: 0 0 4px #000000;
		animation: death-pulse 1.2s ease-in-out infinite;
	}

	.countdown {
		display: flex;
		align-items: baseline;
		gap: 0.6vw;
	}

	.countdown .label {
		font-size: 1.1vmin;
		letter-spacing: 0.08em;
		text-transform: uppercase;
		color: var(--color-text-muted);
		text-shadow: 0 0 4px #000000;
	}

	.countdown .timer {
		font-family: var(--font-heading);
		font-size: 1.6vmin;
		font-weight: 700;
		color: var(--color-text);
		text-shadow: 0 0 4px #000000;
	}

	.key-hint {
		font-size: 1.35vmin;
		font-weight: 500;
		color: var(--color-text);
		text-shadow: 0 0 4px #000000;
	}

	.sub {
		font-size: 1.05vmin;
		color: var(--color-text-muted);
		text-shadow: 0 0 4px #000000;
	}

	.key,
	.sub-key {
		display: inline-block;
		color: var(--color-primary-light);
		font-weight: 700;
		background: rgba(139, 92, 246, 0.15);
		padding: 0 0.3vw;
		border-radius: 2px;
	}

	.key::before,
	.sub-key::before {
		content: '(';
	}

	.key::after,
	.sub-key::after {
		content: ')';
	}

	@keyframes death-pulse {
		0%,
		100% {
			opacity: 0.55;
		}
		50% {
			opacity: 1;
		}
	}
</style>
