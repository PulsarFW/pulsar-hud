// HUD show/hide, settings-dialog open flag, per-character config (server-persisted, see config.ts), minimap rect, VOIP state

import { defaultHudConfig } from '../../config';
import type { HudConfig, MinimapPosition } from '../types';

export const hudState = $state({
	// starts hidden, Lua only sends SHOW_HUD once the player has actually spawned in (client/hud.lua)
	showing: false,
	voip: 0,
	voipIcon: 'microphone',
	talking: 0,
	settings: false,
	config: { ...defaultHudConfig } as HudConfig,
	position: null as MinimapPosition | null,
});

export function handleHudMessage(type: string, data: Record<string, unknown>) {
	switch (type) {
		case 'SHOW_HUD':
			hudState.showing = true;
			break;
		case 'HIDE_HUD':
			hudState.showing = false;
			break;
		case 'TOGGLE_HUD':
			hudState.showing = !hudState.showing;
			break;
		case 'SET_CONFIG':
			hudState.config = (data.config as HudConfig) ?? { ...defaultHudConfig };
			break;
		case 'UPDATE_MM_POS':
			hudState.position = data.position as MinimapPosition;
			break;
		case 'SHIFT_LOCATION':
			// same Lua message also drives the location store's `shifted` flag
			if (data.position) hudState.position = data.position as MinimapPosition;
			break;
		case 'SET_VOIP_LEVEL':
			hudState.voip = data.level as number;
			hudState.talking = data.talking as number;
			hudState.voipIcon = data.icon as string;
			break;
		case 'TOGGLE_SETTINGS':
			hudState.settings = !!data.state;
			break;
	}
}
