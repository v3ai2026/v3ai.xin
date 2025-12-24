import { AxiosError } from "axios";

/**
 * HTTP error details
 */
export interface HttpErrorDetails {
    /**
     * Error message
     */
    message: string;

    /**
     * Error code (e.g., ECONNREFUSED, ETIMEDOUT)
     */
    code?: string;

    /**
     * HTTP status code
     */
    statusCode?: number;

    /**
     * HTTP status text
     */
    statusText?: string;

    /**
     * Request URL
     */
    url?: string;

    /**
     * Request method
     */
    method?: string;

    /**
     * Response data
     */
    responseData?: any;

    /**
     * Original error
     */
    originalError?: any;
}

/**
 * Parse Axios error to readable error details
 * @param error Axios error or any error
 * @returns Parsed error details
 */
export function parseHttpError(error: any): HttpErrorDetails {
    // If it's an Axios error
    if (error.isAxiosError) {
        const axiosError = error as AxiosError;
        const { config, response, code, message } = axiosError;

        const details: HttpErrorDetails = {
            message: message || "Unknown error",
            code: code,
            url: config?.url,
            method: config?.method?.toUpperCase(),
            originalError: error,
        };

        // If there's a response (server responded with error status)
        if (response) {
            details.statusCode = response.status;
            details.statusText = response.statusText;
            details.responseData = response.data;

            // Try to extract error message from response
            if (response.data) {
                const responseData = response.data as any;

                if (typeof responseData === "string") {
                    details.message = responseData;
                } else if (responseData && typeof responseData === "object") {
                    if (responseData.message) {
                        details.message = responseData.message;
                    } else if (responseData.error) {
                        details.message =
                            typeof responseData.error === "string"
                                ? responseData.error
                                : responseData.error?.message || message;
                    }
                }
            }
        } else {
            // No response (network error, timeout, etc.)
            details.message = getNetworkErrorMessage(code, message);
        }

        return details;
    }

    // If it's a regular error
    if (error instanceof Error) {
        return {
            message: error.message,
            originalError: error,
        };
    }

    // Unknown error type
    return {
        message: String(error),
        originalError: error,
    };
}

/**
 * Get user-friendly network error message
 * @param code Error code
 * @param originalMessage Original error message
 * @returns User-friendly error message
 */
function getNetworkErrorMessage(code?: string, originalMessage?: string): string {
    const errorMessages: Record<string, string> = {
        ECONNREFUSED: "Connection refused. The server is not responding.",
        ETIMEDOUT: "Request timeout. The server took too long to respond.",
        ENOTFOUND: "Server not found. Please check the URL.",
        ECONNABORTED: "Connection aborted. The request was cancelled.",
        ECONNRESET: "Connection reset. The server closed the connection unexpectedly.",
        ERR_NETWORK: "Network error. Please check your internet connection.",
        ERR_BAD_REQUEST: "Bad request. The request was malformed.",
        ERR_BAD_RESPONSE: "Bad response. The server returned an invalid response.",
    };

    if (code && errorMessages[code]) {
        return errorMessages[code];
    }

    return originalMessage || "Network error occurred";
}

/**
 * Format error details to readable string
 * @param details Error details
 * @returns Formatted error string
 */
export function formatHttpError(details: HttpErrorDetails): string {
    const parts: string[] = [];

    if (details.method && details.url) {
        parts.push(`[${details.method} ${details.url}]`);
    }

    if (details.statusCode) {
        parts.push(`Status: ${details.statusCode}`);
        if (details.statusText) {
            parts.push(details.statusText);
        }
    }

    if (details.code) {
        parts.push(`Code: ${details.code}`);
    }

    parts.push(details.message);

    return parts.join(" ");
}

/**
 * Create error message from Axios error
 * @param error Axios error or any error
 * @returns Formatted error message
 */
export function createHttpErrorMessage(error: any): string {
    const details = parseHttpError(error);
    return formatHttpError(details);
}
