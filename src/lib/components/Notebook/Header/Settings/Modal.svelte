<script lang="ts">
	import { onMount } from 'svelte';

	import Settings from 'lucide-svelte/icons/settings';

	import { Checkbox } from '$lib/components/ui/checkbox/index.js';
	import * as Dialog from '$lib/components/ui/dialog/index.js';
	import { Label } from '$lib/components/ui/label/index.js';
	import * as Tabs from '$lib/components/ui/tabs/index.js';
	import preferences, { type UserPreferences } from './store';

	const DEFAULT_PREFERENCES: UserPreferences = {
		general: {
			openNotebooksInNewWindow: true,
			showDesktopNotifications: true
		},
		editor: {
			theme: 'default',
			showLineNumbers: false,
			highlightWhitespace: false,
			highlightTrailingWhitespace: false
		}
	};

	const updatePreferences = (
		category: keyof UserPreferences,
		value: Partial<UserPreferences[keyof UserPreferences]>
	) => {
		preferences.update((prev) => {
			return {
				...prev,
				[category]: {
					...prev[category],
					...value
				}
			};
		});
	};

	const crossTabUserPreferences = (e: StorageEvent) => {
		if (e.key !== 'preferences' || !e.newValue) return;
		$preferences = JSON.parse(e.newValue) as UserPreferences;
	};

	onMount(() => {
		preferences.set(
			localStorage.preferences ? JSON.parse(localStorage.preferences) : DEFAULT_PREFERENCES
		);

		addEventListener('storage', crossTabUserPreferences);

		const unsubscribe = preferences.subscribe((value) =>
			localStorage.setItem('preferences', JSON.stringify(value))
		);

		() => {
			removeEventListener('storage', crossTabUserPreferences);
			unsubscribe();
		};
	});
</script>

{#snippet SettingsCheckbox(
	id: string,
	checked: boolean,
	content: string,
	update: (value: boolean) => void
)}
	<div class="mt-4 space-y-1">
		<Checkbox {id} {checked} onCheckedChange={(e) => update(e.valueOf())} />
		<Label
			for={id}
			class="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
		>
			{content}
		</Label>
	</div>
{/snippet}

<Dialog.Root>
	<Dialog.Trigger aria-label="Settings">
		<Settings size="24" />
	</Dialog.Trigger>
	<Dialog.Content>
		<Dialog.Header>
			<Dialog.Title>Settings</Dialog.Title>
		</Dialog.Header>
		<Tabs.Root value="general">
			<Tabs.List class="grid w-full grid-cols-2">
				<Tabs.Trigger value="general">General</Tabs.Trigger>
				<Tabs.Trigger value="editor">Editor</Tabs.Trigger>
			</Tabs.List>
			<Tabs.Content value="general">
				{@render SettingsCheckbox(
					'openNotebooksInNewWindow',
					$preferences.general.openNotebooksInNewWindow,
					'Open Notebooks in New Window',
					(openNotebooksInNewWindow) => updatePreferences('general', { openNotebooksInNewWindow })
				)}
				{@render SettingsCheckbox(
					'showDesktopNotifications',
					$preferences.general.showDesktopNotifications,
					'Show Desktop Notifications',
					(showDesktopNotifications) => updatePreferences('general', { showDesktopNotifications })
				)}
			</Tabs.Content>
			<Tabs.Content value="editor">
				{@render SettingsCheckbox(
					'showLineNumbers',
					$preferences.editor.showLineNumbers,
					'Show Line Numbers',
					(showLineNumbers) => updatePreferences('editor', { showLineNumbers })
				)}
				{@render SettingsCheckbox(
					'highlightWhitespace',
					$preferences.editor.highlightWhitespace,
					'Highlight Whitespace',
					(highlightWhitespace) => updatePreferences('editor', { highlightWhitespace })
				)}
				{@render SettingsCheckbox(
					'highlightTrailingWhitespace',
					$preferences.editor.highlightTrailingWhitespace,
					'Highlight Trailing Whitespace',
					(highlightTrailingWhitespace) =>
						updatePreferences('editor', { highlightTrailingWhitespace })
				)}
			</Tabs.Content>
		</Tabs.Root>
	</Dialog.Content>
</Dialog.Root>
