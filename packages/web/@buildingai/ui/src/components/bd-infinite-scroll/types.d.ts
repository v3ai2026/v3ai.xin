/**
 * Infinite scroll component types
 * @description Type definitions for BdInfiniteScroll component
 */

export interface BdInfiniteScrollProps {
    /** Whether to load */
    loading?: boolean;
    /** Whether to load more data */
    hasMore?: boolean;
    /** Trigger load distance, in pixels */
    threshold?: number;
    /** Loading text */
    loadingText?: string;
    /** Text displayed when there is no more data */
    noMoreText?: string;
}

export interface BdInfiniteScrollEmits {
    /** Load more event */
    (e: "loadMore"): void;
}
