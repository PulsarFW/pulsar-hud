<!-- imports the full fas icon pack and builds a kebab-case lookup, since icon names here come from server config and aren't enumerable up front -->
<script lang="ts">
	import { fas } from '@fortawesome/free-solid-svg-icons';
	import type { IconDefinition } from '@fortawesome/free-solid-svg-icons';

	const ICONS: Record<string, IconDefinition> = {};
	for (const icon of Object.values(fas)) {
		ICONS[icon.iconName] = icon;
	}

	let { name, size = '1em' }: { name: string | [string, string]; size?: string } = $props();

	const iconName = $derived(Array.isArray(name) ? name[1] : name);
	const icon = $derived(ICONS[iconName] ?? fas.faCircleQuestion);
	const path = $derived(icon.icon[4] as string);
	const viewBox = $derived(`0 0 ${icon.icon[0]} ${icon.icon[1]}`);
</script>

<svg {viewBox} width={size} height={size} fill="currentColor" aria-hidden="true">
	<path d={path} />
</svg>
