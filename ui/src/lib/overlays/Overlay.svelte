<script lang="ts">
	import huntingMapDark from '../../assets/images/hunting-map-dark.webp';
	import huntingMapLight from '../../assets/images/hunting-map-light.webp';
	import { overlayState } from '../store/misc.svelte';

	const first = $derived(overlayState.data[0]);
	const image = $derived.by(() => {
		if (!first) return null;
		if (first.Name === 'hunting_map_dark') return huntingMapDark;
		if (first.Name === 'hunting_map_light') return huntingMapLight;
		if (first.Name.includes('vanityitem')) return first.MetaData?.CustomItemImage ?? null;
		return null;
	});
</script>

{#if overlayState.showing && image}
	<div class="wrapper">
		<div class="panel" style:background-image="url({image})"></div>
	</div>
{/if}

<style>
	.wrapper {
		position: absolute;
		top: 25vh;
		left: 2vw;
	}

	.panel {
		width: 25vw;
		height: 50vh;
		background-size: contain;
		background-repeat: no-repeat;
		background-position: center;
	}
</style>
