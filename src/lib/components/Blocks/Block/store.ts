import { writable } from 'svelte/store';

type EditorConfig = {
	lineNumbers: boolean;
	highlightWhitespace: boolean;
	highlightTrailingWhitespace: boolean;
};

export const editorConfig = writable<EditorConfig>({
	lineNumbers: false,
	highlightWhitespace: false,
	highlightTrailingWhitespace: false
});

export default editorConfig;