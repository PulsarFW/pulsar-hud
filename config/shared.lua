return {
	Notifications = {
		defaultDuration = 2500, -- ms a toast notification stays on screen when no duration is passed explicitly
	},

	Keybinds = {
		showInteraction = "F1", -- opens the interaction/third-eye menu
		toggleHud = "F11",
		toggleIds = "u", -- shows nearby players' names/IDs overhead
	},

	IDOverhead = {
		range = 25, -- max distance (game units) to see another player's overhead name/ID
		autoHideMs = 6000, -- how long overhead names stay visible before auto-hiding
	},

	Blindfold = {
		durationMs = 6000, -- time it takes to put on/remove a blindfold
	},

	GiveCash = {
		min = 1,
		max = 9999999, -- upper bound on a single /give-cash style transfer
	},

	Vehicle = {
		seatbeltHiddenClasses = { 8, 13, 14, 15, 16 }, -- GTA vehicle class IDs that never show a seatbelt indicator (bikes, planes, helis, etc.)
		checkEngineExcludedClasses = { 13 }, -- classes that never get a check-engine light at all
		damagedPartsExcludedClasses = { 14, 15, 16 }, -- classes skipped by the damaged-parts check (still get the engine-health check below)
		damagedPartThreshold = 25.0, -- part health (0-100) below which the check-engine light trips
		engineHealthThreshold = 400.0, -- engine health (0-1000) below which the check-engine light trips
	},

	-- only the 4 buffs this resource itself registers on spawn - other resources register their own buffs with
	-- their own icon/color independently of this file, not listed here
	Buffs = {
		prog_mod = { icon = "mug-hot", color = "#D6451A" },
		stress_ticks = { icon = "joint", color = "#de3333" },
		heal_ticks = { icon = "suitcase-medical", color = "#52984a" },
		armor_ticks = { icon = "dumbbell", color = "#4056b3" },
	},

	SoundSet = "HUD_FRONTEND_DEFAULT_SOUNDSET", -- GTA frontend sound bank used for menu select/back/cancel sounds

	-- HUD settings a new character starts with; players can change their own via the in-game HUD settings menu
	DefaultHUDConfig = {
		layout = "minimap",
		statusType = "icons",
		vehicle = "default",
		showRPM = true,
		hideCrossStreet = false,
		hideCompassBg = false,
		minimapAnchor = true,
	},
}
