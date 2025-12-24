import { isDevelopment, isProduction } from "@buildingai/utils";
import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from "@nestjs/common";
import type { Request, Response } from "express";
import { Observable } from "rxjs";
import { tap } from "rxjs/operators";

import { AppLoggerService } from "./app-logger.service";
import { LogFormatter } from "./log-formatter.util";

/**
 * HTTP 日志拦截器
 *
 * 记录所有 HTTP 请求的详细信息，包括请求方法、路径、状态码和响应时间
 */
@Injectable()
export class HttpLoggerInterceptor implements NestInterceptor {
    constructor(private readonly logger: AppLoggerService) {
        this.logger.setContext("HTTP");
    }

    // 使用 LogFormatter 工具类替代原有的格式化方法

    /**
     * 拦截 HTTP 请求并记录日志
     *
     * @param context 执行上下文
     * @param next 下一个处理器
     * @returns Observable
     */
    intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
        if (context.getType() !== "http") {
            return next.handle();
        }

        const request = context.switchToHttp().getRequest<Request>();
        const response = context.switchToHttp().getResponse<Response>();
        const { method, originalUrl, ip } = request;
        const userAgent = request.get("user-agent") || "-";

        const startTime = Date.now();

        return next.handle().pipe(
            tap(() => {
                const endTime = Date.now();
                const responseTime = endTime - startTime;
                const statusCode = response.statusCode;

                // 格式化状态码
                const statusCodeStr = LogFormatter.formatStatusCode(statusCode);

                // 格式化响应时间
                const responseTimeStr = LogFormatter.formatResponseTime(responseTime);

                // 格式化请求方法
                const methodStr = LogFormatter.formatMethod(method);

                // 计算请求体大小
                let requestBodySize = 0;

                // 检查请求体是否存在
                if (request.body && Object.keys(request.body).length > 0) {
                    requestBodySize = LogFormatter.calculateSize(request.body);
                } else if (request.readable && request.headers["content-length"]) {
                    // 如果请求体尚未解析但有 content-length 头，使用它
                    requestBodySize = parseInt(request.headers["content-length"], 10) || 0;
                }

                const requestBodySizeStr = LogFormatter.formatSize(requestBodySize);

                // 格式化IP地址
                const formattedIp = LogFormatter.formatIpAddress(ip || "-");

                // 记录日志
                isProduction(() => {
                    this.logger.log(
                        `${methodStr} ${originalUrl} ${statusCodeStr} ${responseTimeStr} - ${requestBodySizeStr} - ${formattedIp} ${userAgent}`,
                    );
                });

                isDevelopment(() => {
                    this.logger.debug(
                        `${methodStr} ${originalUrl} ${statusCodeStr} ${responseTimeStr} - ${requestBodySizeStr} - ${formattedIp} ${userAgent}`,
                    );
                });
            }),
        );
    }
}
