<!-- picks the active Vehicle variant by config.vehicle -->
<script lang="ts">
	import { hudState } from '../store/hud.svelte';
	import VehicleDefault from './VehicleDefault.svelte';
	import VehicleSimple from './VehicleSimple.svelte';
	import VehicleMinimal from './VehicleMinimal.svelte';
</script>

{#if hudState.config.vehicle === 'simple'}
	<VehicleSimple />
{:else if hudState.config.vehicle === 'minimal'}
	<VehicleMinimal />
{:else}
	<VehicleDefault />
{/if}
