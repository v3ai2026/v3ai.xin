/**
 * @fileoverview HTTP client related types and interfaces
 * @description Centralized HTTP type definitions to avoid circular dependencies
 *
 * @author BuildingAI Teams
 */

// Import external dependencies
import type { FetchOptions } from "ofetch";

import type { MessageContent } from "../ai/message-content.interface";

/**
 * HTTP request method types
 */
export type HttpMethod = "GET" | "POST" | "PUT" | "DELETE" | "PATCH";

/**
 * Response data structure
 */
export type ResponseSchema<T = unknown> = {
    code: number;
    data: T;
    message?: string;
    path?: string;
    timestamp: number;
};

/**
 * Global client default configuration
 * @description Global configuration items for initializing HTTP client instances
 */
export interface HttpClientOptions {
    /** Basic request configuration (from ofetch) */
    fetchOptions?: Omit<FetchOptions, "signal">;

    /** Whether to enable request deduplication by default (defaults to true) */
    dedupe?: boolean;

    /** Whether to ignore response errors (defaults to false) */
    ignoreResponseError?: boolean;

    /** Global request timeout duration (milliseconds) */
    timeout?: number;

    /** Base URL, prefix for all requests */
    baseURL?: string;
}

/**
 * Single request configuration options
 * @description Used to configure special behavior for individual requests
 */
export interface RequestOptions {
    /** Request-level error handling callback */
    onError?: (error: unknown) => void | Promise<void>;

    /** Whether to deduplicate current request (overrides global setting) */
    dedupe?: boolean;

    /** Current request timeout duration (milliseconds) */
    timeout?: number;

    /** Request parameters */
    params?: Record<string, unknown>;

    /** Request body data */
    data?: Record<string, unknown>;

    /** Request headers */
    headers?: Record<string, string>;

    /** Whether user authentication is required, if true and user is not logged in, request will not be sent */
    requireAuth?: boolean;

    /** Whether to return full response (default false, only returns data field) */
    returnFullResponse?: boolean;

    /** Whether to skip business status code processing (default false) */
    skipBusinessCheck?: boolean;

    /** Whether to skip request interceptors (default false) */
    skipRequestInterceptors?: boolean;

    /** Whether to skip response interceptors (default false) */
    skipResponseInterceptors?: boolean;

    /** Whether to skip error interceptors (default false) */
    skipErrorInterceptors?: boolean;
}

/**
 * Extended request configuration options
 * @description Combines ofetch's FetchOptions with our custom RequestOptions
 */
export type ExtendedFetchOptions = FetchOptions & Omit<RequestOptions, "params" | "data">;

/**
 * Interceptor configuration
 * @description Interceptor interface for request/response processing
 */
export interface Interceptor {
    /** Intercept and modify configuration before sending request */
    onRequest?: (
        config: ExtendedFetchOptions,
    ) => ExtendedFetchOptions | Promise<ExtendedFetchOptions>;
    /** Process data after receiving response */
    onResponse?: <T>(response: T) => T | Promise<T>;
    /** Handle errors during request lifecycle */
    onError?: (error: unknown) => void | Promise<void>;
}

/**
 * Server-Sent Events (SSE) configuration
 * @description Configuration options for establishing server-sent event connections
 */
export interface SSEConfig {
    /** Callback when message is received */
    onMessage: (event: MessageEvent) => void;
    /** Optional error handling callback */
    onError?: (error: Event) => void;
    /** Optional callback when connection opens */
    onOpen?: (event: Event) => void;
}

/**
 * Chat message interface
 */
export interface ChatMessage {
    /** Message ID */
    id?: string;
    /** Message role */
    role: "user" | "assistant" | "system" | "tool";
    /** Message content */
    content: MessageContent;
    /** Timestamp */
    timestamp?: string;
    /** Model name */
    model?: string;
    /** Extended data */
    [key: string]: any;
}

/**
 * Chat stream chunk interface
 */
export interface ChatStreamChunk {
    /** Chunk type */
    type: "content" | "error" | "done" | "metadata" | "conversation_id";
    /** Current message state */
    message: ChatMessage;
    /** Incremental content */
    delta?: string;
    /** Conversation content */
    data?: string;
    /** Error message */
    error?: string;
    /** Metadata */
    metadata?: {
        type: string;
        data: any;
    };
}

/**
 * Chat stream configuration interface
 */
export interface ChatStreamConfig {
    /** Message list */
    messages: ChatMessage[];
    /** Additional request body data */
    body?: Record<string, any>;
    /** Stream protocol type */
    streamProtocol?: "data" | "text";
    /** Response callback */
    onResponse?: (response: Response) => void | Promise<void>;
    /** Stream update callback */
    onUpdate?: (chunk: ChatStreamChunk) => void;
    /** MCP call callback */
    onToolCall?: (chunk: any) => void; // McpCallChunk<McpToolCall> from mcp.ts
    /** Completion callback */
    onFinish?: (message: ChatMessage) => void;
    /** Error callback */
    onError?: (error: Error) => void;
    /** ID generator */
    generateId?: () => string;
    /** Request headers */
    headers?: Record<string, string>;
    /** Other fetch options */
    [key: string]: any;
}

/**
 * HTTP interceptor manager
 */
export interface InterceptorManager {
    /** Add request interceptor */
    request: (handler: Interceptor["onRequest"]) => () => void;
    /** Add response interceptor */
    response: (handler: Interceptor["onResponse"]) => () => void;
    /** Add error interceptor */
    error: (handler: Interceptor["onError"]) => () => void;
}

/**
 * File upload options
 */
export interface UploadOptions {
    /** File object or FormData object to upload */
    file: File | FormData;
    /** File field name (used when file is File type), defaults to 'file' */
    fieldName?: string;
    /** Additional form data (used when file is File type) */
    formData?: Record<string, string>;
    /** Upload progress callback */
    onProgress?: (percent: number) => void;
    /** Request headers */
    headers?: Record<string, string>;
    /** Whether to skip business status code check */
    skipBusinessCheck?: boolean;
    /** Whether to return full response */
    returnFullResponse?: boolean;
}

/**
 * Upload controller
 */
export interface UploadController<T = any> {
    /** Cancel upload */
    abort: () => void;
    /** Upload progress */
    progress: number;
    /** Upload result Promise */
    promise: Promise<T>;
}

/**
 * HTTP client instance
 */
export interface HttpClient {
    /** Send GET request */
    get: <T>(url: string, options?: RequestOptions) => Promise<T>;
    /** Send POST request */
    post: <T>(url: string, options?: RequestOptions) => Promise<T>;
    /** Send PUT request */
    put: <T>(url: string, options?: RequestOptions) => Promise<T>;
    /** Send DELETE request */
    delete: <T>(url: string, options?: RequestOptions) => Promise<T>;
    /** Send PATCH request */
    patch: <T>(url: string, options?: RequestOptions) => Promise<T>;
    /** Send custom request */
    request: <T>(method: HttpMethod, url: string, options?: RequestOptions) => Promise<T>;
    /** Establish chat stream connection */
    chatStream: (url: string, config: ChatStreamConfig) => Promise<{ abort: () => void }>;
    /** File upload */
    upload: <T = any>(url: string, options: UploadOptions) => UploadController<T>;
    /** Cancel specific request */
    cancel: (url: string, method?: HttpMethod) => void;
    /** Cancel all requests */
    cancelAll: () => void;
    /** Interceptor management */
    interceptors: InterceptorManager;
    /** Set global request headers */
    setHeader: (name: string, value: string) => HttpClient;
    /** Set authentication token */
    setToken: (token: string, type?: string) => HttpClient;
    /** Set base URL */
    setBaseURL: (baseURL: string) => HttpClient;
    /** Set timeout duration */
    setTimeout: (timeout: number) => HttpClient;
    /** Set global custom business status code handler */
    setStatusHandler: (handler: (status: number, response: ResponseSchema) => void) => HttpClient;
    /** Set parameter processor */
    setParamsProcessor: (
        processor: (params: Record<string, unknown>) => Record<string, unknown>,
    ) => HttpClient;
}
