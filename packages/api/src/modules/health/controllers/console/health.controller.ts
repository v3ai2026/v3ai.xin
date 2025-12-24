import { BaseController } from "@buildingai/base";
import { Public } from "@buildingai/decorators";
import { ConsoleController } from "@common/decorators/controller.decorator";
import { Get } from "@nestjs/common";
import {
    DiskHealthIndicator,
    HealthCheck,
    HealthCheckService,
    HttpHealthIndicator,
    MemoryHealthIndicator,
} from "@nestjs/terminus";

import { AppHealthIndicator } from "../../indicators/app.health";
import { DatabaseHealthIndicator } from "../../indicators/database.health";
import { RedisHealthIndicator } from "../../indicators/redis.health";

/**
 * 健康检查控制器
 * 提供多种健康检查端点，用于监控应用程序和依赖服务的状态
 */
@ConsoleController("health", "健康检查")
export class HealthController extends BaseController {
    constructor(
        private health: HealthCheckService,
        private http: HttpHealthIndicator,
        private disk: DiskHealthIndicator,
        private memory: MemoryHealthIndicator,
        private db: DatabaseHealthIndicator,
        private redis: RedisHealthIndicator,
        private app: AppHealthIndicator,
    ) {
        super();
    }

    /**
     * 获取应用的URL
     * @returns 应用的完整URL
     */
    private getAppUrl(): string {
        const port = process.env.SERVER_PORT || 4090;
        const host = "localhost";
        return `http://${host}:${port}`;
    }

    /**
     * 基础健康检查
     * 提供应用程序的基本健康状态
     */
    @Get()
    @HealthCheck()
    @Public()
    async check() {
        try {
            this.logger.log("执行基础健康检查");
            return await this.health.check([() => this.app.isHealthy("app")]);
        } catch (error) {
            this.logger.error(`基础健康检查失败: ${error.message}`, error.stack);
            throw error;
        }
    }

    /**
     * HTTP健康检查
     * 检查应用是否能正常响应HTTP请求
     */
    @Get("http")
    @HealthCheck()
    async checkHttp() {
        try {
            this.logger.log("执行HTTP健康检查");
            return await this.health.check([
                // 检查应用是否正常响应
                () => this.http.pingCheck("nestjs-app", this.getAppUrl()),
            ]);
        } catch (error) {
            this.logger.error(`HTTP健康检查失败: ${error.message}`, error.stack);
            throw error;
        }
    }

    /**
     * 详细健康检查
     * 提供应用程序、数据库、内存和磁盘的详细健康状态
     */
    @Get("detail")
    @HealthCheck()
    async checkDetail() {
        try {
            this.logger.log("执行详细健康检查");
            return await this.health.check([
                // 检查应用是否正常响应
                () => this.http.pingCheck("nestjs-app", this.getAppUrl()),
                // 检查内存使用情况
                () => this.memory.checkHeap("memory_heap", 300 * 1024 * 1024), // 300MB
                // 检查RSS内存
                () => this.memory.checkRSS("memory_rss", 300 * 1024 * 1024), // 300MB
                // 检查磁盘存储
                () =>
                    this.disk.checkStorage("disk", {
                        thresholdPercent: 0.8,
                        path: "/",
                    }),
                // 检查数据库连接
                () => this.db.isHealthy("database"),
                // 检查Redis连接
                () => this.redis.isHealthy("redis"),
            ]);
        } catch (error) {
            this.logger.error(`详细健康检查失败: ${error.message}`, error.stack);
            throw error;
        }
    }

    /**
     * 数据库健康检查
     * 专门检查数据库连接状态
     */
    @Get("db")
    @HealthCheck()
    async checkDatabase() {
        try {
            this.logger.log("执行数据库健康检查");
            return await this.health.check([
                () => this.db.isHealthy("database"),
                () => this.redis.isHealthy("redis"),
            ]);
        } catch (error) {
            this.logger.error(`数据库健康检查失败: ${error.message}`, error.stack);
            throw error;
        }
    }
}
