// Action prompts, the radial Interaction menu, ThirdEye targeting, and the generic List menu, the targeting/menu family

import type { InteractionMenuItem, ListMenuDef, ThirdEyeMenuItem } from '../types';

interface ActionEntry {
	id: string;
	message: string;
}

export const actionState = $state({
	actions: [] as ActionEntry[],
});

export function handleActionMessage(type: string, data: Record<string, unknown>) {
	switch (type) {
		case 'ADD_ACTION':
			actionState.actions.push({ id: data.id as string, message: data.message as string });
			break;
		case 'REMOVE_ACTION':
			actionState.actions = actionState.actions.filter((a) => a.id !== data.id);
			break;
		case 'REMOVE_ALL_ACTIONS':
			actionState.actions = [];
			break;
	}
}

export const interactionState = $state({
	show: false,
	menuItems: [] as InteractionMenuItem[],
	layer: 0,
});

export function handleInteractionMessage(type: string, data: Record<string, unknown>) {
	switch (type) {
		case 'SHOW_INTERACTION_MENU':
			interactionState.show = !!data.toggle;
			break;
		case 'SET_INTERACTION_LAYER':
			interactionState.layer = data.layer as number;
			break;
		case 'SET_INTERACTION_MENU_ITEMS':
			interactionState.menuItems = [...((data.items as InteractionMenuItem[]) ?? [])].sort((a, b) =>
				a.id < b.id ? -1 : a.id > b.id ? 1 : 0,
			);
			break;
	}
}

export const thirdEyeState = $state({
	showing: false,
	icon: null as string | null,
	menuOpen: false,
	menu: [] as ThirdEyeMenuItem[],
});

export function handleThirdEyeMessage(type: string, data: Record<string, unknown>) {
	switch (type) {
		case 'SHOW_EYE':
			thirdEyeState.showing = true;
			if ('icon' in data) thirdEyeState.icon = (data.icon as string) || null;
			break;
		case 'HIDE_EYE':
			thirdEyeState.showing = false;
			break;
		case 'OPEN_MENU':
			thirdEyeState.menuOpen = true;
			thirdEyeState.menu = (data.menu as ThirdEyeMenuItem[]) ?? [];
			break;
		case 'CLOSE_MENU':
			// Fixed from the original: it spread `...state.icon` (a string/false)
			// instead of `...state`, silently wiping showing/icon on every close
			thirdEyeState.menuOpen = false;
			thirdEyeState.menu = [];
			break;
	}
}

export const listState = $state({
	showing: false,
	active: null as string | null,
	menus: {} as Record<string, ListMenuDef>,
	stack: [] as string[],
});

export function handleListMessage(type: string, data: Record<string, unknown>) {
	switch (type) {
		case 'SET_LIST_MENU':
			listState.showing = true;
			listState.active = 'main';
			listState.menus = (data.menus as Record<string, ListMenuDef>) ?? {};
			listState.stack = [];
			break;
		case 'CHANGE_MENU': {
			const menu = data.menu as string;
			if (!listState.menus[menu] || menu === listState.active) break;
			if (listState.active) listState.stack.push(listState.active);
			listState.active = menu;
			break;
		}
		case 'LIST_GO_BACK':
			listState.active = listState.stack.length > 0 ? listState.stack[listState.stack.length - 1] : 'main';
			listState.stack = listState.stack.slice(0, -1);
			break;
		case 'CLOSE_LIST_MENU':
			listState.showing = false;
			listState.active = null;
			listState.menus = {};
			listState.stack = [];
			break;
	}
}
