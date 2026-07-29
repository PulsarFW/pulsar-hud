<!-- builds [health, armor, ...statuses, buffs, voip] as one flex row for both layouts, no separate buff-anchor setting anymore.
	health always shown, armor only when nonzero, custom stats sorted by order, no background/pill wrapper -->
<script lang="ts">
	import { hudState } from '../store/hud.svelte';
	import { statusState } from '../store/status.svelte';
	import type { StatusEntry } from '../types';
	import StatusBar from './StatusBar.svelte';
	import StatusCircle from './StatusCircle.svelte';
	import VoipChip from './VoipChip.svelte';
	import Buff from './Buff.svelte';

	const health = $derived.by(
		(): StatusEntry => ({
			name: '__health',
			max: 100,
			value: statusState.isDead ? 100 : statusState.health,
			icon: statusState.isDead ? 'skull' : 'heart',
			color: statusState.isDead ? '#ffffff' : 'var(--color-success)',
			flash: true,
			options: {
				hideZero: false,
				visibleWhileDead: true,
				customMax: statusState.isDead ? 100 : statusState.maxHealth,
				forceIcon: statusState.isDead,
			},
		}),
	);

	const armor = $derived.by(
		(): StatusEntry => ({
			name: '__armor',
			max: 100,
			value: statusState.armor,
			icon: 'shield',
			color: statusState.isDead ? '#ffffff' : 'var(--color-info)',
			options: { hideZero: true },
		}),
	);

	// mirrors StatusBar/StatusCircle's own hidden check, including hideHigh, so a phantom divider never shows for self-hiding stats
	function statHidden(status: StatusEntry): boolean {
		const customMax = status.options.customMax;
		return (
			(!!status.options.hideZero && status.value <= 0) ||
			(status.value >= (customMax ? customMax / 0.9 : 90) && !!status.options.hideHigh) ||
			(statusState.isDead && !status.options.visibleWhileDead)
		);
	}

	const customStats = $derived(
		[...statusState.statuses]
			.filter((s) => !statHidden(s))
			.sort((a, b) => (a.options.order ?? 99) - (b.options.order ?? 99)),
	);

	function styleFor(pip: StatusEntry) {
		return pip.options.force ?? hudState.config.statusType;
	}

	const radial = $derived(hudState.config.statusType === 'radial');

	// mirrors Buff.svelte's own hide check so an expired timed buff doesn't leave a divider before nothing
	function buffExpired(buff: (typeof statusState.buffs)[number]): boolean {
		const def = statusState.buffDefs[buff.buff];
		return def?.type === 'timed' && !!buff.val && Date.now() / 1000 - (buff.startTime ?? 0) > buff.val;
	}

	const validBuffs = $derived(statusState.buffs.filter((b) => b && statusState.buffDefs[b.buff] && !buffExpired(b)));
</script>

<div class="row" class:radial>
	{#if styleFor(health) === 'radial'}
		<StatusCircle status={health} size={44} />
	{:else}
		<StatusBar status={health} />
	{/if}

	{#if statusState.armor > 0}
		{#if styleFor(armor) === 'radial'}
			<StatusCircle status={armor} size={44} />
		{:else}
			<StatusBar status={armor} />
		{/if}
	{/if}

	{#if customStats.length > 0}
		<div class="line"></div>
		{#each customStats as pip (pip.name)}
			{#if styleFor(pip) === 'radial'}
				<StatusCircle status={pip} size={38} />
			{:else}
				<StatusBar status={pip} />
			{/if}
		{/each}
	{/if}

	{#if validBuffs.length > 0}
		<div class="line"></div>
		{#each validBuffs as buff, i (buff.buff + i)}
			<Buff {buff} variant={radial ? 'circle' : 'bar'} />
		{/each}
	{/if}

	<div class="line"></div>
	<VoipChip />
</div>

<style>
	.row {
		display: flex;
		align-items: center;
		gap: 0.6vw;
		width: fit-content;
		filter: drop-shadow(0 1px 4px rgba(0, 0, 0, 0.85));
	}

	.row.radial {
		gap: 0.9vw;
	}

	/* thin vertical line, every divider in the row uses this, no dots anywhere */
	.line {
		width: 1px;
		height: 2.2vh;
		background: rgba(232, 232, 236, 0.12);
		flex-shrink: 0;
	}
</style>
