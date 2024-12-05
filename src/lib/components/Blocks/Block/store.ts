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

export const updateLineNumbers = () => {
	editorConfig.update((config) => ({
		...config,
		lineNumbers: !config.lineNumbers
	}));
};

export const updateHighlightWhitespace = () => {
	editorConfig.update((config) => ({
		...config,
		highlightWhitespace: !config.highlightWhitespace
	}));
};

export const updateHighlightTrailingWhitespace = () => {
	editorConfig.update((config) => ({
		...config,
		highlightTrailingWhitespace: !config.highlightTrailingWhitespace
	}));
};

export default editorConfig;
