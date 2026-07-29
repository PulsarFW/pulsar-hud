import type { NotificationEntry } from '../types';

export const notificationsState = $state({
	runningId: 0,
	notifications: [] as NotificationEntry[],
});

export function handleNotificationsMessage(type: string, data: Record<string, unknown>) {
	switch (type) {
		case 'CLEAR_ALERTS':
			notificationsState.runningId = 0;
			notificationsState.notifications = [];
			break;
		case 'ADD_ALERT': {
			const notification = data.notification as Partial<NotificationEntry>;
			const existing = notification._id != null ? notificationsState.notifications.find((n) => n._id === notification._id) : undefined;
			if (existing) {
				Object.assign(existing, notification);
			} else {
				notificationsState.runningId++;
				notificationsState.notifications.push({
					_id: notificationsState.runningId,
					created: Date.now(),
					type: 'standard',
					...notification,
				} as NotificationEntry);
			}
			break;
		}
		case 'REMOVE_ALERT':
			notificationsState.notifications = notificationsState.notifications.filter((n) => n._id !== data.id);
			break;
		case 'HIDE_ALERT': {
			const n = notificationsState.notifications.find((n) => n._id === data.id);
			if (n) n.hide = true;
			break;
		}
	}
}
