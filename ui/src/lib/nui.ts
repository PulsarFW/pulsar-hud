// outbound UI -> Lua transport, fire-and-forget, real work comes back via SendNUIMessage pushes in messages.ts

const RESOURCE_NAME = 'pulsar_hud';

async function send(event: string, data: unknown = {}): Promise<void> {
	if (import.meta.env.DEV) return;
	try {
		await fetch(`https://${RESOURCE_NAME}/${event}`, {
			method: 'post',
			headers: { 'Content-Type': 'application/json; charset=UTF-8' },
			body: JSON.stringify(data),
		});
	} catch {
		// Expected to fail outside the actual NUI browser
	}
}

export const Nui = {
	closeUI: () => send('CloseUI'),
	saveConfig: (config: unknown) => send('SaveConfig', config),
	confirmYes: (event: string | null, data: unknown) => send('Confirm:Yes', { event, data }),
	confirmNo: (event: string | null, data: unknown) => send('Confirm:No', { event, data }),
	inputSubmit: (event: string | null, values: Record<string, unknown>, data: unknown) => send('Input:Submit', { event, values, data }),
	inputClose: (event: string | null, data: unknown) => send('Input:Close', { event, values: false, data }),
	interactionTrigger: (item: unknown) => send('Interaction:Trigger', item),
	interactionHide: () => send('Interaction:Hide'),
	interactionBack: () => send('Interaction:Back'),
	listClicked: (event: string, data: unknown) => send('ListMenu:Clicked', { event, data }),
	listBack: () => send('ListMenu:Back'),
	listSubMenu: (submenu: string) => send('ListMenu:SubMenu', { submenu }),
	listClose: () => send('ListMenu:Close'),
	targetingAction: (payload: { event: string; data: unknown } | false) => send('targetingAction', payload),
	progressFinish: () => send('Progress:Finish'),
	methStart: (config: unknown) => send('Meth:Start', config),
	methCancel: () => send('Meth:Cancel'),
};
