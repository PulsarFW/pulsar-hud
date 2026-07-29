// Confirm, Input, Progress, InfoOverlay: the modal-or-near-modal dialog family, CLOSE_UI/RESET_UI close everything

import type { InputField } from '../types';

export const confirmState = $state({
	showing: false,
	yes: null as string | null,
	no: null as string | null,
	data: null as unknown,
	title: null as string | null,
	description: null as string | null,
	denyLabel: null as string | null,
	acceptLabel: null as string | null,
});

function resetConfirm() {
	confirmState.showing = false;
	confirmState.yes = null;
	confirmState.no = null;
	confirmState.data = null;
	confirmState.title = null;
	confirmState.description = null;
	confirmState.denyLabel = null;
	confirmState.acceptLabel = null;
}

export function handleConfirmMessage(type: string, data: Record<string, unknown>) {
	switch (type) {
		case 'SHOW_CONFIRM':
			confirmState.showing = true;
			confirmState.yes = (data.yes as string) ?? null;
			confirmState.no = (data.no as string) ?? null;
			confirmState.data = data.data ?? null;
			confirmState.title = (data.title as string) ?? null;
			confirmState.description = (data.description as string) ?? null;
			confirmState.denyLabel = (data.denyLabel as string) ?? null;
			confirmState.acceptLabel = (data.acceptLabel as string) ?? null;
			break;
		case 'CLOSE_UI':
		case 'RESET_UI':
		case 'CLOSE_CONFIRM':
			resetConfirm();
			break;
	}
}

export const inputState = $state({
	showing: false,
	event: null as string | null,
	title: null as string | null,
	label: null as string | null,
	inputs: [] as InputField[],
	data: null as unknown,
	options: {} as Record<string, unknown>,
});

function resetInput() {
	inputState.showing = false;
	inputState.event = null;
	inputState.title = null;
	inputState.label = null;
	inputState.inputs = [];
	inputState.data = null;
	inputState.options = {};
}

export function handleInputMessage(type: string, data: Record<string, unknown>) {
	switch (type) {
		case 'SHOW_INPUT':
			inputState.showing = true;
			inputState.event = (data.event as string) ?? null;
			inputState.title = (data.title as string) ?? null;
			inputState.label = (data.label as string) ?? null;
			inputState.inputs = (data.inputs as InputField[]) ?? [];
			inputState.data = data.data ?? null;
			inputState.options = (data.options as Record<string, unknown>) ?? {};
			break;
		case 'CLOSE_UI':
		case 'RESET_UI':
		case 'CLOSE_INPUT':
			resetInput();
			break;
	}
}

export const progressState = $state({
	showing: false,
	label: '',
	duration: 0,
	cancelled: false,
	failed: false,
	finished: false,
	startTime: 0,
});

export function handleProgressMessage(type: string, data: Record<string, unknown>) {
	switch (type) {
		case 'START_PROGRESS':
			progressState.label = (data.label as string) ?? '';
			progressState.duration = (data.duration as number) ?? 0;
			progressState.cancelled = false;
			progressState.failed = false;
			progressState.finished = false;
			progressState.showing = true;
			progressState.startTime = Date.now();
			break;
		case 'CANCEL_PROGRESS':
			progressState.cancelled = true;
			progressState.failed = false;
			progressState.finished = false;
			break;
		// Lua sends "FAIL_PROGRESS", not "FAILED_PROGRESS"
		case 'FAIL_PROGRESS':
			progressState.failed = true;
			progressState.cancelled = false;
			progressState.finished = false;
			break;
		case 'HIDE_PROGRESS':
			progressState.showing = false;
			progressState.cancelled = false;
			progressState.failed = false;
			progressState.finished = false;
			break;
	}
}

// Lua only ever sends CANCEL/FAIL/START, call this from Progress's own timer completion to notify Lua the bar finished
export function finishProgressLocally() {
	progressState.finished = true;
	progressState.failed = false;
}

export const infoOverlayState = $state({
	showing: false,
	info: { label: '', description: '' },
});

export function handleInfoOverlayMessage(type: string, data: Record<string, unknown>) {
	switch (type) {
		case 'SHOW_INFO_OVERLAY':
			infoOverlayState.showing = true;
			infoOverlayState.info = data.info as { label: string; description: string };
			break;
		case 'CLOSE_INFO_OVERLAY':
			infoOverlayState.showing = false;
			break;
	}
}
