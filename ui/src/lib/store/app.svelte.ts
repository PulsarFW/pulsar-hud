// app-level state: whole-HUD show/hide, and full-screen effects (dead tint, blindfold, flashbang, death text)
// isDead itself lives in the status store, not here

export type ReleaseType = 'knockout' | 'death' | 'hospital' | 'hospital_rp';

interface Flashbanged {
	strength: number;
	duration: number;
}

export const appState = $state({
	hidden: false,
	blindfolded: false,
	flashbanged: null as Flashbanged | null,

	isDeathTexts: false,
	isReleasing: false,
	deathTime: 0,
	releaseTimer: 0,
	releaseType: null as ReleaseType | null,
	releaseKey: '',
	helpKey: '',
	medicalPrice: 0,

	sniper: false,
	armed: false,
});

export function handleAppMessage(type: string, data: Record<string, unknown>) {
	switch (type) {
		case 'APP_SHOW':
			appState.hidden = false;
			break;
		case 'APP_HIDE':
			appState.hidden = true;
			break;
		case 'SET_BLINDFOLD':
			appState.blindfolded = !!data.state;
			break;
		case 'SET_FLASHBANGED':
			appState.flashbanged = { strength: (data.strength as number) ?? 0, duration: (data.duration as number) ?? 3000 };
			break;
		case 'CLEAR_FLASHBANGED':
			appState.flashbanged = null;
			break;
		case 'DO_DEATH_TEXT':
			appState.isDeathTexts = true;
			appState.isReleasing = false;
			appState.deathTime = (data.deathTime as number) * 1000;
			appState.releaseTimer = (data.timer as number) * 1000;
			appState.releaseType = data.type as ReleaseType;
			appState.releaseKey = data.key as string;
			appState.helpKey = data.f1Key as string;
			appState.medicalPrice = (data.medicalPrice as number) ?? 0;
			break;
		case 'DO_DEATH_RELEASING':
			appState.isReleasing = true;
			break;
		case 'HIDE_DEATH_TEXT':
			appState.isDeathTexts = false;
			appState.isReleasing = false;
			appState.deathTime = 0;
			appState.releaseTimer = 0;
			appState.releaseType = null;
			appState.releaseKey = '';
			appState.helpKey = '';
			appState.medicalPrice = 0;
			break;
		case 'SHOW_SCOPE':
			appState.sniper = true;
			break;
		case 'HIDE_SCOPE':
			appState.sniper = false;
			break;
		case 'ARMED':
			appState.armed = !!data.state;
			break;
	}
}
