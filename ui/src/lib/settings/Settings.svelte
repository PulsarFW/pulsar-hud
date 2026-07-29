<script lang="ts">
	import { hudState } from '../store/hud.svelte';
	import { Nui } from '../nui';
	import Dropdown from '../Dropdown.svelte';
	import type { HudConfig, HudLayout, StatusType, VehicleLayout } from '../types';

	const LAYOUTS: { value: HudLayout; label: string }[] = [
		{ value: 'minimap', label: 'Status Anchored Below Minimap' },
		{ value: 'center', label: 'Status Anchored Bottom Center' },
	];

	const VEHICLE_LAYOUTS: { value: VehicleLayout; label: string }[] = [
		{ value: 'default', label: 'Default' },
		{ value: 'simple', label: 'Simplified' },
		{ value: 'minimal', label: 'Simplified v2' },
	];

	const STATUS_TYPES: { value: StatusType; label: string }[] = [
		{ value: 'icons', label: 'Icon Fill' },
		{ value: 'radial', label: 'Radial' },
	];

	let draft = $state<HudConfig>({ ...hudState.config });

	$effect(() => {
		if (hudState.settings) draft = { ...hudState.config };
	});

	function close() {
		hudState.settings = false;
		Nui.closeUI();
	}

	function save(e: SubmitEvent) {
		e.preventDefault();
		hudState.config = { ...draft };
		Nui.saveConfig(draft);
		close();
	}
</script>

{#if hudState.settings}
	<div class="backdrop" onclick={close} onkeydown={(e) => e.key === 'Escape' && close()} role="button" tabindex="-1" aria-label="Close settings">
		<div class="dialog-shell" onclick={(e) => e.stopPropagation()} onkeydown={(e) => e.stopPropagation()} role="dialog" aria-modal="true" tabindex="-1">
			<form class="dialog" onsubmit={save}>
			<div class="title">HUD Configuration</div>

			<div class="columns">
				<div class="col">
					<div class="section-header">General Settings</div>
					<label class="switch-row">
						<input type="checkbox" bind:checked={draft.maskRadio} />
						Mask Radio Channel On HUD?
					</label>

					<label class="field">
						Status HUD Layout
						<Dropdown bind:value={draft.layout} options={LAYOUTS} />
					</label>

					{#if draft.layout === 'minimap'}
						<label class="switch-row">
							<input type="checkbox" bind:checked={draft.minimapAnchor} />
							Anchor To Minimap
						</label>
					{/if}

					<div class="section-header">Compass Settings</div>
					<label class="switch-row">
						<input type="checkbox" bind:checked={draft.hideCompassBg} />
						Hide Compass Background
					</label>
					<label class="switch-row">
						<input type="checkbox" bind:checked={draft.hideCrossStreet} />
						Hide Cross Street
					</label>
				</div>

				<div class="col">
					<div class="section-header">Status Settings</div>
					<label class="field">
						Status Display Type
						<Dropdown bind:value={draft.statusType} options={STATUS_TYPES} />
					</label>

					{#if draft.statusType === 'radial'}
						<label class="switch-row">
							<input type="checkbox" bind:checked={draft.circleNumbers} />
							Show Numbers Instead of Icons (Where Possible)
						</label>
					{/if}

					<div class="section-header">Vehicle Layout Settings</div>
					<label class="field">
						Vehicle HUD Layout
						<Dropdown bind:value={draft.vehicle} options={VEHICLE_LAYOUTS} />
					</label>

					{#if draft.vehicle === 'minimal'}
						<label class="switch-row">
							<input type="checkbox" bind:checked={draft.showRPM} />
							Show RPM
						</label>
					{/if}
				</div>
			</div>

			<div class="actions">
				<button type="button" class="btn btn-ghost" onclick={close}>Cancel</button>
				<button type="submit" class="btn btn-primary">Save</button>
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
		z-index: 200;
		pointer-events: auto;
	}

	.dialog-shell {
		width: 60vw;
		max-height: 85vh;
		overflow-y: auto;
		background: var(--color-bg-panel);
		border: var(--border-subtle);
		border-radius: var(--radius);
	}

	.dialog {
		padding: 2vh 2vw;
	}

	.title {
		font-family: var(--font-heading);
		font-size: 1.8vmin;
		color: var(--color-text);
		margin-bottom: 1.6vh;
	}

	.columns {
		display: flex;
		gap: 2vw;
	}

	.col {
		flex: 1;
		display: flex;
		flex-direction: column;
		gap: 1vh;
	}

	.section-header {
		font-family: var(--font-heading);
		font-size: 1.2vmin;
		color: var(--color-primary-light);
		margin-top: 1.2vh;
	}

	.field {
		display: flex;
		flex-direction: column;
		gap: 0.4vh;
		font-size: 1.1vmin;
		color: var(--color-text-muted);
	}

	.switch-row {
		display: flex;
		align-items: center;
		gap: 0.6vw;
		font-size: 1.1vmin;
		color: var(--color-text);
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
