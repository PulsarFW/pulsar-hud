<script lang="ts">
	import { onMount } from 'svelte';
	import { Nui } from '../nui';
	import { methState } from '../store/misc.svelte';

	const INGREDIENT_LABELS = ['Acetone', 'Battery Acid', 'Iodine Crystals', 'Sulfuric Acid', 'Phosphorous', 'Gasoline', 'Lithium', 'Anhydrous Ammonia'];

	let ingredientValues = $state<number[]>([]);
	let cookTime = $state(1);

	$effect(() => {
		if (!methState.showing) return;
		ingredientValues = Array(methState.config.ingredients).fill(0);
		cookTime = 1;
	});

	function close() {
		Nui.methCancel();
	}

	function submit(e: SubmitEvent) {
		e.preventDefault();
		Nui.methStart({
			tableId: methState.config.tableId,
			ingredients: ingredientValues,
			cookTime,
		});
	}

	onMount(() => {
		const onKey = (e: KeyboardEvent) => e.key === 'Escape' && close();
		window.addEventListener('keydown', onKey);
		return () => window.removeEventListener('keydown', onKey);
	});
</script>

{#if methState.showing}
	<div class="backdrop" onclick={close} onkeydown={(e) => e.key === 'Escape' && close()} role="button" tabindex="-1" aria-label="Close dialog">
		<div class="dialog-shell" onclick={(e) => e.stopPropagation()} onkeydown={(e) => e.stopPropagation()} role="dialog" aria-modal="true" tabindex="-1">
			<form class="dialog" onsubmit={submit}>
			<div class="title">Select Ingredient Mixture</div>

			<div class="fields">
				{#each { length: methState.config.ingredients } as _, i (i)}
					<label class="field">
						{INGREDIENT_LABELS[i] ?? `Ingredient ${i + 1}`}
						<input type="range" min="0" max="100" step="1" bind:value={ingredientValues[i]} />
						<span class="value">{ingredientValues[i] ?? 0}</span>
					</label>
				{/each}

				<label class="field">
					Cook Time (Minutes)
					<input type="range" min="1" max={methState.config.cookTimeMax} step="1" bind:value={cookTime} />
					<span class="value">{cookTime}</span>
				</label>
			</div>

			<div class="actions">
				<button type="button" class="btn btn-deny" onclick={close}>Cancel</button>
				<button type="submit" class="btn btn-accept">Submit</button>
			</div>
			</form>
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
		width: 32vw;
		max-height: 80vh;
		overflow-y: auto;
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
		margin-bottom: 1.4vh;
	}

	.fields {
		display: flex;
		flex-direction: column;
		gap: 1.4vh;
	}

	.field {
		display: flex;
		flex-direction: column;
		gap: 0.4vh;
		font-size: 1.15vmin;
		color: var(--color-text-muted);
	}

	input[type='range'] {
		width: 100%;
		accent-color: var(--color-primary);
	}

	.value {
		font-size: 1.1vmin;
		color: var(--color-primary-light);
	}

	.actions {
		margin-top: 1.8vh;
		display: flex;
		justify-content: flex-end;
		gap: 0.8vw;
	}

	.btn {
		border: none;
		padding: 0.8vh 1.6vw;
		font-size: 1.15vmin;
		cursor: pointer;
		border-radius: var(--radius);
	}

	.btn-deny {
		background: transparent;
		color: var(--color-error);
		border: 1px solid rgba(229, 72, 77, 0.4);
	}

	.btn-accept {
		background: var(--color-success);
		color: #ffffff;
	}
</style>
