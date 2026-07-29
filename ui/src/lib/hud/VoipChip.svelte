<!-- compact inline VOIP indicator, a single solid-color mic icon that swaps color by talking state, meant to sit at the end of StatusRow -->
<script lang="ts">
	import Icon from '../Icon.svelte';
	import { hudState } from '../store/hud.svelte';

	const VOIP_COLOR_OFF = 'rgba(255, 255, 255, 0.18)';
	const VOIP_COLOR_WHISPER = '#74c0fc';
	const VOIP_COLOR_TALK = '#ffffff';
	const VOIP_COLOR_SHOUT = '#fd7e14';
	const VOIP_COLOR_RADIO_IDLE = 'rgba(255, 255, 255, 0.35)';
	const VOIP_COLOR_RADIO_TALKING = '#339af0';

	const color = $derived.by(() => {
		const { voip, talking } = hudState;
		if (voip === 0 && talking === 0) return VOIP_COLOR_OFF;
		if (talking > 0 && voip > 0) return VOIP_COLOR_RADIO_TALKING;
		if (talking > 0) return VOIP_COLOR_RADIO_IDLE;
		if (voip === 3) return VOIP_COLOR_SHOUT;
		if (voip === 2) return VOIP_COLOR_TALK;
		return VOIP_COLOR_WHISPER;
	});

	const icon = $derived(hudState.voip === 0 && hudState.talking === 0 ? 'microphone-slash' : hudState.voipIcon || 'microphone');
</script>

<div class="chip" style:color>
	<Icon name={icon} size="1.5vmin" />
</div>

<style>
	.chip {
		flex-shrink: 0;
		display: flex;
		filter: drop-shadow(0 1px 3px rgba(0, 0, 0, 0.85));
	}
</style>
