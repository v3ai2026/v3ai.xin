import chalk from "chalk";

/**
 * 日志格式化工具类
 *
 * 提供统一的日志格式化方法，用于拦截器和过滤器
 */
export class LogFormatter {
    /**
     * 计算对象大小（字节数）
     *
     * @param obj 要计算大小的对象
     * @returns 大小（字节数）
     */
    static calculateSize(obj: any): number {
        try {
            const json = JSON.stringify(obj);
            return new TextEncoder().encode(json).length;
        } catch (e) {
            console.error(e);
            return 0;
        }
    }

    /**
     * 格式化大小显示
     *
     * @param bytes 字节数
     * @returns 格式化后的大小字符串
     */
    static formatSize(bytes: number): string {
        if (bytes === 0) return "0B";

        const sizes = ["B", "KB", "MB", "GB"];
        const i = Math.floor(Math.log(bytes) / Math.log(1024));

        // 计算大小并保留两位小数
        let size = (bytes / Math.pow(1024, i)).toFixed(2);

        // 去除末尾多余的零和小数点
        size = size.replace(/\.?0+$/, "");

        let sizeStr = `${size}${sizes[i]}`;

        // 根据大小添加颜色
        if (bytes < 1024) {
            // < 1KB
            sizeStr = chalk.green(sizeStr);
        } else if (bytes < 1024 * 1024) {
            // < 1MB
            sizeStr = chalk.cyan(sizeStr);
        } else if (bytes < 10 * 1024 * 1024) {
            // < 10MB
            sizeStr = chalk.yellow(sizeStr);
        } else {
            sizeStr = chalk.red(sizeStr);
        }

        return sizeStr;
    }

    /**
     * 格式化IP地址，移除IPv4-mapped IPv6地址中的::ffff:前缀，将::1转换为localhost
     *
     * @param ip IP地址
     * @returns 格式化后的IP地址
     */
    static formatIpAddress(ip: string): string {
        if (!ip) {
            return ip;
        }

        // 检查是否是IPv6本地回环地址
        if (ip === "::1") {
            return "localhost";
        }

        // 检查是否是IPv4-mapped IPv6地址
        if (ip.startsWith("::ffff:")) {
            // 移除::ffff:前缀
            return ip.substring(7);
        }

        return ip;
    }

    /**
     * 格式化HTTP状态码，根据状态码添加不同颜色
     *
     * @param statusCode HTTP状态码
     * @returns 格式化后的状态码字符串
     */
    static formatStatusCode(statusCode: number): string {
        let statusCodeStr = statusCode.toString();
        if (statusCode < 300) {
            // 绿色
            statusCodeStr = chalk.green(statusCode.toString());
        } else if (statusCode < 400) {
            // 青色
            statusCodeStr = chalk.cyan(statusCode.toString());
        } else if (statusCode < 500) {
            // 黄色
            statusCodeStr = chalk.yellow(statusCode.toString());
        } else {
            // 红色
            statusCodeStr = chalk.red(statusCode.toString());
        }
        return statusCodeStr;
    }

    /**
     * 格式化响应时间，根据时间添加不同颜色
     *
     * @param responseTime 响应时间（毫秒）
     * @returns 格式化后的响应时间字符串
     */
    static formatResponseTime(responseTime: number): string {
        let responseTimeStr = `${responseTime}ms`;
        if (responseTime < 100) {
            // 绿色
            responseTimeStr = chalk.green(responseTimeStr);
        } else if (responseTime < 300) {
            // 青色
            responseTimeStr = chalk.cyan(responseTimeStr);
        } else if (responseTime < 1000) {
            // 黄色
            responseTimeStr = chalk.yellow(responseTimeStr);
        } else {
            // 红色
            responseTimeStr = chalk.red(responseTimeStr);
        }
        return responseTimeStr;
    }

    /**
     * 格式化HTTP方法，根据方法添加不同颜色
     *
     * @param method HTTP方法
     * @returns 格式化后的HTTP方法字符串
     */
    static formatMethod(method: string): string {
        switch (method) {
            case "GET":
                return chalk.green(method); // 绿色
            case "POST":
                return chalk.blue(method); // 蓝色
            case "PUT":
                return chalk.yellow(method); // 黄色
            case "DELETE":
                return chalk.red(method); // 红色
            case "PATCH":
                return chalk.magenta(method); // 紫色
            default:
                return chalk.white(method); // 白色
        }
    }
}
