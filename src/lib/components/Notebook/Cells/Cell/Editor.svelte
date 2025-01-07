<script lang="ts" module>
	export interface BaseEditorProps {
		content: string;
		class?: string;
	}
</script>

<script lang="ts">
	import { browser } from '$app/environment';
	import { onMount } from 'svelte';

	import {
		autocompletion,
		closeBrackets,
		closeBracketsKeymap,
		completionKeymap
	} from '@codemirror/autocomplete';
	import { defaultKeymap, history, historyKeymap, indentWithTab } from '@codemirror/commands';
	import {
		bracketMatching,
		defaultHighlightStyle,
		foldGutter,
		foldKeymap,
		indentOnInput,
		syntaxHighlighting
	} from '@codemirror/language';
	import { Compartment, EditorState, StateEffect, type Extension } from '@codemirror/state';
	import {
		crosshairCursor,
		drawSelection,
		EditorView,
		highlightActiveLine,
		highlightTrailingWhitespace,
		highlightWhitespace,
		keymap,
		lineNumbers,
		rectangularSelection,
		type ViewUpdate
	} from '@codemirror/view';
	import { mode } from 'mode-watcher';
	import { clouds, cobalt } from 'thememirror';

	import SpinnerIcon from '$lib/assets/spinner.svg?raw';
	import type { Unsubscriber } from 'svelte/store';
	import preferences from '../../Header/Settings/store';

	interface EditorProps extends BaseEditorProps {
		customExtensions?: Extension[];
	}

	let { class: className, content = $bindable(), customExtensions = [] }: EditorProps = $props();

	let view: EditorView;
	// svelte-ignore non_reactive_update
	let parent: HTMLDivElement;

	const themeConfig = new Compartment();
	const extensions = [
		EditorView.updateListener.of((e: ViewUpdate) => {
			if (e.docChanged) {
				const lines = [];

				for (const line of e.state.doc.iter()) {
					lines.push(line.toString());
				}

				content = lines.join('');
			}
		}),
		EditorView.lineWrapping,
		EditorState.allowMultipleSelections.of(true),
		history(),
		foldGutter(),
		drawSelection(),
		indentOnInput(),
		syntaxHighlighting(defaultHighlightStyle, { fallback: true }),
		bracketMatching(),
		closeBrackets(),
		autocompletion(),
		rectangularSelection(),
		crosshairCursor(),
		highlightActiveLine(),
		...customExtensions,
		keymap.of([
			indentWithTab,
			...closeBracketsKeymap,
			...defaultKeymap,
			...historyKeymap,
			...foldKeymap,
			...completionKeymap
		])
	];

	onMount(() => {
		extensions.push(themeConfig.of([$mode === 'dark' ? cobalt : clouds]));

		view = new EditorView({
			parent,
			state: EditorState.create({
				doc: content,
				extensions
			})
		});

		const subscriptions: Unsubscriber[] = [
			mode.subscribe((theme) => {
				view.dispatch({
					effects: themeConfig.reconfigure(theme === 'dark' ? cobalt : clouds)
				});
			}),

			preferences.subscribe(({ editor }) => {
				view.dispatch({
					effects: StateEffect.reconfigure.of([
						...extensions,
						editor.showLineNumbers ? lineNumbers() : [],
						editor.highlightWhitespace ? highlightWhitespace() : [],
						editor.highlightTrailingWhitespace ? highlightTrailingWhitespace() : []
					])
				});
			})
		];

		() => {
			subscriptions.map((unsubscribe) => unsubscribe());
			view.destroy();
		};
	});

	$effect(() => {
		if (content !== view.state.doc.toString()) {
			view.dispatch({
				changes: {
					from: 0,
					to: view.state.doc.length,
					insert: content
				}
			});
		}
	});
</script>

{#if browser}
	<div class={className} bind:this={parent}></div>
{:else}
	<div class="relative {className}">
		<div class="flex items-center justify-center text-primary">
			<span class="me-3 inline h-4 w-4 animate-spin">{@html SpinnerIcon}</span>
			<p class="scm-loading__text">Loading editor...</p>
		</div>
	</div>
{/if}
