// Overlay (hunting map/vanity preview), GemTable (jewel-appraisal bars), Meth (cook-minigame dialog), the leftover one-offs

interface OverlayDatum {
	Name: string;
	MetaData?: { CustomItemImage?: string };
}

export const overlayState = $state({
	showing: false,
	data: [] as OverlayDatum[],
});

export function handleOverlayMessage(type: string, data: unknown) {
	switch (type) {
		case 'SHOW_OVERLAY':
			overlayState.showing = true;
			overlayState.data = (data as OverlayDatum[]) ?? [];
			break;
		case 'CLOSE_UI':
		case 'RESET_UI':
		case 'HIDE_OVERLAY':
			overlayState.showing = false;
			break;
	}
}

export const gemTableState = $state({
	showing: false,
	info: 0,
});

export function handleGemTableMessage(type: string, data: Record<string, unknown>) {
	switch (type) {
		case 'SHOW_GEM_TABLE':
			gemTableState.showing = true;
			gemTableState.info = (data.info as number) ?? 0;
			break;
		case 'CLOSE_GEM_TABLE':
			gemTableState.showing = false;
			break;
	}
}

// `ingredients` is a count of sliders to render, not a list, see pulsar_drugs/shared/meth/config.lua's _tableTiers
export const methState = $state({
	showing: false,
	config: { tableId: null as unknown, ingredients: 0, cookTimeMax: 1 },
});

export function handleMethMessage(type: string, data: Record<string, unknown>) {
	switch (type) {
		case 'OPEN_METH':
			methState.showing = true;
			if (data.config) methState.config = data.config as typeof methState.config;
			break;
		case 'CLOSE_UI':
		case 'RESET_UI':
		case 'CLOSE_METH':
			methState.showing = false;
			methState.config = { tableId: null, ingredients: 0, cookTimeMax: 1 };
			break;
	}
}
