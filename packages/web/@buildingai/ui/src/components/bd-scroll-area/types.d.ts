/**
 * Scroll area component types
 * @description Type definitions for BdScrollArea component
 */

export interface BdScrollAreaProps {
    /**
     * Scrollbar display type
     * @property {'auto'} auto - Scrollbar is visible when content overflows in the corresponding direction
     * @property {'always'} always - Scrollbar is always visible regardless of whether content overflows
     * @property {'scroll'} scroll - Scrollbar is visible when user scrolls in the corresponding direction
     * @property {'hover'} hover - Scrollbar is visible when user scrolls in the corresponding direction and when user hovers over it
     */
    type?: "scroll" | "always" | "auto" | "hover";
    /** Scrollbar hide delay (milliseconds) */
    scrollHideDelay?: number;
    /** Size of the scrollbar */
    scrollbarSize?: number;
    /**
     * Scrollbar color variant
     * @property {'default'} default - Scrollbar color--default
     * @property {'primary'} primary - Scrollbar color--primary theme
     */
    variant?: "default" | "primary";
    /** Whether to show horizontal scrollbar */
    horizontal?: boolean;
    /** Whether to show vertical scrollbar */
    vertical?: boolean;
    /** Whether to show scroll shadow */
    shadow?: boolean;
}

export interface BdScrollAreaEmits {
    (e: "scroll", event: Event): void;
    (e: "in-view", event: void): void;
}

export interface BdScrollAreaSlots {
    default: (props: Record<string, never>) => any;
}
