<script lang="ts">
	import DOMPurify from 'dompurify';
	import { infoOverlayState } from '../store/dialogs.svelte';
</script>

{#if infoOverlayState.showing}
	<div class="wrapper">
		<div class="row">
			<div class="label">{infoOverlayState.info.label}</div>
			{#if infoOverlayState.info.description}
				<div class="description">{@html DOMPurify.sanitize(infoOverlayState.info.description)}</div>
			{/if}
		</div>
	</div>
{/if}

<style>
	.wrapper {
		width: 100%;
		max-width: 26vw;
		position: absolute;
		top: 1.2vh;
		left: 0;
		right: 0;
		margin: auto;
	}

	.row {
		background: rgba(14, 13, 19, 0.9);
		border: var(--border-subtle);
		padding: 1vh 1vw;
	}

	.label {
		font-size: 1.4vmin;
		color: var(--color-primary-light);
	}

	.description {
		margin-top: 0.4vh;
		font-size: 1.1vmin;
		color: var(--color-text-muted);
	}
</style>
