import type { LocationInfo } from '../types';

export const locationState = $state({
	showing: true,
	location: { main: '', cross: '', area: '', direction: '' } as LocationInfo,
	shifted: false,
});

export function handleLocationMessage(type: string, data: Record<string, unknown>) {
	switch (type) {
		case 'TOGGLE_LOC':
			locationState.showing = !!data.state;
			break;
		case 'UPDATE_LOCATION':
			locationState.location = data.location as LocationInfo;
			break;
		case 'SHIFT_LOCATION':
			locationState.shifted = !!data.shift;
			break;
	}
}
