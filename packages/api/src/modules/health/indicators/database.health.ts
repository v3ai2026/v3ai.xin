import { InjectDataSource } from "@buildingai/db/@nestjs/typeorm";
import { DataSource } from "@buildingai/db/typeorm";
import { Injectable } from "@nestjs/common";
import { HealthIndicatorResult, HealthIndicatorService } from "@nestjs/terminus";

/**
 * 数据库健康检查指示器
 * 用于检查数据库连接状态
 */
@Injectable()
export class DatabaseHealthIndicator {
    constructor(
        @InjectDataSource() private dataSource: DataSource,
        private readonly healthIndicatorService: HealthIndicatorService,
    ) {}

    /**
     * 检查数据库连接
     * @param key 健康检查结果的键名
     * @returns 健康检查结果
     */
    async isHealthy(key: string): Promise<HealthIndicatorResult> {
        // 创建一个健康检查指示器
        const indicator = this.healthIndicatorService.check(key);

        try {
            // 检查数据库连接是否活跃
            if (!this.dataSource.isInitialized) {
                return indicator.down({ message: "数据库连接未初始化" });
            }

            // 执行简单查询测试连接
            await this.dataSource.query("SELECT 1");

            return indicator.up({ message: "数据库连接正常" });
        } catch (error) {
            return indicator.down({
                message: "数据库连接异常",
                error: error.message,
            });
        }
    }
}
