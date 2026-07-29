// central NUI message router, forwards SendNUIMessage calls to whichever store module owns that message type

import { handleAppMessage } from './store/app.svelte';
import { handleStatusMessage } from './store/status.svelte';
import { handleVehicleMessage } from './store/vehicle.svelte';
import { handleLocationMessage } from './store/location.svelte';
import { handleHudMessage } from './store/hud.svelte';
import { handleNotificationsMessage } from './store/notifications.svelte';
import { handleActionMessage, handleInteractionMessage, handleThirdEyeMessage, handleListMessage } from './store/menu.svelte';
import { handleConfirmMessage, handleInputMessage, handleProgressMessage, handleInfoOverlayMessage } from './store/dialogs.svelte';
import { handleOverlayMessage, handleGemTableMessage, handleMethMessage } from './store/misc.svelte';

interface InboundMessage {
	type?: string;
	data?: unknown;
}

function route(type: string, data: unknown) {
	const record = (data ?? {}) as Record<string, unknown>;
	handleAppMessage(type, record);
	handleStatusMessage(type, record);
	handleVehicleMessage(type, record);
	handleLocationMessage(type, record);
	handleHudMessage(type, record);
	handleNotificationsMessage(type, record);
	handleActionMessage(type, record);
	handleInteractionMessage(type, record);
	handleThirdEyeMessage(type, record);
	handleListMessage(type, record);
	handleConfirmMessage(type, record);
	handleInputMessage(type, record);
	handleProgressMessage(type, record);
	handleInfoOverlayMessage(type, record);
	handleOverlayMessage(type, data);
	handleGemTableMessage(type, record);
	handleMethMessage(type, record);
}

/** Returns an unsubscribe function */
export function attachMessageListener(): () => void {
	const handler = (event: MessageEvent<InboundMessage>) => {
		if (!event.isTrusted) return;
		if (event.data?.type) route(event.data.type, event.data.data);
	};
	window.addEventListener('message', handler);
	return () => window.removeEventListener('message', handler);
}

export { route as applyMessage };
