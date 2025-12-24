import { ApplicationError } from "./application.error";
import type { ReportingOptions } from "./types";

/**
 * HTTP status code enumeration.
 */
export enum HttpStatus {
    // 2xx Success
    OK = 200,
    CREATED = 201,
    ACCEPTED = 202,
    NO_CONTENT = 204,

    // 4xx Client errors
    BAD_REQUEST = 400,
    UNAUTHORIZED = 401,
    FORBIDDEN = 403,
    NOT_FOUND = 404,
    METHOD_NOT_ALLOWED = 405,
    REQUEST_TIMEOUT = 408,
    CONFLICT = 409,
    UNPROCESSABLE_ENTITY = 422,
    TOO_MANY_REQUESTS = 429,

    // 5xx Server errors
    INTERNAL_SERVER_ERROR = 500,
    BAD_GATEWAY = 502,
    SERVICE_UNAVAILABLE = 503,
    GATEWAY_TIMEOUT = 504,
}

/**
 * HTTP error response payload.
 */
export interface HttpErrorResponse {
    /** Business status code. */
    code: number;
    /** Error message. */
    message: string;
    /** Optional extra data. */
    data?: any;
}

/**
 * Options for constructing an {@link HttpError} instance.
 */
export interface HttpErrorOptions extends ReportingOptions {
    /** HTTP status code. */
    httpStatus?: HttpStatus;
    /** Business status code. */
    businessCode: number;
    /** Optional extra data. */
    data?: any;
}

/**
 * HTTP error type.
 *
 * Extends `ApplicationError` by adding HTTP specific properties while remaining
 * framework-agnostic for reuse across runtimes.
 *
 * @example
 * ```ts
 * throw new HttpError('User not found', {
 *   httpStatus: HttpStatus.NOT_FOUND,
 *   businessCode: 40400,
 *   data: { userId: 123 }
 * });
 * ```
 */
export class HttpError extends ApplicationError {
    /** HTTP status code. */
    readonly httpStatus: HttpStatus;
    /** Business status code. */
    readonly businessCode: number;
    /** Optional extra data. */
    readonly data?: any;

    /**
     * Create a new HTTP error.
     *
     * @param message - Error message.
     * @param options - HTTP error options.
     */
    constructor(message: string, options: HttpErrorOptions) {
        const { httpStatus, businessCode, data, ...reportingOptions } = options;

        super(message, {
            ...reportingOptions,
            tags: {
                ...reportingOptions.tags,
                httpStatus: httpStatus ?? HttpError.getHttpStatusByBusinessCode(businessCode),
                businessCode,
            },
            extra: {
                ...reportingOptions.extra,
                data,
            },
        });

        this.httpStatus = httpStatus ?? HttpError.getHttpStatusByBusinessCode(businessCode);
        this.businessCode = businessCode;
        this.data = data;
    }

    /**
     * Convert the error into a response payload.
     *
     * @returns HTTP error response payload.
     */
    toResponse(): HttpErrorResponse {
        return {
            code: this.businessCode,
            message: this.message,
            data: this.data,
        };
    }

    /**
     * Determine the HTTP status from a business status code when none is provided.
     *
     * @param businessCode - Business status code.
     * @returns HTTP status code.
     */
    private static getHttpStatusByBusinessCode(businessCode: number): HttpStatus {
        const codeStr = businessCode.toString();
        const prefix = codeStr.substring(0, 1);
        const secondDigit = codeStr.substring(1, 2);

        // Success (2xxxx)
        if (prefix === "2") {
            return HttpStatus.OK;
        }

        // Client errors (4xxxx)
        if (prefix === "4") {
            // Map the second digit to a representative HTTP status code.
            const statusKey = parseInt(`${prefix}${secondDigit}0`, 10);
            const statusMap: Record<number, HttpStatus> = {
                400: HttpStatus.BAD_REQUEST,
                401: HttpStatus.BAD_REQUEST,
                402: HttpStatus.UNAUTHORIZED,
                403: HttpStatus.NOT_FOUND,
                404: HttpStatus.NOT_FOUND,
                405: HttpStatus.METHOD_NOT_ALLOWED,
                406: HttpStatus.BAD_REQUEST,
                407: HttpStatus.TOO_MANY_REQUESTS,
                408: HttpStatus.REQUEST_TIMEOUT,
                409: HttpStatus.CONFLICT,
            };
            return statusMap[statusKey] ?? HttpStatus.BAD_REQUEST;
        }

        // Server errors (5xxxx)
        if (prefix === "5") {
            // Map the second digit to a representative HTTP status code.
            const statusKey = parseInt(`${prefix}${secondDigit}0`, 10);
            const statusMap: Record<number, HttpStatus> = {
                500: HttpStatus.INTERNAL_SERVER_ERROR,
                501: HttpStatus.SERVICE_UNAVAILABLE,
                502: HttpStatus.BAD_GATEWAY,
                503: HttpStatus.SERVICE_UNAVAILABLE,
                504: HttpStatus.GATEWAY_TIMEOUT,
                505: HttpStatus.BAD_GATEWAY,
                509: HttpStatus.INTERNAL_SERVER_ERROR,
            };
            return statusMap[statusKey] ?? HttpStatus.INTERNAL_SERVER_ERROR;
        }

        // Default to internal server error when no mapping exists.
        return HttpStatus.INTERNAL_SERVER_ERROR;
    }
}

/**
 * Factory helper for building {@link HttpError} instances.
 */
export class HttpErrorFactory {
    /**
     * Create a custom HTTP error.
     *
     * @param message - Error message.
     * @param options - HTTP error options.
     * @returns HttpError instance.
     */
    static create(message: string, options: HttpErrorOptions): HttpError {
        return new HttpError(message, options);
    }

    /**
     * Create a success response (useful for early returns).
     *
     * @param message - Success message.
     * @param data - Response payload.
     * @returns HttpError instance.
     */
    static success(message: string = "Operation succeeded", data?: any): HttpError {
        return new HttpError(message, {
            httpStatus: HttpStatus.OK,
            businessCode: 20000,
            data,
            level: "log",
        });
    }

    /**
     * Create a bad request error (HTTP 400).
     *
     * @param message - Error message.
     * @param businessCode - Business status code.
     * @param data - Optional extra data.
     * @returns HttpError instance.
     */
    static badRequest(
        message: string = "Bad request",
        data?: any,
        businessCode: number = 40000,
    ): HttpError {
        return new HttpError(message, {
            httpStatus: HttpStatus.BAD_REQUEST,
            businessCode,
            data,
        });
    }

    /**
     * Create an unauthorized error (HTTP 401).
     *
     * @param message - Error message.
     * @param businessCode - Business status code.
     * @param data - Optional extra data.
     * @returns HttpError instance.
     */
    static unauthorized(
        message: string = "Unauthorized access",
        data?: any,
        businessCode: number = 40200,
    ): HttpError {
        return new HttpError(message, {
            httpStatus: HttpStatus.UNAUTHORIZED,
            businessCode,
            data,
        });
    }

    /**
     * Create a forbidden error (HTTP 403).
     *
     * @param message - Error message.
     * @param businessCode - Business status code.
     * @param data - Optional extra data.
     * @returns HttpError instance.
     */
    static forbidden(
        message: string = "Forbidden",
        data?: any,
        businessCode: number = 40204,
    ): HttpError {
        return new HttpError(message, {
            httpStatus: HttpStatus.FORBIDDEN,
            businessCode,
            data,
        });
    }

    /**
     * Create a not found error (HTTP 404).
     *
     * @param message - Error message.
     * @param businessCode - Business status code.
     * @param data - Optional extra data.
     * @returns HttpError instance.
     */
    static notFound(
        message: string = "Resource not found",
        data?: any,
        businessCode: number = 40400,
    ): HttpError {
        return new HttpError(message, {
            httpStatus: HttpStatus.NOT_FOUND,
            businessCode,
            data,
        });
    }

    /**
     * Create a request timeout error (HTTP 408).
     *
     * @param message - Error message.
     * @param businessCode - Business status code.
     * @param data - Optional extra data.
     * @returns HttpError instance.
     */
    static timeout(
        message: string = "Request timeout",
        data?: any,
        businessCode: number = 40701,
    ): HttpError {
        return new HttpError(message, {
            httpStatus: HttpStatus.REQUEST_TIMEOUT,
            businessCode,
            data,
        });
    }

    /**
     * Create a conflict error (HTTP 409).
     *
     * @param message - Error message.
     * @param businessCode - Business status code.
     * @param data - Optional extra data.
     * @returns HttpError instance.
     */
    static conflict(
        message: string = "Data conflict",
        data?: any,
        businessCode: number = 40402,
    ): HttpError {
        return new HttpError(message, {
            httpStatus: HttpStatus.CONFLICT,
            businessCode,
            data,
        });
    }

    /**
     * Create a too many requests error (HTTP 429).
     *
     * @param message - Error message.
     * @param businessCode - Business status code.
     * @param data - Optional extra data.
     * @returns HttpError instance.
     */
    static tooManyRequests(
        message: string = "Too many requests",
        data?: any,
        businessCode: number = 40700,
    ): HttpError {
        return new HttpError(message, {
            httpStatus: HttpStatus.TOO_MANY_REQUESTS,
            businessCode,
            data,
        });
    }

    /**
     * Create an internal server error (HTTP 500).
     *
     * @param message - Error message.
     * @param businessCode - Business status code.
     * @param data - Optional extra data.
     * @returns HttpError instance.
     */
    static internal(
        message: string = "Internal server error",
        data?: any,
        businessCode: number = 50000,
    ): HttpError {
        return new HttpError(message, {
            httpStatus: HttpStatus.INTERNAL_SERVER_ERROR,
            businessCode,
            data,
            level: "error",
        });
    }

    /**
     * Create a bad gateway error (HTTP 502).
     *
     * @param message - Error message.
     * @param businessCode - Business status code.
     * @param data - Optional extra data.
     * @returns HttpError instance.
     */
    static badGateway(
        message: string = "Bad gateway",
        data?: any,
        businessCode: number = 50500,
    ): HttpError {
        return new HttpError(message, {
            httpStatus: HttpStatus.BAD_GATEWAY,
            businessCode,
            data,
        });
    }

    /**
     * Create a service unavailable error (HTTP 503).
     *
     * @param message - Error message.
     * @param businessCode - Business status code.
     * @param data - Optional extra data.
     * @returns HttpError instance.
     */
    static serviceUnavailable(
        message: string = "Service unavailable",
        data?: any,
        businessCode: number = 50001,
    ): HttpError {
        return new HttpError(message, {
            httpStatus: HttpStatus.SERVICE_UNAVAILABLE,
            businessCode,
            data,
        });
    }

    /**
     * Create a gateway timeout error (HTTP 504).
     *
     * @param message - Error message.
     * @param businessCode - Business status code.
     * @param data - Optional extra data.
     * @returns HttpError instance.
     */
    static gatewayTimeout(
        message: string = "Gateway timeout",
        data?: any,
        businessCode: number = 50002,
    ): HttpError {
        return new HttpError(message, {
            httpStatus: HttpStatus.GATEWAY_TIMEOUT,
            businessCode,
            data,
        });
    }

    /**
     * Create a parameter error.
     *
     * @param message - Error message.
     * @param businessCode - Business status code.
     * @param data - Optional extra data.
     * @returns HttpError instance.
     */
    static paramError(
        message: string = "Invalid parameter",
        data?: any,
        businessCode: number = 40100,
    ): HttpError {
        return new HttpError(message, {
            httpStatus: HttpStatus.BAD_REQUEST,
            businessCode,
            data,
        });
    }

    /**
     * Create a business logic error.
     *
     * @param message - Error message.
     * @param businessCode - Business status code.
     * @param data - Optional extra data.
     * @returns HttpError instance.
     */
    static business(
        message: string = "Business logic error",
        data?: any,
        businessCode: number = 40602,
    ): HttpError {
        return new HttpError(message, {
            httpStatus: HttpStatus.BAD_REQUEST,
            businessCode,
            data,
        });
    }

    /**
     * Create a database error.
     *
     * @param message - Error message.
     * @param businessCode - Business status code.
     * @param data - Optional extra data.
     * @returns HttpError instance.
     */
    static dbError(
        message: string = "Database error",
        data?: any,
        businessCode: number = 50401,
    ): HttpError {
        return new HttpError(message, {
            httpStatus: HttpStatus.INTERNAL_SERVER_ERROR,
            businessCode,
            data,
            level: "error",
        });
    }

    /**
     * Create a third-party service error.
     *
     * @param message - Error message.
     * @param businessCode - Business status code.
     * @param data - Optional extra data.
     * @returns HttpError instance.
     */
    static thirdPartyError(
        message: string = "Third-party service error",
        data?: any,
        businessCode: number = 50500,
    ): HttpError {
        return new HttpError(message, {
            httpStatus: HttpStatus.BAD_GATEWAY,
            businessCode,
            data,
        });
    }
}
