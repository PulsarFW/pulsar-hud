<script lang="ts">
	import blindfoldImg from '../../assets/images/blindfold.webp';
	import { appState } from '../store/app.svelte';
</script>

<div class="blindfold" class:visible={appState.blindfolded} style:background-image="url({blindfoldImg})"></div>

<style>
	.blindfold {
		position: absolute;
		inset: 0;
		background-color: #000000e6;
		background-repeat: no-repeat;
		background-position: 50% 0;
		background-size: cover;
		opacity: 0;
		transition: opacity 300ms ease;
		pointer-events: none;
	}

	.blindfold.visible {
		opacity: 0.99;
	}
</style>
