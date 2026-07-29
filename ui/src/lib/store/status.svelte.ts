// health/armor/dead, dynamic statuses (hunger, thirst, stress, ...), and buff definitions/instances

import type { BuffDefinition, BuffInstance, StatusEntry } from '../types';

export const statusState = $state({
	health: 100,
	maxHealth: 100,
	armor: 100,
	isDead: false,
	statuses: [] as StatusEntry[],
	buffDefs: {} as Record<string, BuffDefinition>,
	buffs: [] as BuffInstance[],
});

export function handleStatusMessage(type: string, data: Record<string, unknown>) {
	switch (type) {
		case 'SET_DEAD':
			statusState.isDead = !!data.state;
			break;
		case 'UPDATE_HP':
			statusState.health = data.hp as number;
			statusState.maxHealth = data.maxHp as number;
			statusState.armor = data.armor as number;
			break;
		case 'REGISTER_STATUS':
			statusState.statuses.push(data.status as StatusEntry);
			break;
		case 'RESET_STATUSES':
			statusState.statuses = [];
			break;
		case 'UPDATE_STATUS': {
			const patch = data.status as StatusEntry;
			const i = statusState.statuses.findIndex((s) => s.name === patch.name);
			if (i !== -1) Object.assign(statusState.statuses[i], patch);
			break;
		}
		case 'UPDATE_STATUS_VALUE': {
			const s = statusState.statuses.find((s) => s.name === data.name);
			if (s) s.value = data.value as number;
			break;
		}
		case 'UPDATE_STATUSES':
			statusState.statuses = (data.statuses as StatusEntry[]) ?? [];
			break;
		case 'REGISTER_BUFF':
			statusState.buffDefs[data.id as string] = data.data as BuffDefinition;
			break;
		case 'BUFF_APPLIED':
			statusState.buffs.push(data.instance as BuffInstance);
			break;
		case 'BUFF_APPLIED_UNIQUE': {
			const instance = data.instance as BuffInstance;
			const existing = statusState.buffs.find((b) => b?.buff === instance?.buff);
			if (existing) {
				Object.assign(existing, instance);
			} else {
				statusState.buffs.push(instance);
			}
			break;
		}
		case 'BUFF_UPDATED': {
			// Lua sends this to patch an existing buff instance - merge fields instead of dropping it
			const patch = data.instance as BuffInstance | undefined;
			if (!patch) break;
			const existing = statusState.buffs.find((b) => b?.buff === patch.buff);
			if (existing) Object.assign(existing, patch);
			break;
		}
		case 'REMOVE_BUFF_BY_TYPE':
			statusState.buffs = statusState.buffs.filter((b) => b?.buff !== data.type);
			break;
	}
}
