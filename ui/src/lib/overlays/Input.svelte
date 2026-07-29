<!-- matches Settings.svelte's dialog language, bg-panel + border-subtle shell, .field label styling, btn-ghost/btn-primary pair -->
<script lang="ts">
	import { onMount } from 'svelte';
	import { Nui } from '../nui';
	import { inputState } from '../store/dialogs.svelte';
	import Dropdown from '../Dropdown.svelte';

	let values = $state<Record<string, string>>({});

	$effect(() => {
		if (!inputState.showing) return;
		const seeded: Record<string, string> = {};
		for (const field of inputState.inputs) {
			seeded[field.id] = String(field.options?.value ?? '');
		}
		values = seeded;
	});

	function submit(e: SubmitEvent) {
		e.preventDefault();
		Nui.inputSubmit(inputState.event, values, inputState.data);
	}

	function close() {
		Nui.inputClose(inputState.event, inputState.data);
	}

	onMount(() => {
		const onKey = (e: KeyboardEvent) => e.key === 'Escape' && close();
		window.addEventListener('keydown', onKey);
		return () => window.removeEventListener('keydown', onKey);
	});
</script>

{#if inputState.showing}
	<div class="backdrop" onclick={close} onkeydown={(e) => e.key === 'Escape' && close()} role="button" tabindex="-1" aria-label="Close dialog">
		<div class="dialog-shell" onclick={(e) => e.stopPropagation()} onkeydown={(e) => e.stopPropagation()} role="dialog" aria-modal="true" tabindex="-1">
			<form class="dialog" onsubmit={submit}>
				<div class="title">{inputState.title}</div>

				<div class="fields">
					{#each inputState.inputs as field (field.id)}
						<label class="field">
							{field.label ?? inputState.label}
							{#if field.type === 'multiline'}
								<textarea rows="3" disabled={field.options?.disabled} bind:value={values[field.id]}></textarea>
							{:else if field.type === 'select'}
								<Dropdown bind:value={values[field.id]} options={field.options?.select ?? []} />
							{:else if field.type === 'number'}
								<input type="number" disabled={field.options?.disabled} bind:value={values[field.id]} />
							{:else}
								<input type="text" disabled={field.options?.disabled} bind:value={values[field.id]} />
							{/if}
						</label>
					{/each}
				</div>

				<div class="actions">
					<button type="button" class="btn btn-ghost" onclick={close}>Cancel</button>
					<button type="submit" class="btn btn-primary">Submit</button>
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
		max-height: 85vh;
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
		margin-bottom: 1.6vh;
	}

	.fields {
		display: flex;
		flex-direction: column;
		gap: 1vh;
	}

	.field {
		display: flex;
		flex-direction: column;
		gap: 0.4vh;
		font-size: 1.1vmin;
		color: var(--color-text-muted);
	}

	input,
	textarea {
		background: var(--color-bg);
		border: var(--border-subtle);
		border-radius: var(--radius);
		padding: 0.7vh 0.6vw;
		font-size: 1.15vmin;
		color: var(--color-text);
	}

	input:focus,
	textarea:focus {
		outline: none;
		border-color: var(--color-primary);
	}

	.actions {
		margin-top: 2vh;
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
