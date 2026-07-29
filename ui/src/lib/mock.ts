// dev-only simulated Lua message stream, so `bun run dev` shows a live populated HUD

import { applyMessage } from './messages';
import { defaultHudConfig } from '../config';

export function startMockHud(): void {
	applyMessage('APP_SHOW', {});
	applyMessage('SHOW_HUD', {});
	applyMessage('SET_CONFIG', { config: { ...defaultHudConfig } });

	// minimap anchor rect, not consumed by any component right now, kept to exercise the real Lua message
	applyMessage('UPDATE_MM_POS', {
		position: {
			X: 0.081,
			Y: 0.886,
			width: 0.1406,
			height: 0.1762,
			leftX: 0.0107,
			rightX: 0.1514,
			topY: 0.7978,
			bottomY: 0.9741,
		},
	});

	applyMessage('UPDATE_HP', { hp: 82, maxHp: 100, armor: 45 });

	applyMessage('REGISTER_STATUS', {
		status: { name: 'PLAYER_HUNGER', max: 100, value: 62, icon: 'drumstick-bite', color: '#ca5fe8', flash: true, options: { hideZero: false, order: 5 } },
	});
	applyMessage('REGISTER_STATUS', {
		status: { name: 'PLAYER_THIRST', max: 100, value: 8, icon: 'whiskey-glass', color: '#07bdf0', flash: true, options: { hideZero: false, order: 6 } },
	});
	applyMessage('REGISTER_STATUS', {
		status: { name: 'PLAYER_STRESS', max: 100, value: 20, icon: 'face-explode', color: '#de3333', flash: false, options: { hideZero: false, order: 4 } },
	});

	applyMessage('REGISTER_BUFF', { id: 'HANDCUFFED', data: { icon: 'handcuffs', type: 'permanent', color: '#de3333' } });
	applyMessage('REGISTER_BUFF', { id: 'HIGH', data: { icon: 'cannabis', type: 'value', color: '#52984a' } });
	applyMessage('BUFF_APPLIED', { instance: { buff: 'HANDCUFFED', val: 0 } });
	applyMessage('BUFF_APPLIED', { instance: { buff: 'HIGH', val: 64 } });

	applyMessage('UPDATE_LOCATION', {
		location: { main: 'Alta St', cross: 'Forum Dr', area: 'Rancho', direction: 'W' },
	});

	applyMessage('SET_VOIP_LEVEL', { level: 2, talking: 1, icon: 'microphone' });

	setTimeout(() => {
		applyMessage('ADD_ALERT', {
			notification: { icon: 'rocket-launch', message: 'Dev preview loaded — this is a mock notification.', duration: 6000, type: 'success' },
		});
	}, 500);

	setTimeout(() => {
		applyMessage('SHOW_VEHICLE', {});
		applyMessage('UPDATE_IGNITION', { ignition: true });
		applyMessage('UPDATE_SPEED', { speed: 47 });
		applyMessage('UPDATE_RPM', { rpm: 0.55 });
		applyMessage('UPDATE_FUEL', { fuel: 68 });
		applyMessage('UPDATE_SEATBELT', { seatbelt: false });
		applyMessage('UPDATE_NOS', { nos: 72 });
		applyMessage('UPDATE_SIGNALS', { leftSignal: true, rightSignal: false, headlights: true, doorLock: false, mileage: 1284.4 });
	}, 1500);
}
