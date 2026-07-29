<!-- one bordered panel, items separated by a small dot indicator + hover tint instead of per-row borders -->
<script lang="ts">
	import { onMount } from 'svelte';
	import DOMPurify from 'dompurify';
	import Icon from '../Icon.svelte';
	import { Nui } from '../nui';
	import { listState } from '../store/menu.svelte';
	import type { ListMenuItem } from '../types';

	const menu = $derived(listState.active ? listState.menus[listState.active] : null);

	function itemClickable(item: ListMenuItem) {
		return !item.actions && !item.disabled && (!!item.event || !!item.submenu);
	}

	function onItemClick(item: ListMenuItem) {
		if (!itemClickable(item)) return;
		if (item.submenu) {
			Nui.listSubMenu(item.submenu);
			// purely local navigation, no round-trip needed, listSubMenu above is just a fire-and-forget sound cue
			const menuKey = item.submenu;
			if (listState.menus[menuKey] && menuKey !== listState.active) {
				if (listState.active) listState.stack.push(listState.active);
				listState.active = menuKey;
			}
		} else if (item.event) {
			Nui.listClicked(item.event, item.data);
		}
	}

	function onAction(item: ListMenuItem, event: string) {
		Nui.listClicked(event, item.data);
	}

	function onBack() {
		Nui.listBack();
		listState.active = listState.stack.length > 0 ? listState.stack[listState.stack.length - 1] : 'main';
		listState.stack = listState.stack.slice(0, -1);
	}

	function onClose() {
		Nui.listClose();
	}

	function onHeaderAction() {
		if (menu?.headerAction) Nui.listClicked(menu.headerAction.event, undefined);
	}

	onMount(() => {
		const onKey = (e: KeyboardEvent) => {
			if (!listState.showing) return;
			if (e.key === 'Escape') onClose();
		};
		window.addEventListener('keydown', onKey);
		return () => window.removeEventListener('keydown', onKey);
	});
</script>

{#if listState.showing && menu}
	<div class="panel">
		<div class="header">
			<div>
				<div class="title">{menu.label ?? 'Menu'}</div>
				<div class="accent"></div>
			</div>
			<div class="header-actions">
				{#if listState.stack.length > 0}
					<button type="button" class="chip" onclick={onBack} aria-label="Back"><Icon name="arrow-left" size="1.1vmin" /></button>
				{/if}
				{#if menu.headerAction?.event}
					<button type="button" class="chip accent-hover" onclick={onHeaderAction} aria-label="Header action">
						<Icon name={menu.headerAction.icon} size="1.1vmin" />
					</button>
				{/if}
				<button type="button" class="chip" onclick={onClose} aria-label="Close"><Icon name="xmark" size="1.1vmin" /></button>
			</div>
		</div>

		<div class="divider"></div>

		<div class="list">
			{#each menu.items as item, i (i)}
				{@const clickable = itemClickable(item)}
				<svelte:element
					this={clickable ? 'button' : 'div'}
					type={clickable ? 'button' : undefined}
					role={clickable ? 'button' : undefined}
					class="item"
					class:clickable
					class:disabled={item.disabled}
					onclick={clickable ? () => onItemClick(item) : undefined}
				>
					<div class="dot"></div>
					<div class="text">
						<div class="label">{item.label}</div>
						{#if item.description}
							<div class="description">{@html DOMPurify.sanitize(item.description)}</div>
						{/if}
					</div>
					{#if item.submenu}
						<Icon name="chevron-right" size="0.9vmin" />
					{/if}
					{#if item.actions}
						<div class="actions">
							{#each item.actions as action, k (k)}
								<button
									type="button"
									class="row-action"
									onclick={(e) => {
										e.stopPropagation();
										onAction(item, action.event);
									}}
									aria-label={action.event}
								>
									<Icon name={action.icon} size="1vmin" />
								</button>
							{/each}
						</div>
					{/if}
				</svelte:element>
			{/each}
		</div>
	</div>
{/if}

<style>
	.panel {
		width: 100%;
		max-width: 24vw;
		position: absolute;
		top: 12vh;
		right: 15%;
		max-height: 65vh;
		display: flex;
		flex-direction: column;
		background: rgba(6, 6, 8, 0.99);
		border: var(--border-primary);
		border-radius: var(--radius);
		overflow: hidden;
		pointer-events: auto;
	}

	.header {
		flex-shrink: 0;
		display: flex;
		align-items: flex-start;
		justify-content: space-between;
		padding: 1.4vh 1.1vw 1.1vh;
	}

	.title {
		font-size: 1.1vmin;
		font-weight: 700;
		letter-spacing: 0.1em;
		text-transform: uppercase;
		color: var(--color-text);
		line-height: 1;
	}

	.accent {
		width: 1.6vw;
		height: 2px;
		background: var(--color-primary);
		margin-top: 0.6vh;
	}

	.header-actions {
		display: flex;
		align-items: center;
		gap: 0.6vw;
		padding-top: 0.1vh;
	}

	.chip {
		background: transparent;
		border: none;
		color: rgba(232, 232, 236, 0.45);
		cursor: pointer;
		padding: 0.2vh;
		display: flex;
		transition: color 120ms ease;
	}

	.chip:hover {
		color: var(--color-text);
	}

	.chip.accent-hover:hover {
		color: var(--color-primary-light);
	}

	.divider {
		height: 1px;
		background: rgba(232, 232, 236, 0.08);
		flex-shrink: 0;
	}

	.list {
		flex: 1;
		min-height: 0;
		overflow-y: auto;
	}

	.item {
		display: flex;
		align-items: center;
		gap: 0.7vw;
		width: 100%;
		padding: 1vh 1.1vw;
		color: inherit;
		background: transparent;
		border: none;
		font-family: inherit;
		text-align: left;
		transition: background 120ms ease;
	}

	.item.clickable {
		cursor: pointer;
	}

	.item.clickable:hover {
		background: rgba(139, 92, 246, 0.08);
	}

	.item.clickable:hover .dot {
		background: var(--color-primary);
	}

	.item.clickable:hover .label {
		color: var(--color-text);
		font-weight: 600;
	}

	.item.clickable:hover :global(svg) {
		color: var(--color-primary-light);
	}

	.item.disabled {
		opacity: 0.35;
		pointer-events: none;
	}

	.dot {
		width: 5px;
		height: 5px;
		border-radius: 50%;
		background: rgba(232, 232, 236, 0.2);
		flex-shrink: 0;
		transition: background 120ms ease;
	}

	.text {
		flex: 1;
		min-width: 0;
	}

	.label {
		font-size: 1.1vmin;
		color: rgba(232, 232, 236, 0.75);
		line-height: 1;
		white-space: nowrap;
		overflow: hidden;
		text-overflow: ellipsis;
		transition: color 120ms ease;
	}

	.description {
		font-size: 0.95vmin;
		color: rgba(232, 232, 236, 0.35);
		margin-top: 0.4vh;
		line-height: 1.3;
	}

	.item :global(svg) {
		color: rgba(232, 232, 236, 0.25);
		flex-shrink: 0;
		transition: color 120ms ease;
	}

	.actions {
		display: flex;
		gap: 0.5vw;
		flex-shrink: 0;
	}

	.row-action {
		background: transparent;
		border: none;
		color: rgba(232, 232, 236, 0.35);
		cursor: pointer;
		padding: 0;
		display: flex;
		transition: color 120ms ease;
	}

	.row-action:hover {
		color: var(--color-primary-light);
	}
</style>
