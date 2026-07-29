<!-- matches Settings.svelte's dialog language, bg-panel + border-subtle shell, btn-ghost/btn-primary pair -->
<script lang="ts">
	import { onMount } from 'svelte';
	import DOMPurify from 'dompurify';
	import { Nui } from '../nui';
	import { confirmState } from '../store/dialogs.svelte';

	function accept() {
		Nui.confirmYes(confirmState.yes, confirmState.data);
	}

	function deny() {
		Nui.confirmNo(confirmState.no, confirmState.data);
	}

	onMount(() => {
		const onKey = (e: KeyboardEvent) => e.key === 'Escape' && deny();
		window.addEventListener('keydown', onKey);
		return () => window.removeEventListener('keydown', onKey);
	});
</script>

{#if confirmState.showing}
	<div class="backdrop" onclick={deny} onkeydown={(e) => e.key === 'Escape' && deny()} role="button" tabindex="-1" aria-label="Close dialog">
		<div class="dialog-shell" onclick={(e) => e.stopPropagation()} onkeydown={(e) => e.stopPropagation()} role="dialog" aria-modal="true" tabindex="-1">
			<div class="dialog">
				<div class="title">{confirmState.title}</div>
				{#if confirmState.description}
					<div class="description">{@html DOMPurify.sanitize(confirmState.description)}</div>
				{/if}
				<div class="actions">
					<button type="button" class="btn btn-ghost" onclick={deny}>{confirmState.denyLabel ?? 'No'}</button>
					<button type="button" class="btn btn-primary" onclick={accept}>{confirmState.acceptLabel ?? 'Yes'}</button>
				</div>
			</div>
		</div>
	</div>
{/if}

<style>
	.backdrop {
		position: fixed;
		inset: 0;
		background: rgba(0, 0, 0, 0.6);
		display: flex;
		align-items: center;
		justify-content: center;
		z-index: 150;
		pointer-events: auto;
	}

	.dialog-shell {
		width: 30vw;
		background: var(--color-bg-panel);
		border: var(--border-subtle);
		border-radius: var(--radius);
	}

	.dialog {
		padding: 2vh 1.6vw;
	}

	.title {
		font-family: var(--font-heading);
		font-size: 1.6vmin;
		color: var(--color-text);
	}

	.description {
		margin-top: 1.2vh;
		font-size: 1.15vmin;
		color: var(--color-text-muted);
		line-height: 1.5;
	}

	.actions {
		margin-top: 1.8vh;
		display: flex;
		justify-content: flex-end;
		gap: 0.8vw;
	}

	.btn {
		border: none;
		padding: 0.9vh 1.6vw;
		font-size: 1.2vmin;
		font-family: var(--font-body);
		cursor: pointer;
		border-radius: var(--radius);
	}

	.btn-ghost {
		background: transparent;
		color: var(--color-text-muted);
		border: var(--border-subtle);
	}

	.btn-primary {
		background: var(--color-primary);
		color: #ffffff;
	}
</style>
