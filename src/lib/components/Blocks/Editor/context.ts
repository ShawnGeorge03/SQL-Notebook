import { getContext, setContext } from 'svelte';
import { writable, type Writable } from 'svelte/store';

type EditorConfig = {
    lineNumbers: boolean;
    highlightWhitespace: boolean;
    highlightTrailingWhitespace: boolean;
}

type Context = Writable<EditorConfig>;

export function setEditorConfig() {
    const editorConfig = writable<EditorConfig>({
        lineNumbers: false,
        highlightWhitespace: false,
        highlightTrailingWhitespace: false,
    });
    setContext('editorConfig', editorConfig)
}

export function getEditorConfig() {
    return getContext<Context>('editorConfig')
}