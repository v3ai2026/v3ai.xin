/**
 * Chat scroll component types
 * @description Type definitions for BdChatScroll component
 */

export interface BdInfiniteScrollProps {
    /** Is it loading */
    loading?: boolean;
    /** Whether there is more data to load */
    hasMore?: boolean;
    /** Trigger load distance, in pixels */
    threshold?: number;
    /** Loading text */
    loadingText?: string;
    /** Content style style */
    contentClass?: string;
}

export interface BdInfiniteScrollEmits {
    /** Load more event */
    (e: "loadMore"): void;
}
