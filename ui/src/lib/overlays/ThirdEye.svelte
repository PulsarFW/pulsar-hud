<!-- reticle is a filled diamond that glows purple once a target is focused, menu is a themed panel with the same dot-indicator rows as List.svelte -->
<script lang="ts">
	import { onMount } from 'svelte';
	import Icon from '../Icon.svelte';
	import { Nui } from '../nui';
	import { thirdEyeState } from '../store/menu.svelte';

	function menuButtonClick(event: string, data: unknown) {
		Nui.targetingAction({ event, data });
	}

	function closeMenu() {
		Nui.targetingAction(false);
	}

	onMount(() => {
		const onKey = (e: KeyboardEvent) => {
			if (!thirdEyeState.showing) return;
			if (e.key === 'Escape' || e.key === 'Backspace') closeMenu();
		};
		window.addEventListener('keydown', onKey);
		return () => window.removeEventListener('keydown', onKey);
	});
</script>

{#if thirdEyeState.showing}
	<div class="outer">
		<div class="reticle" class:focused={!!thirdEyeState.icon}>
			<div class="ring"></div>
			{#if thirdEyeState.icon}
				<Icon name={thirdEyeState.icon} size="1.5vmin" />
			{/if}
		</div>

		{#if thirdEyeState.menuOpen && thirdEyeState.menu.length > 0}
			<div class="menu">
				{#each thirdEyeState.menu as button, i (i)}
					<button type="button" class="item" onclick={() => menuButtonClick(button.event, button.data)}>
						<div class="dot"></div>
						{#if button.icon}<Icon name={button.icon} size="1vmin" />{/if}
						<span class="label">{button.text}</span>
					</button>
				{/each}
			</div>
		{/if}
	</div>
{/if}

<style>
	.outer {
		position: absolute;
		top: 50%;
		left: 50%;
		width: 0;
		height: 0;
	}

	.reticle {
		position: absolute;
		top: 0;
		left: 0;
		transform: translate(-50%, -50%);
		width: 3.2vmin;
		height: 3.2vmin;
		display: flex;
		align-items: center;
		justify-content: center;
		color: rgba(232, 232, 236, 0.7);
		transition: color 250ms ease;
	}

	.reticle.focused {
		color: var(--color-primary-light);
	}

	.ring {
		position: absolute;
		inset: 15%;
		z-index: -1;
		border-radius: 2px;
		background: rgba(6, 6, 8, 0.95);
		border: 1.5px solid rgba(232, 232, 236, 0.35);
		transform: rotate(45deg);
		transition:
			border-color 250ms ease,
			transform 250ms ease;
	}

	.reticle.focused .ring {
		border-color: var(--color-primary);
		transform: rotate(45deg) scale(1.15);
	}

	.menu {
		position: absolute;
		top: 2.8vmin;
		left: 2.8vmin;
		min-width: 11vw;
		display: flex;
		flex-direction: column;
		background: rgba(6, 6, 8, 0.95);
		border: var(--border-primary);
		border-radius: var(--radius);
		overflow: hidden;
		padding: 0.4vh 0;
		pointer-events: auto;
	}

	.item {
		display: flex;
		align-items: center;
		gap: 0.6vw;
		width: 100%;
		padding: 0.7vh 0.9vw;
		background: transparent;
		border: none;
		font-family: inherit;
		text-align: left;
		cursor: pointer;
		color: rgba(232, 232, 236, 0.75);
		transition: background 120ms ease;
	}

	.item:hover {
		background: rgba(139, 92, 246, 0.1);
		color: var(--color-text);
	}

	.item:hover .dot {
		background: var(--color-primary);
	}

	.item:hover :global(svg) {
		color: var(--color-primary-light);
	}

	.dot {
		width: 4px;
		height: 4px;
		border-radius: 50%;
		background: rgba(232, 232, 236, 0.25);
		flex-shrink: 0;
		transition: background 120ms ease;
	}

	.item :global(svg) {
		flex-shrink: 0;
		color: rgba(232, 232, 236, 0.4);
		transition: color 120ms ease;
	}

	.label {
		font-size: 1.1vmin;
		font-weight: 600;
		white-space: nowrap;
		overflow: hidden;
		text-overflow: ellipsis;
	}
</style>
