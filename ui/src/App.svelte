<!-- always-on overlay HUD, not a screen-switcher, every child self-gates its own visibility from its own store slice -->
<script lang="ts">
	import { onMount } from 'svelte';
	import { attachMessageListener } from './lib/messages';

	import Dead from './lib/screen-effects/Dead.svelte';
	import Blindfold from './lib/screen-effects/Blindfold.svelte';
	import Flashbang from './lib/screen-effects/Flashbang.svelte';
	import DeathTexts from './lib/screen-effects/DeathTexts.svelte';

	import InfoOverlay from './lib/overlays/InfoOverlay.svelte';
	import Overlay from './lib/overlays/Overlay.svelte';
	import HudShell from './lib/hud/HudShell.svelte';
	import Notifications from './lib/overlays/Notifications.svelte';
	import Action from './lib/overlays/Action.svelte';
	import Meth from './lib/overlays/Meth.svelte';
	import ListMenu from './lib/overlays/List.svelte';
	import Input from './lib/overlays/Input.svelte';
	import Confirm from './lib/overlays/Confirm.svelte';
	import Progress from './lib/overlays/Progress.svelte';
	import ThirdEye from './lib/overlays/ThirdEye.svelte';
	import Interaction from './lib/overlays/Interaction.svelte';
	import GemTable from './lib/overlays/GemTable.svelte';
	import Settings from './lib/settings/Settings.svelte';

	onMount(() => attachMessageListener());
</script>

<main>
	<Dead />
	<Blindfold />
	<Flashbang />
	<DeathTexts />
	<InfoOverlay />
	<Overlay />
	<HudShell />
	<Notifications />
	<Action />
	<Meth />
	<ListMenu />
	<Input />
	<Confirm />
	<Progress />
	<ThirdEye />
	<Interaction />
	<GemTable />
	<Settings />
</main>

<style>
	main {
		position: relative;
		width: 100vw;
		height: 100vh;
		overflow: hidden;
	}
</style>
