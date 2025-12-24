/**
 * Modal component types
 * @description Type definitions for BdModal component
 */

export interface BdModalProps {
    /** Modal title */
    title?: string;
    /** Modal description text */
    description?: string;
    /** Whether to enable transition animation */
    transition?: boolean;
    /** Whether to display fullscreen */
    fullscreen?: boolean;
    /** Whether to prevent clicking outside to close */
    dismissible?: boolean;
    /** Whether to display overlay */
    overlay?: boolean;
    /** Whether to render modal in portal */
    portal?: boolean;
    /** Preferred open state for Nuxt UI compatibility (v-model:open) */
    open?: boolean;
    /** Backward-compatible open state (v-model) */
    modelValue?: boolean;
    /** Whether to disable close button */
    disabledClose?: boolean;
    /** ID of the content area, for accessibility */
    contentId?: string;
    /** Custom close button icon */
    closeIcon?: string;
    /** Whether to close modal when ESC key is pressed */
    closeOnEsc?: boolean;
    /** Whether to display footer area */
    showFooter?: boolean;
    /** Custom UI class name */
    ui?: Partial<{
        wrapper: string;
        container: string;
        content: string;
        header: string;
        body: string;
        footer: string;
        close: string;
    }>;
}

export interface BdModalEmits {
    /** Triggered when modal open state changes (preferred Nuxt UI API) */
    (e: "update:open", value: boolean): void;
    /** Triggered when modal open state changes (back-compat) */
    (e: "update:modelValue", value: boolean): void;
    /** Triggered when modal opens */
    (e: "open"): void;
    /** Triggered when modal closes */
    (e: "close"): void;
    /** Triggered when modal confirms */
    (e: "confirm"): void;
}
