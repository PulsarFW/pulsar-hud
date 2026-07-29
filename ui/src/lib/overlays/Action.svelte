<!-- keybind-hint prompt stack ("Press (E) to open door"), every active prompt renders as its own centered pill in a column -->
<script lang="ts">
	import DOMPurify from 'dompurify';
	import { actionState } from '../store/menu.svelte';

	function render(message: string) {
		return DOMPurify.sanitize(message.replace(/\{key\}/g, '<span class="key">').replace(/\{\/key\}/g, '</span>'));
	}
</script>

{#if actionState.actions.length > 0}
	<div class="stack">
		{#each actionState.actions as action (action.id)}
			<div class="pill">{@html render(action.message)}</div>
		{/each}
	</div>
{/if}

<style>
	.stack {
		position: absolute;
		bottom: 15%;
		left: 0;
		right: 0;
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 0.6vh;
		pointer-events: none;
	}

	.pill {
		max-width: 32vw;
		background: rgba(6, 6, 8, 0.95);
		border: var(--border-primary);
		border-radius: var(--radius);
		padding: 0.9vh 1.1vw;
		font-size: 1.3vmin;
		font-weight: 500;
		text-align: center;
		color: var(--color-text);
		text-shadow: 0 0 3px #000000;
	}

	.pill :global(.key) {
		display: inline-block;
		color: var(--color-primary-light);
		font-weight: 700;
		background: rgba(139, 92, 246, 0.15);
		padding: 0 0.3vw;
		border-radius: 2px;
	}

	.pill :global(.key)::before {
		content: '(';
	}

	.pill :global(.key)::after {
		content: ')';
	}
</style>
