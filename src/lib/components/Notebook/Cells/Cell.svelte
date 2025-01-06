<script lang="ts" module>
	export interface BaseBlockProps {
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
	import { EditorState, StateEffect, type Extension } from '@codemirror/state';
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

	import SpinnerIcon from '$lib/assets/spinner.svg?raw';
	import preferences from '../Header/Settings/store';

	interface BlockProps extends BaseBlockProps {
		customExtensions?: Extension[];
	}

	let { class: className, content = $bindable(), customExtensions = [] }: BlockProps = $props();

	let view: EditorView;
	// svelte-ignore non_reactive_update
	let parent: HTMLDivElement;

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
		view = new EditorView({
			parent,
			state: EditorState.create({
				doc: content,
				extensions
			})
		});

		const unsubscribe = preferences.subscribe(({ editor }) => {
			view.dispatch({
				effects: StateEffect.reconfigure.of([
					...extensions,
					editor.showLineNumbers ? lineNumbers() : [],
					editor.highlightWhitespace ? highlightWhitespace() : [],
					editor.highlightTrailingWhitespace ? highlightTrailingWhitespace() : []
				])
			});
		});

		() => {
			unsubscribe();
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
