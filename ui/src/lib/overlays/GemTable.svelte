<script lang="ts">
	import { gemTableState } from '../store/misc.svelte';
</script>

{#if gemTableState.showing}
	<div class="wrapper">
		<div class="bar top">SAGMA Gem Table</div>
		<div class="bar bottom">Appraised Gem Quality: {gemTableState.info}%</div>
	</div>
{/if}

<style>
	.wrapper {
		width: 100%;
		height: 100%;
		position: absolute;
		inset: 0;
	}

	.bar {
		height: 150px;
		background: #000000;
		position: absolute;
		left: 0;
		right: 0;
		text-align: center;
		color: var(--color-text);
	}

	.bar.top {
		top: 0;
		font-size: 2.4vmin;
		line-height: 150px;
	}

	.bar.bottom {
		bottom: 0;
		font-size: 1.4vmin;
		line-height: 150px;
	}
</style>
