import {
    BusinessCode,
    BusinessCodeType,
} from "@buildingai/constants/shared/business-code.constant";
import { HttpError, HttpErrorResponse } from "@buildingai/errors";
import { LogFormatter } from "@core/logger/log-formatter.util";
import {
    ArgumentsHost,
    Catch,
    ExceptionFilter,
    HttpException,
    HttpStatus,
    Inject,
    Logger,
    Optional,
} from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import chalk from "chalk";
import type { Request, Response } from "express";

/**
 * 全局HTTP异常过滤器
 *
 * 捕获所有异常并转换为统一的错误响应格式
 */
@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
    private readonly logger = new Logger(HttpExceptionFilter.name);
    private readonly showDetailedErrors: boolean;

    constructor(
        @Optional()
        @Inject(ConfigService)
        private readonly configService?: ConfigService,
    ) {
        // 默认不显示详细错误，除非环境变量 SHOW_DETAILED_ERRORS 设置为 true
        this.showDetailedErrors = process.env.SERVER_SHOW_DETAILED_ERRORS === "true";
    }

    /**
     * 异常处理方法
     *
     * @param exception 捕获到的异常
     * @param host 参数主机
     */
    catch(exception: unknown, host: ArgumentsHost): void {
        const ctx = host.switchToHttp();
        const response = ctx.getResponse<Response>();
        const request = ctx.getRequest<Request>();

        // 获取异常状态码、错误码和消息
        let status: HttpStatus;
        if (exception instanceof HttpError) {
            // HttpError 有自己的 httpStatus 属性
            status = exception.httpStatus;
        } else if (exception instanceof HttpException) {
            status = exception.getStatus();
        } else {
            status = HttpStatus.INTERNAL_SERVER_ERROR;
        }

        // 构建响应对象
        const responseBody = this.buildResponseBody(exception, request.url);

        // 记录错误日志
        this.logException(exception, request, status, responseBody.message);

        // 返回统一格式的错误响应
        response.status(status).json(responseBody);
    }

    /**
     * 构建响应体
     *
     * @param exception 异常对象
     * @param requestUrl 请求URL
     * @returns 统一的响应体对象
     */
    private buildResponseBody(exception: unknown, requestUrl: string): any {
        let code: number;
        let message: string;
        let data: any = null;

        if (exception instanceof HttpError) {
            // HttpError 业务异常
            const exceptionResponse = exception.toResponse() as HttpErrorResponse;
            code = exceptionResponse.code; // 使用业务状态码
            message = exceptionResponse.message;
            data = exceptionResponse.data || null;
        } else if (exception instanceof HttpException) {
            // 标准HTTP异常
            code = this.mapHttpStatusToBusinessCode(exception.getStatus());

            // 处理验证错误信息
            const exceptionResponse = exception.getResponse();
            if (
                typeof exceptionResponse === "object" &&
                exceptionResponse !== null &&
                "message" in exceptionResponse
            ) {
                // 处理验证管道的错误信息
                const exceptionMessage = exceptionResponse.message;
                if (Array.isArray(exceptionMessage) && exceptionMessage.length > 0) {
                    // 如果是验证错误数组，取第一个错误信息
                    message = exceptionMessage[0];
                } else if (typeof exceptionMessage === "string") {
                    message = exceptionMessage;
                } else {
                    message = exception.message;
                }
            } else {
                message = exception.message;
            }
        } else {
            // 未知异常
            code = BusinessCode.INTERNAL_SERVER_ERROR;
            message = exception instanceof Error ? exception.message : "服务器内部错误";
        }

        return {
            code,
            message,
            data,
            timestamp: Date.now(),
            path: requestUrl,
        };
    }

    /**
     * 记录异常日志
     *
     * @param exception 异常对象
     * @param request 请求对象
     * @param status HTTP状态码
     * @param message 错误消息
     */
    private logException(
        exception: unknown,
        request: Request,
        status: number,
        message: string,
    ): void {
        const { method, url, ip, headers } = request;
        const userAgent = request.get("user-agent") || "-";

        // 格式化HTTP方法
        const methodStr = LogFormatter.formatMethod(method);

        // 格式化状态码
        const statusCodeStr = LogFormatter.formatStatusCode(status);

        // 格式化IP地址
        const formattedIp = LogFormatter.formatIpAddress(ip || "-");

        // 计算请求体大小
        let requestBodySize = 0;
        if (request.body && Object.keys(request.body).length > 0) {
            requestBodySize = LogFormatter.calculateSize(request.body);
        } else if (request.readable && headers["content-length"]) {
            requestBodySize = parseInt(headers["content-length"], 10) || 0;
        }
        const requestBodySizeStr = LogFormatter.formatSize(requestBodySize);

        // 构建日志消息
        const logMessage = `${methodStr} ${url} ${statusCodeStr} - ${chalk.red("ERROR")} - ${requestBodySizeStr} - ${formattedIp} ${userAgent}`;
        const errorDetails = `> ${chalk.bgRed(" ERROR ")} ${chalk.red(message)}`;

        if (this.showDetailedErrors) {
            // 显示详细错误信息（包括堆栈）
            const stack = exception instanceof Error ? exception.stack : "";
            this.logger.error(`${logMessage}\n${errorDetails}\n${stack}`);
        } else {
            // 只显示简洁的错误信息（不包括堆栈）
            this.logger.error(`${logMessage}\n${errorDetails}`);
        }
    }

    /**
     * 将HTTP状态码映射为业务状态码
     *
     * @param httpStatus HTTP状态码
     * @returns 业务状态码
     */
    private mapHttpStatusToBusinessCode(httpStatus: HttpStatus): BusinessCodeType {
        switch (httpStatus) {
            case HttpStatus.OK:
            case HttpStatus.CREATED:
            case HttpStatus.ACCEPTED:
                return BusinessCode.SUCCESS;
            case HttpStatus.BAD_REQUEST:
                return BusinessCode.BAD_REQUEST;
            case HttpStatus.UNAUTHORIZED:
                return BusinessCode.UNAUTHORIZED;
            case HttpStatus.FORBIDDEN:
                return BusinessCode.FORBIDDEN;
            case HttpStatus.NOT_FOUND:
                return BusinessCode.RESOURCE_NOT_FOUND;
            case HttpStatus.METHOD_NOT_ALLOWED:
                return BusinessCode.OPERATION_NOT_ALLOWED;
            case HttpStatus.REQUEST_TIMEOUT:
                return BusinessCode.REQUEST_TIMEOUT;
            case HttpStatus.CONFLICT:
                return BusinessCode.DATA_CONFLICT;
            case HttpStatus.UNPROCESSABLE_ENTITY:
                return BusinessCode.VALIDATION_FAILED;
            case HttpStatus.TOO_MANY_REQUESTS:
                return BusinessCode.TOO_MANY_REQUESTS;
            case HttpStatus.INTERNAL_SERVER_ERROR:
                return BusinessCode.INTERNAL_SERVER_ERROR;
            case HttpStatus.BAD_GATEWAY:
                return BusinessCode.THIRD_PARTY_SERVICE_ERROR;
            case HttpStatus.SERVICE_UNAVAILABLE:
                return BusinessCode.SERVICE_UNAVAILABLE;
            case HttpStatus.GATEWAY_TIMEOUT:
                return BusinessCode.GATEWAY_TIMEOUT;
            default:
                return BusinessCode.INTERNAL_SERVER_ERROR;
        }
    }
}
