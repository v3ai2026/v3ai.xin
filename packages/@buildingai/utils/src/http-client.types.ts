import type {
    AxiosDefaults,
    AxiosError,
    AxiosRequestConfig,
    AxiosResponse,
    CancelTokenSource,
    InternalAxiosRequestConfig,
} from "axios";

/**
 * HTTP 请求方法类型
 */
export type HttpMethod = "GET" | "POST" | "PUT" | "DELETE" | "PATCH" | "HEAD" | "OPTIONS";

/**
 * 重试配置
 */
export interface RetryConfig {
    /**
     * 最大重试次数
     * @default 0
     */
    retries?: number;

    /**
     * 重试延迟时间(毫秒)
     * @default 1000
     */
    retryDelay?: number;

    /**
     * 需要重试的 HTTP 状态码
     * @default [408, 429, 500, 502, 503, 504]
     */
    retryStatusCodes?: number[];

    /**
     * 自定义重试条件判断函数
     * @param error Axios 错误对象
     * @returns 是否需要重试
     */
    shouldRetry?: (error: AxiosError) => boolean;
}

/**
 * 日志配置
 */
export interface LogConfig {
    /**
     * 是否启用请求日志
     * @default false
     */
    enableRequestLog?: boolean;

    /**
     * 是否启用响应日志
     * @default false
     */
    enableResponseLog?: boolean;

    /**
     * 是否启用错误日志
     * @default true
     */
    enableErrorLog?: boolean;

    /**
     * 自定义日志处理函数
     */
    customLogger?: {
        request?: (config: InternalAxiosRequestConfig) => void;
        response?: (response: AxiosResponse) => void;
        error?: (error: AxiosError) => void;
    };
}

/**
 * HTTP 客户端配置
 */
export interface HttpClientConfig extends AxiosRequestConfig {
    /**
     * 基础 URL
     */
    baseURL?: string;

    /**
     * 请求超时时间(毫秒)
     * @default 10000
     */
    timeout?: number;

    /**
     * 请求头
     */
    headers?: Record<string, string>;

    /**
     * 重试配置
     */
    retryConfig?: RetryConfig;

    /**
     * 日志配置
     */
    logConfig?: LogConfig;

    /**
     * 是否自动转换响应数据
     * 如果为 true,直接返回 response.data
     * 如果为 false,返回完整的 AxiosResponse
     * @default true
     */
    autoTransformResponse?: boolean;
}

/**
 * HTTP 请求配置
 */
export interface HttpRequestConfig extends AxiosRequestConfig {
    /**
     * 是否跳过重试
     * @default false
     */
    skipRetry?: boolean;

    /**
     * 是否跳过日志
     * @default false
     */
    skipLog?: boolean;
}

/**
 * HTTP 响应类型
 */
export interface HttpResponse<T = any> extends AxiosResponse<T> {
    config: InternalAxiosRequestConfig;
}

/**
 * HTTP 错误类型
 */
export interface HttpError extends AxiosError {
    config: InternalAxiosRequestConfig;
}

/**
 * 请求拦截器配置
 */
export interface RequestInterceptor {
    onFulfilled?: (
        config: InternalAxiosRequestConfig,
    ) => InternalAxiosRequestConfig | Promise<InternalAxiosRequestConfig>;
    onRejected?: (error: any) => any;
}

/**
 * 响应拦截器配置
 */
export interface ResponseInterceptor {
    onFulfilled?: (response: AxiosResponse) => AxiosResponse | Promise<AxiosResponse>;
    onRejected?: (error: any) => any;
}

/**
 * HTTP 客户端实例接口
 */
export interface HttpClientInstance {
    /**
     * GET 请求
     * @param url 请求 URL
     * @param config 请求配置
     * @returns 响应数据
     */
    get<T = any>(url: string, config?: HttpRequestConfig): Promise<T>;

    /**
     * POST 请求
     * @param url 请求 URL
     * @param data 请求数据
     * @param config 请求配置
     * @returns 响应数据
     */
    post<T = any>(url: string, data?: any, config?: HttpRequestConfig): Promise<T>;

    /**
     * PUT 请求
     * @param url 请求 URL
     * @param data 请求数据
     * @param config 请求配置
     * @returns 响应数据
     */
    put<T = any>(url: string, data?: any, config?: HttpRequestConfig): Promise<T>;

    /**
     * PATCH 请求
     * @param url 请求 URL
     * @param data 请求数据
     * @param config 请求配置
     * @returns 响应数据
     */
    patch<T = any>(url: string, data?: any, config?: HttpRequestConfig): Promise<T>;

    /**
     * DELETE 请求
     * @param url 请求 URL
     * @param config 请求配置
     * @returns 响应数据
     */
    delete<T = any>(url: string, config?: HttpRequestConfig): Promise<T>;

    /**
     * HEAD 请求
     * @param url 请求 URL
     * @param config 请求配置
     * @returns 响应数据
     */
    head<T = any>(url: string, config?: HttpRequestConfig): Promise<T>;

    /**
     * OPTIONS 请求
     * @param url 请求 URL
     * @param config 请求配置
     * @returns 响应数据
     */
    options<T = any>(url: string, config?: HttpRequestConfig): Promise<T>;

    /**
     * 通用请求方法
     * @param config 请求配置
     * @returns 响应数据
     */
    request<T = any>(config: HttpRequestConfig): Promise<T>;

    /**
     * 获取请求 URI
     * @param config 请求配置
     * @returns URI 字符串
     */
    getUri(config?: HttpRequestConfig): string;

    /**
     * 创建取消令牌源
     * @returns 取消令牌源对象
     */
    createCancelToken(): CancelTokenSource;

    /**
     * 拦截器
     */
    interceptors: {
        request: {
            use(
                onFulfilled?: (
                    config: InternalAxiosRequestConfig,
                ) => InternalAxiosRequestConfig | Promise<InternalAxiosRequestConfig>,
                onRejected?: (error: any) => any,
            ): number;
            eject(id: number): void;
        };
        response: {
            use(
                onFulfilled?: (response: AxiosResponse) => AxiosResponse | Promise<AxiosResponse>,
                onRejected?: (error: any) => any,
            ): number;
            eject(id: number): void;
        };
    };

    /**
     * 默认配置
     */
    defaults: AxiosDefaults;
}
