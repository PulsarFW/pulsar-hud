<!-- native <select> chrome can't be restyled in a CEF NUI, so this is a self-contained listbox instead -->
<script lang="ts">
	interface Option {
		value: string | number;
		label: string;
	}

	let {
		value = $bindable(),
		options,
		placeholder = 'Select...',
	}: {
		value: string | number;
		options: Option[];
		placeholder?: string;
	} = $props();

	let open = $state(false);
	let root: HTMLDivElement;

	const selected = $derived(options.find((o) => o.value === value));

	function toggle() {
		open = !open;
	}

	function pick(opt: Option) {
		value = opt.value;
		open = false;
	}

	function onWindowClick(e: MouseEvent) {
		if (open && root && !root.contains(e.target as Node)) open = false;
	}

	function onWindowKeydown(e: KeyboardEvent) {
		if (open && e.key === 'Escape') open = false;
	}
</script>

<svelte:window onclick={onWindowClick} onkeydown={onWindowKeydown} />

<div class="dropdown" bind:this={root}>
	<button type="button" class="control" class:open onclick={toggle}>
		<span class:placeholder={!selected}>{selected ? selected.label : placeholder}</span>
		<svg class="chevron" class:open viewBox="0 0 12 8" width="10" height="7">
			<path d="M1 1l5 5 5-5" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" />
		</svg>
	</button>

	{#if open}
		<div class="panel">
			<div class="options">
				{#each options as opt (opt.value)}
					<button type="button" class="option" class:active={opt.value === value} onclick={() => pick(opt)}>
						{opt.label}
					</button>
				{/each}
			</div>
		</div>
	{/if}
</div>

<style>
	.dropdown {
		position: relative;
		width: 100%;
	}

	.control {
		width: 100%;
		display: flex;
		align-items: center;
		justify-content: space-between;
		background: rgba(6, 6, 8, 0.9);
		border: var(--border-subtle);
		border-radius: var(--radius);
		padding: 0.8vh 0.7vw;
		font-size: 1.1vmin;
		font-family: inherit;
		color: var(--color-text);
		cursor: pointer;
		text-align: left;
		transition: border-color 120ms ease;
	}

	.control.open {
		border-color: rgba(139, 92, 246, 0.55);
	}

	.placeholder {
		color: var(--color-text-muted);
	}

	.chevron {
		flex-shrink: 0;
		margin-left: 0.6vw;
		color: var(--color-text-muted);
		transition: transform 150ms ease;
	}

	.chevron.open {
		transform: rotate(180deg);
	}

	.panel {
		position: absolute;
		top: calc(100% + 0.5vh);
		left: 0;
		right: 0;
		z-index: 20;
		background: var(--color-bg-panel-alt);
		border: var(--border-subtle);
		border-radius: var(--radius);
		box-shadow: 0 0.8vh 2vh rgba(0, 0, 0, 0.5);
		overflow: hidden;
	}

	.options {
		max-height: 22vh;
		overflow-y: auto;
	}

	.option {
		display: block;
		width: 100%;
		padding: 0.7vh 0.7vw;
		background: transparent;
		border: none;
		font-family: inherit;
		color: var(--color-text);
		font-size: 1.1vmin;
		text-align: left;
		cursor: pointer;
	}

	.option:hover {
		background: rgba(139, 92, 246, 0.12);
	}

	.option.active {
		color: var(--color-primary-light);
	}
</style>
