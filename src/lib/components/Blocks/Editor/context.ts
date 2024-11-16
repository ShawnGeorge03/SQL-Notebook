import { getContext, setContext } from 'svelte';
import { writable, type Writable } from 'svelte/store';

export interface EditorConfig {
    lineNumbers: boolean;
    highlightWhitespace: boolean;
    highlightTrailingWhitespace: boolean;
}

export function setEditorConfig() {
    const editorConfig = writable<EditorConfig>({
        lineNumbers: false,
        highlightWhitespace: false,
        highlightTrailingWhitespace: false,
    });
    setContext('editorConfig', editorConfig)
}

export function getEditorConfig() {
    return getContext<Writable<EditorConfig>>('editorConfig')
}