/**
 * @fileoverview Storage key name constants
 * @description Defines storage key name constants used in the application, such as Cookie, LocalStorage, etc.
 *
 * @author BuildingAI Teams
 */

/**
 * Storage key constants
 * @description All storage keys used throughout the application
 */
export const STORAGE_KEYS = {
    /** User authentication token */
    USER_TOKEN: "__user_token__",
    /** User temporary token */
    USER_TEMPORARY_TOKEN: "__user_temporary_token__",
    /** Login timestamp */
    LOGIN_TIME_STAMP: "__login_time_stamp__",
    /** User ID */
    USER_ID: "__user_id__",
    /** Console layout mode */
    LAYOUT_MODE: "__console_layout_mode__",
    /** Nuxt UI primary theme */
    NUXT_UI_PRIMARY: "nuxt-ui-primary",
    /** Nuxt UI neutral theme */
    NUXT_UI_NEUTRAL: "nuxt-ui-neutral",
    /** Whether to use black as primary color */
    NUXT_UI_BLACK_AS_PRIMARY: "nuxt-ui-black-as-primary",
    /** Border radius setting */
    NUXT_UI_RADIUS: "nuxt-ui-radius",
    /** Chat window style: conversation | document */
    CHAT_WINDOW_STYLE: "__chat_window_style__",
    /** Code highlight theme */
    CODE_HIGHLIGHT_THEME: "__code_highlight_theme__",
    /** Mermaid diagram theme */
    MERMAID_THEME: "__mermaid_theme__",
    /** User timezone setting */
    USER_TIMEZONE: "__user_timezone__",
    /** Files list */
    FILES_LIST: "__files_list__",
} as const;
export type StorageKeys = keyof typeof STORAGE_KEYS;
