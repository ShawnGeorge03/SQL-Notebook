<script lang="ts">
    import { browser } from "$app/environment";
    import { onMount } from "svelte";

    import {
    	autocompletion,
    	closeBrackets,
    	closeBracketsKeymap,
    	completionKeymap
    } from '@codemirror/autocomplete';
    import { defaultKeymap, history, historyKeymap } from '@codemirror/commands';
    import {
    	bracketMatching,
    	defaultHighlightStyle,
    	foldGutter,
    	foldKeymap,
    	indentOnInput,
    	syntaxHighlighting
    } from '@codemirror/language';
    import { EditorState, StateEffect, type Extension } from "@codemirror/state";
    import {
    	EditorView,
    	crosshairCursor,
    	drawSelection,
    	dropCursor,
    	highlightActiveLine,
    	highlightTrailingWhitespace,
    	highlightWhitespace,
    	keymap,
    	lineNumbers,
    	rectangularSelection
    } from '@codemirror/view';
    import { getEditorConfig } from "./context";
    import { debounce } from "./utils";

    interface BlockProps {
        content: string;
        class?: string;
		customExtensions?: Extension[];
    }

    let view: EditorView;
    // svelte-ignore non_reactive_update
    let parent: HTMLDivElement;
    const editorConfig = getEditorConfig();

    let { class: className, content = $bindable(""), customExtensions = [] }: BlockProps = $props();

    const updateContent = debounce((lines: string[]) => {
        content = lines.join('');
     }, 100, true);

    const BASE_EXTENSIONS = [
        EditorView.updateListener.of(e => {
            if (e.docChanged) {
                const lines: string[] = [];

                for (const line of e.state.doc.iter())
                    lines.push(line.toString());

                updateContent(lines);
            }
        }),
        EditorView.lineWrapping,
        history(),
        foldGutter(),
		drawSelection(),
		dropCursor(),
        EditorState.allowMultipleSelections.of(true),
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
				...closeBracketsKeymap,
				...defaultKeymap,
				...historyKeymap,
				...foldKeymap,
				...completionKeymap
			])
    ]

    onMount(() => {
        view = new EditorView({
            parent,
            state: EditorState.create({
                doc: content,
                extensions: [...BASE_EXTENSIONS]
            }),
        });

        () => view.destroy();
    });

    editorConfig.subscribe(config => {
        if (view) {
			view.dispatch({
				effects: StateEffect.reconfigure.of([
					...BASE_EXTENSIONS,
					config.lineNumbers ? lineNumbers() : [],
                    config.highlightWhitespace ? highlightWhitespace() : [],
					config.highlightTrailingWhitespace ? highlightTrailingWhitespace() : []
				])
			});
        }
    })

</script>

{#if browser}
    <div class={className} bind:this={parent}></div>
{:else}
    <div class="scm-waiting {className}">
        <div class="scm-waiting__loading scm-loading">
            <div class="scm-loading__spinner"></div>
            <p class="scm-loading__text">Loading editor...</p>
        </div>
    </div>
{/if}


<style>
    .scm-waiting {
        position: relative;
    }
    .scm-waiting__loading {
        position: absolute;
        top: 0;
        left: 0;
        bottom: 0;
        right: 0;
        background-color: rgba(255, 255, 255, 0.5);
    }

    .scm-loading {
        display: flex;
        align-items: center;
        justify-content: center;
    }

    .scm-loading__spinner {
        width: 1rem;
        height: 1rem;
        border-radius: 100%;
        border: solid 2px #000;
        border-top-color: transparent;
        margin-right: 0.75rem;
        animation: spin 1s linear infinite;
    }

    .scm-loading__text {
        font-family: sans-serif;
    }

    @keyframes spin {
        0% {
            transform: rotate(0deg);
        }
        100% {
            transform: rotate(360deg);
        }
    }
</style>