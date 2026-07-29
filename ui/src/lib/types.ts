// shared types for the Lua <-> NUI contract, load-bearing far beyond this resource since other resources call plsr.Notification/plsr.Confirm/etc

// ---- Minimap anchor rect (used to position status/vehicle clusters relative
// to the minimap) ----

export interface MinimapPosition {
	X: number;
	Y: number;
	width: number;
	height: number;
	leftX: number;
	rightX: number;
	topY: number;
	bottomY: number;
}

// ---- HUD config (per-character, server-persisted via HUD:SaveConfig) ----

export type HudLayout = 'minimap' | 'center';
export type StatusType = 'icons' | 'radial';
export type VehicleLayout = 'default' | 'simple' | 'minimal';

export interface HudConfig {
	layout: HudLayout;
	statusType: StatusType;
	showRPM: boolean;
	hideCrossStreet: boolean;
	hideCompassBg: boolean;
	minimapAnchor: boolean;
	vehicle: VehicleLayout;
	maskRadio: boolean;
	circleNumbers: boolean;
}

// ---- Status / Buffs ----

export interface StatusOptions {
	hideZero?: boolean;
	hideHigh?: boolean;
	order?: number;
	force?: StatusType;
	customMax?: number;
	visibleWhileDead?: boolean;
	forceIcon?: boolean;
	customInterval?: number;
}

export interface StatusEntry {
	name: string;
	max: number;
	value: number;
	icon: string;
	color: string;
	flash?: boolean;
	inverted?: boolean;
	options: StatusOptions;
}

export type BuffType = 'permanent' | 'timed' | 'value';

export interface BuffDefinition {
	icon: string;
	duration?: number;
	type: BuffType;
	color: string;
}

export interface BuffInstance {
	buff: string;
	val: number;
	// text override for the chip's icon slot, some callers pass literal `false` as a "no override" sentinel
	override?: string | boolean;
	startTime?: number;
	options?: Record<string, unknown>;
}

// ---- Vehicle ----

export interface VehicleState {
	showing: boolean;
	ignition: boolean;
	nos: number;
	speed: number;
	rpm: number;
	speedMeasure: string;
	seatbelt: boolean;
	seatbeltHide: boolean;
	cruise: boolean;
	checkEngine: boolean;
	fuel: number;
	fuelHide: boolean;
}

// ---- Location ----

export interface LocationInfo {
	main: string;
	cross: string;
	area: string;
	direction: string;
}

// ---- Interaction (radial menu) ----

export interface InteractionMenuItem {
	// Top-level menu items get string ids (Lua's RegisterMenu keys them by
	// name); submenu items from ShowMenu() come from a plain Lua array, so
	// ItemsAsMenu assigns them numeric ids via pairs() instead
	id: string | number;
	label: string;
	icon?: string;
	data?: unknown;
}

// ---- ThirdEye ----

export interface ThirdEyeMenuItem {
	icon?: string;
	text: string;
	event: string;
	data?: unknown;
}

// ---- List menu ----

export interface ListItemAction {
	icon: string;
	event: string;
}

export interface ListMenuItem {
	label: string;
	description?: string;
	event?: string;
	submenu?: string;
	actions?: ListItemAction[];
	disabled?: boolean;
	data?: unknown;
}

export interface ListMenuDef {
	label: string;
	items: ListMenuItem[];
	headerAction?: { icon: string; event: string };
}

// ---- Input dialog ----

export interface InputFieldOptions {
	inputProps?: Record<string, unknown>;
	disabled?: boolean;
	value?: unknown;
	select?: { value: string | number; label: string }[];
}

export interface InputField {
	id: string;
	label?: string;
	type?: 'text' | 'number' | 'multiline' | 'select';
	options?: InputFieldOptions;
}

// ---- Notifications ----

export type NotificationType = 'success' | 'warning' | 'error' | 'info' | 'standard' | 'custom';

export interface NotificationStyleOverride {
	alert?: Record<string, string>;
	progress?: Record<string, string>;
	body?: Record<string, string>;
}

export interface NotificationEntry {
	_id: number | string;
	created: number;
	icon?: string;
	message: string;
	duration: number;
	type: NotificationType;
	style?: NotificationStyleOverride;
	hide?: boolean;
}

// ---- Progress ----

export interface ProgressState {
	showing: boolean;
	label: string;
	duration: number;
	cancelled: boolean;
	failed: boolean;
	finished: boolean;
	startTime: number;
}
