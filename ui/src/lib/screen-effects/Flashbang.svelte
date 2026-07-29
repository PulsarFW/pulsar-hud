<script lang="ts">
	import { appState } from '../store/app.svelte';

	let visible = $state(false);
	let hideTimeout: ReturnType<typeof setTimeout> | undefined;

	$effect(() => {
		if (hideTimeout) clearTimeout(hideTimeout);
		if (appState.flashbanged) {
			visible = true;
			hideTimeout = setTimeout(() => {
				visible = false;
			}, appState.flashbanged.duration || 3000);
		} else {
			visible = false;
		}
		return () => hideTimeout && clearTimeout(hideTimeout);
	});

	function onTransitionEnd() {
		if (!visible) appState.flashbanged = null;
	}
</script>

<div class="flashbang" class:visible style:opacity={visible ? (appState.flashbanged?.strength ?? 0) : 0} ontransitionend={onTransitionEnd}></div>

<style>
	.flashbang {
		position: absolute;
		inset: 0;
		background: #ffffff;
		transition: opacity 300ms ease;
		pointer-events: none;
	}
</style>
