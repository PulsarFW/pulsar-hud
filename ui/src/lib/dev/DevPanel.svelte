<!-- dev-only test menu, lets you open any overlay/dialog on demand instead of waiting on mock.ts's fixed sequence -->
<script lang="ts">
	import { applyMessage } from '../messages';

	let open = $state(true);
	let id = 0;
	const nextId = () => ++id;

	function fire(type: string, data: unknown = {}) {
		applyMessage(type, data);
	}

	const actions: { label: string; run: () => void }[] = [
		{
			label: 'Action prompt',
			run: () => fire('ADD_ACTION', { id: 'dev-action', message: 'Press {key}E{/key} To Interact' }),
		},
		{
			label: 'Notification (success)',
			run: () => fire('ADD_ALERT', { notification: { icon: 'circle-check', message: 'Dev-triggered success toast.', duration: 5000, type: 'success' } }),
		},
		{
			label: 'Notification (error)',
			run: () => fire('ADD_ALERT', { notification: { icon: 'circle-xmark', message: 'Dev-triggered error toast.', duration: 5000, type: 'error' } }),
		},
		{
			label: 'Notification (persistent)',
			run: () => fire('ADD_ALERT', { notification: { _id: `dev-pinned-${nextId()}`, icon: 'thumbtack', message: 'Pinned notification — stays until removed.', duration: -1, type: 'info' } }),
		},
		{
			label: 'Confirm dialog',
			run: () => fire('SHOW_CONFIRM', { title: 'Are you sure?', description: 'This is a dev-triggered confirm dialog with a longer description to check wrapping.', yes: null, no: null, data: null }),
		},
		{
			label: 'Input dialog',
			run: () =>
				fire('SHOW_INPUT', {
					title: 'Dev Input Test',
					label: 'Value',
					event: null,
					data: null,
					inputs: [
						{ id: 'name', label: 'Name', type: 'text', options: {} },
						{ id: 'amount', label: 'Amount', type: 'number', options: {} },
						{ id: 'notes', label: 'Notes', type: 'multiline', options: {} },
						{ id: 'choice', label: 'Choice', type: 'select', options: { select: [{ value: 'a', label: 'Option A' }, { value: 'b', label: 'Option B' }] } },
					],
				}),
		},
		{
			label: 'List menu',
			run: () =>
				fire('SET_LIST_MENU', {
					menus: {
						main: {
							label: 'Dev List Menu',
							items: [
								{ label: 'Item One', description: 'A clickable row', event: 'dev:clicked' },
								{ label: 'Go to submenu', description: 'Opens a nested menu', submenu: 'sub' },
								{ label: 'Item with actions', description: 'Trailing icon buttons', actions: [{ icon: 'pen', event: 'dev:edit' }, { icon: 'trash', event: 'dev:delete' }] },
								{ label: 'Disabled item', description: 'Cannot be clicked', disabled: true },
							],
						},
						sub: {
							label: 'Submenu',
							items: [{ label: 'Nested item', description: 'Inside the submenu', event: 'dev:nested' }],
						},
					},
				}),
		},
		{
			label: 'Progress bar',
			run: () => fire('START_PROGRESS', { label: 'Dev Progress Test', duration: 6000 }),
		},
		{
			label: 'Info overlay',
			run: () => fire('SHOW_INFO_OVERLAY', { info: { label: 'Dev Info Overlay', description: 'Some description text for the banner.' } }),
		},
		{
			label: 'Interaction menu',
			run: () => {
				fire('SET_INTERACTION_LAYER', { layer: 0 });
				fire('SET_INTERACTION_MENU_ITEMS', {
					items: [
						{ id: '1', label: 'Open', icon: 'door-open' },
						{ id: '2', label: 'Search', icon: 'magnifying-glass' },
						{ id: '3', label: 'Lock', icon: 'lock' },
						{ id: '4', label: 'Info', icon: 'circle-info' },
					],
				});
				fire('SHOW_INTERACTION_MENU', { toggle: true });
			},
		},
		{
			label: 'ThirdEye reticle + menu',
			run: () => {
				fire('SHOW_EYE', { icon: 'car' });
				fire('OPEN_MENU', {
					menu: [
						{ icon: 'right-to-bracket', text: 'Enter Vehicle', event: 'dev:enter' },
						{ icon: 'magnifying-glass', text: 'Inspect', event: 'dev:inspect' },
					],
				});
			},
		},
		{
			label: 'GemTable overlay',
			run: () => fire('SHOW_GEM_TABLE', { info: 74 }),
		},
		{
			label: 'Meth dialog',
			run: () => fire('OPEN_METH', { config: { tableId: 1, ingredients: 4, cookTimeMax: 60 } }),
		},
		{
			label: 'Overlay (vanity item)',
			run: () => fire('SHOW_OVERLAY', [{ Name: 'vanityitem', MetaData: { CustomItemImage: 'https://placehold.co/400x600/1a1625/8b5cf6?text=Item' } }]),
		},
		{
			label: 'Death text (downed)',
			run: () => fire('DO_DEATH_TEXT', { deathTime: Math.floor(Date.now() / 1000), timer: Math.floor(Date.now() / 1000) + 30, type: 'death', key: 'X', f1Key: 'F1', medicalPrice: 500 }),
		},
		{
			label: 'Clear death text',
			run: () => fire('HIDE_DEATH_TEXT', {}),
		},
		{
			label: 'Set dead',
			run: () => fire('SET_DEAD', { state: true }),
		},
		{
			label: 'Clear dead',
			run: () => fire('SET_DEAD', { state: false }),
		},
		{
			label: 'Blindfold',
			run: () => fire('SET_BLINDFOLD', { state: true }),
		},
		{
			label: 'Clear blindfold',
			run: () => fire('SET_BLINDFOLD', { state: false }),
		},
		{
			label: 'Flashbang',
			run: () => fire('SET_FLASHBANGED', { strength: 0.9, duration: 3000 }),
		},
		{
			label: 'Toggle settings',
			run: () => fire('TOGGLE_SETTINGS', { state: true }),
		},
	];
</script>

<div class="dev-panel">
	<button type="button" class="toggle" onclick={() => (open = !open)}>
		DEV {open ? '▾' : '▸'}
	</button>
	{#if open}
		<div class="grid">
			{#each actions as action (action.label)}
				<button type="button" class="action" onclick={action.run}>{action.label}</button>
			{/each}
		</div>
	{/if}
</div>

<style>
	.dev-panel {
		position: fixed;
		left: 8px;
		bottom: 8px;
		z-index: 9999;
		pointer-events: auto;
		font-family: 'Consolas', monospace;
	}

	.toggle {
		background: #000000;
		color: #ffb800;
		border: 1px solid #ffb800;
		padding: 4px 8px;
		font-size: 11px;
		cursor: pointer;
		font-family: inherit;
	}

	.grid {
		margin-top: 4px;
		display: grid;
		grid-template-columns: repeat(3, minmax(140px, 1fr));
		gap: 4px;
		max-width: 60vw;
		max-height: 40vh;
		overflow-y: auto;
		background: rgba(0, 0, 0, 0.85);
		border: 1px solid #ffb800;
		padding: 6px;
	}

	.action {
		background: #141414;
		color: #eeeeee;
		border: 1px solid #333333;
		padding: 5px 6px;
		font-size: 10.5px;
		text-align: left;
		cursor: pointer;
		font-family: inherit;
	}

	.action:hover {
		background: #262133;
		border-color: #8b5cf6;
		color: #c4a6ff;
	}
</style>
