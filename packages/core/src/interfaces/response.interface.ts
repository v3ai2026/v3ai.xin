/**
 * Unified response interface
 */
export interface Response<T> {
    /**
     * Status code
     */
    code: number;

    /**
     * Response message
     */
    message: string;

    /**
     * Response data
     */
    data: T;

    /**
     * Response timestamp
     */
    timestamp: number;
}
