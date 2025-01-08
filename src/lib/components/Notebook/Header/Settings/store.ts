import { type Writable, writable } from "svelte/store";

export type UserPreferences = {
    general: {
        openNotebooksInNewWindow: boolean;
        showDesktopNotifications: boolean;
    };
    editor: {
        theme: string;
        showLineNumbers: boolean;
        highlightWhitespace: boolean;
        highlightTrailingWhitespace: boolean;
    };
};

const preferences: Writable<UserPreferences> = writable();

export default preferences;