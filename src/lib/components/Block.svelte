<script lang="ts">
    import { onMount } from "svelte";

	import { browser } from "$app/environment";
	import { EditorState } from "@codemirror/state";
	import { EditorView } from "@codemirror/view";

    interface BlockProps {
        class?: string;
        content: string;
    }

    let view: EditorView;
    let parent: HTMLDivElement;

    let { class: className, content = $bindable("") }: BlockProps = $props();

    onMount(() => {
        view = new EditorView({
            parent,
            state: EditorState.create({
                doc: content,
                extensions: [
                    EditorView.updateListener.of(e => {
                        // TODO: Debounce
                        if (e.docChanged)
                            content = e.state.doc.toString();
                    })
                ]
            }),
        });

        () => view.destroy();
    });
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