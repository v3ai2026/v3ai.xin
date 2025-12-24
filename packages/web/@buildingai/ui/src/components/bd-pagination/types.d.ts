/**
 * Pagination component types
 * @description Type definitions for BdPagination component
 */

export interface BdPaginationProps {
    /** Number of items per page */
    size: number;
    /** Current page number */
    page: number;
    /** Total number of items */
    total: number;
    /** Optional number of items per page */
    pageSizes?: number[];
}

export interface BdPaginationEmits {
    (e: "update:size", value: number): void;
    (e: "update:page", value: number): void;
    (e: "change"): void;
}
