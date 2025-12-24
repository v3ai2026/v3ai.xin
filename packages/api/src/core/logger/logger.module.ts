import { DynamicModule, Global, LogLevel, Module } from "@nestjs/common";
import { ConfigModule, ConfigService } from "@nestjs/config";

import { AppLoggerService } from "./app-logger.service";

/**
 * 日志模块配置选项
 */
export interface LoggerModuleOptions {
    /**
     * 是否启用文件日志
     */
    isFileLogEnabled?: boolean;

    /**
     * 日志级别
     */
    logLevels?: string[];

    // logDir 选项已移除，统一使用根目录 logs
}

/**
 * 全局日志模块
 *
 * 提供应用级别的日志服务
 */
@Global()
@Module({
    providers: [AppLoggerService],
    exports: [AppLoggerService],
})
export class LoggerModule {
    /**
     * 创建一个带有 ConfigService 的 AppLoggerService 实例
     *
     * 用于在 main.ts 中创建应用时使用
     *
     * @param context 日志上下文
     * @returns 日志服务实例
     */
    static createLogger(context?: string): AppLoggerService {
        // 读取环境变量以模拟 ConfigService
        const isFileLogEnabled = process.env.LOG_TO_FILE === "true";
        const logLevels = (process.env.LOG_LEVELS?.split(",") as LogLevel[]) || undefined;

        // 创建日志服务实例
        const logger = new AppLoggerService(context);

        // 手动设置配置
        if (isFileLogEnabled) {
            logger["isFileLogEnabled"] = true;
        }

        if (logLevels) {
            logger.setLogLevels(logLevels);
        }

        return logger;
    }
    /**
     * 注册日志模块
     *
     * @returns 动态模块
     */
    static register(): DynamicModule {
        return {
            module: LoggerModule,
            imports: [ConfigModule],
            providers: [
                {
                    provide: AppLoggerService,
                    useFactory: () => {
                        return new AppLoggerService(undefined);
                    },
                    inject: [ConfigService],
                },
            ],
            exports: [AppLoggerService],
        };
    }

    /**
     * 使用自定义配置注册日志模块
     *
     * @param options 日志模块配置选项
     * @returns 动态模块
     */
    static registerAsync(options: LoggerModuleOptions): DynamicModule {
        return {
            module: LoggerModule,
            imports: [ConfigModule],
            providers: [
                {
                    provide: AppLoggerService,
                    useFactory: () => {
                        // 将自定义配置与环境变量配置合并
                        if (options.isFileLogEnabled !== undefined) {
                            process.env.LOG_TO_FILE = options.isFileLogEnabled.toString();
                        }

                        if (options.logLevels) {
                            process.env.LOG_LEVELS = options.logLevels.join(",");
                        }

                        return new AppLoggerService(undefined);
                    },
                    inject: [ConfigService],
                },
            ],
            exports: [AppLoggerService],
        };
    }
}
