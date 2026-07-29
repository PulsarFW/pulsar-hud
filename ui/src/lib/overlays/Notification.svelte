<!-- fixed-width tinted icon block on the left, message/timestamp stacked to its right, relative-time formatting ("2m ago") -->
<script lang="ts">
	import { onDestroy, untrack } from 'svelte';
	import DOMPurify from 'dompurify';
	import Icon from '../Icon.svelte';
	import { notificationsState } from '../store/notifications.svelte';
	import type { NotificationEntry } from '../types';

	let { notification, animationDelay = 0 }: { notification: NotificationEntry; animationDelay?: number } = $props();

	type Status = 'waiting' | 'visible' | 'exiting';
	let status = $state<Status>('waiting');
	let timer = $state(0);
	let now = $state(Date.now());

	const TYPE_ICON: Record<string, string> = {
		success: 'circle-check',
		warning: 'triangle-exclamation',
		error: 'circle-xmark',
	};

	const TYPE_COLOR: Record<string, string> = {
		success: 'var(--color-success)',
		warning: 'var(--color-warning)',
		error: 'var(--color-error)',
		info: 'var(--color-info)',
	};

	// precomputed tints, not color-mix(), FiveM's CEF build silently drops that declaration entirely
	const TYPE_TINT: Record<string, string> = {
		success: 'rgba(107, 207, 107, 0.15)',
		warning: 'rgba(240, 168, 72, 0.15)',
		error: 'rgba(229, 72, 77, 0.15)',
		info: 'rgba(91, 163, 224, 0.15)',
	};

	let entranceTimeout: ReturnType<typeof setTimeout>;
	let exitTimeout: ReturnType<typeof setTimeout>;
	let tickInterval: ReturnType<typeof setInterval>;
	let clockInterval: ReturnType<typeof setInterval>;

	// one-shot stagger read once at mount, not re-applied if animationDelay changes later
	entranceTimeout = setTimeout(() => (status = 'visible'), untrack(() => animationDelay));
	clockInterval = setInterval(() => (now = Date.now()), 60000);

	function hide() {
		notificationsState.notifications = notificationsState.notifications.filter((n) => n._id !== notification._id);
	}

	$effect(() => {
		if (notification.duration > 0 && timer >= notification.duration && status !== 'exiting') {
			status = 'exiting';
			exitTimeout = setTimeout(hide, 300);
		}
	});

	$effect(() => {
		if (notification.hide && status !== 'exiting') {
			status = 'exiting';
			exitTimeout = setTimeout(hide, 300);
		}
	});

	$effect(() => {
		if (notification.duration <= 0 || status !== 'visible' || timer >= notification.duration) return;
		tickInterval = setInterval(() => (timer += 100), 100);
		return () => clearInterval(tickInterval);
	});

	onDestroy(() => {
		clearTimeout(entranceTimeout);
		clearTimeout(exitTimeout);
		clearInterval(tickInterval);
		clearInterval(clockInterval);
	});

	const progressPct = $derived(notification.duration > 0 ? 100 - (timer / notification.duration) * 100 : 100);
	const icon = $derived(notification.icon || TYPE_ICON[notification.type] || 'circle-info');
	const accent = $derived(TYPE_COLOR[notification.type] ?? 'var(--color-info)');
	const iconTint = $derived(TYPE_TINT[notification.type] ?? TYPE_TINT.info);
	const relativeTime = $derived.by(() => {
		const seconds = Math.max(0, Math.floor((now - notification.created) / 1000));
		if (seconds < 60) return 'just now';
		const minutes = Math.floor(seconds / 60);
		if (minutes < 60) return `${minutes}m ago`;
		const hours = Math.floor(minutes / 60);
		if (hours < 24) return `${hours}h ago`;
		return `${Math.floor(hours / 24)}d ago`;
	});
</script>

<div class="slide" class:visible={status === 'visible'} class:exiting={status === 'exiting'}>
	<div class="toast" style:background={notification.style?.alert?.background}>
		<div class="row">
			<div class="icon-block" style:background={iconTint} style:border-left-color={accent}>
				<Icon name={icon} size="1.9vmin" />
			</div>
			<div class="body">
				<div
					class="message"
					style:color={notification.style?.alert?.color}
					style={notification.style?.body
						? Object.entries(notification.style.body)
								.map(([k, v]) => `${k}:${v}`)
								.join(';')
						: ''}
				>
					{@html DOMPurify.sanitize(notification.message)}
				</div>
				<div class="meta">
					{#if notification.duration <= 0}
						<Icon name="thumbtack" size="0.8vmin" />
					{/if}
					<span class="timestamp">{relativeTime}</span>
				</div>
			</div>
		</div>
		{#if notification.duration > 0}
			<div class="progress-track">
				<div class="progress" style:width="{progressPct}%" style:background={notification.style?.progress?.background ?? accent}></div>
			</div>
		{/if}
	</div>
</div>

<style>
	.slide {
		width: 100%;
		overflow: hidden;
		transition: all 500ms cubic-bezier(0.4, 0, 0.2, 1);
		margin-bottom: 0.6vh;
		transform: translateX(100%);
		opacity: 0;
	}

	.slide.visible {
		transform: translateX(0);
		opacity: 1;
	}

	.slide.exiting {
		transform: translateX(100%);
		opacity: 0;
		transition: all 300ms cubic-bezier(0.4, 0, 0.2, 1);
	}

	.toast {
		background: rgba(14, 13, 19, 0.95);
		border-radius: var(--radius);
		box-shadow: 0 3px 12px rgba(0, 0, 0, 0.3);
		overflow: hidden;
		color: var(--color-text);
	}

	.row {
		display: flex;
		align-items: stretch;
	}

	.icon-block {
		width: 3.4vw;
		flex-shrink: 0;
		display: flex;
		align-items: center;
		justify-content: center;
		border-left: 3px solid;
		color: var(--color-text);
	}

	.body {
		flex: 1;
		min-width: 0;
		padding: 0.8vh 0.8vw;
	}

	.message {
		font-size: 1.2vmin;
		font-weight: 500;
		line-height: 1.4;
		word-break: break-word;
	}

	.meta {
		display: flex;
		align-items: center;
		gap: 0.4vw;
		margin-top: 0.3vh;
		color: rgba(232, 232, 236, 0.45);
	}

	.timestamp {
		font-size: 0.95vmin;
		letter-spacing: 0.04em;
	}

	.progress-track {
		height: 2px;
		background: rgba(232, 232, 236, 0.08);
	}

	.progress {
		height: 100%;
		transition: width 100ms linear;
	}
</style>
