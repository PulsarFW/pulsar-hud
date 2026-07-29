import { mount } from 'svelte';
import App from './App.svelte';
import './theme.css';

const target = document.getElementById('app');
if (!target) {
	throw new Error('#app mount node not found');
}

const app = mount(App, { target });

if (import.meta.env.DEV) {
	// dynamic import keeps both the mock feed and dev panel out of the production bundle
	import('./lib/mock').then(({ startMockHud }) => startMockHud());
	import('./lib/dev/DevPanel.svelte').then(({ default: DevPanel }) => mount(DevPanel, { target }));
}

export default app;
