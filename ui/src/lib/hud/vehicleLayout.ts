import { hudState } from '../store/hud.svelte';

// whether the vehicle cluster should shift up to avoid overlapping the status row
export function isVehicleShiftedUp(): boolean {
	// center's status row sits bottom-center, same area the vehicle cluster wants, so shift up
	return hudState.config.layout === 'center';
}

// zero-padded speed display, e.g. 7 -> "007"
export function formatSpeed(speed: number): string {
	return String(Math.round(speed)).padStart(3, '0');
}

export function fuelColor(fuel: number): string {
	if (fuel >= 50) return 'var(--color-success)';
	if (fuel >= 10) return 'var(--color-warning)';
	if (fuel >= 0) return 'var(--color-error)';
	return 'var(--color-primary)';
}
