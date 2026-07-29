/*
	Pulsar HUD content config.
	Server owners: this holds the default HUD config used before the server pushes the player's
	real saved config. For colors/fonts, edit theme.css instead.
	Keep defaultHudConfig in sync with the seed default in pulsar_hud/server/server.lua if you change either.
*/

import type { HudConfig } from './lib/types';

export const defaultHudConfig: HudConfig = {
	layout: 'minimap',
	statusType: 'icons',
	showRPM: true,
	hideCrossStreet: false,
	hideCompassBg: false,
	minimapAnchor: true,
	vehicle: 'default',
	maskRadio: false,
	circleNumbers: false,
};
