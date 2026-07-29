<!-- radial pie menu, items placed by trigonometry around a center back/close button, no react-pie-menu dependency needed -->
<script lang="ts">
	import { onMount } from 'svelte';
	import Icon from '../Icon.svelte';
	import { Nui } from '../nui';
	import { interactionState } from '../store/menu.svelte';

	const RADIUS = 190;

	function positionFor(index: number, total: number) {
		const angle = (index / total) * 2 * Math.PI - Math.PI / 2;
		const x = Math.cos(angle) * RADIUS;
		const y = Math.sin(angle) * RADIUS;
		return `translate(${x}px, ${y}px)`;
	}

	let triggering = false;
	function trigger(item: (typeof interactionState.menuItems)[number]) {
		// guards against double-fire, one flag instead of a debounce library
		if (triggering) return;
		triggering = true;
		Nui.interactionTrigger(item);
		setTimeout(() => (triggering = false), 50);
	}

	function back() {
		if (interactionState.layer === 0) {
			Nui.interactionHide();
		} else {
			Nui.interactionBack();
		}
	}

	onMount(() => {
		const onKey = (e: KeyboardEvent) => {
			if (!interactionState.show) return;
			if (e.key === 'F1' || e.key === 'Escape') Nui.interactionHide();
		};
		window.addEventListener('keydown', onKey);
		return () => window.removeEventListener('keydown', onKey);
	});
</script>

{#if interactionState.show}
	<div class="stage">
		<div class="ring">
			{#each interactionState.menuItems as item, i (item.id)}
				<button
					type="button"
					class="slice"
					style:transform={positionFor(i, interactionState.menuItems.length)}
					onclick={() => trigger(item)}
				>
					<Icon name={item.icon ?? 'question'} size="2vmin" />
					{#if item.label}<span class="label">{item.label}</span>{/if}
				</button>
			{/each}
			<button type="button" class="back" onclick={back} aria-label={interactionState.layer === 0 ? 'Close' : 'Back'}>
				<Icon name={interactionState.layer === 0 ? 'circle-xmark' : 'circle-arrow-left'} size="2.2vmin" />
			</button>
		</div>
	</div>
{/if}

<style>
	.stage {
		position: absolute;
		inset: 0;
		display: flex;
		align-items: center;
		justify-content: center;
		pointer-events: auto;
	}

	.ring {
		position: relative;
		width: 1px;
		height: 1px;
	}

	.slice {
		position: absolute;
		top: -34px;
		left: -34px;
		width: 68px;
		height: 68px;
		border-radius: var(--radius);
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		gap: 4px;
		background: rgba(6, 6, 8, 0.95);
		border: var(--border-primary);
		color: var(--color-primary-light);
		cursor: pointer;
		transition:
			background 150ms ease,
			color 150ms ease,
			border-color 150ms ease;
	}

	.slice:hover {
		background: #1e1533;
		color: #ffffff;
		border-color: var(--color-primary);
	}

	.label {
		font-size: 0.75rem;
		text-align: center;
		color: var(--color-text);
	}

	.slice:hover .label {
		color: #ffffff;
	}

	.back {
		position: absolute;
		top: -40px;
		left: -40px;
		width: 80px;
		height: 80px;
		border-radius: 50%;
		display: flex;
		align-items: center;
		justify-content: center;
		background: rgba(6, 6, 8, 0.95);
		border: 2px solid rgba(139, 92, 246, 0.55);
		color: var(--color-primary-light);
		cursor: pointer;
		transition:
			background 150ms ease,
			color 150ms ease,
			border-color 150ms ease;
	}

	.back:hover {
		background: #1e1533;
		border-color: var(--color-primary);
		color: #ffffff;
	}
</style>
