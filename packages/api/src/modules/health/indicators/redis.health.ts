import { RedisService } from "@buildingai/cache";
import { Injectable } from "@nestjs/common";
import { HealthIndicatorResult, HealthIndicatorService } from "@nestjs/terminus";

/**
 * Redis健康检查指示器
 * 用于检查Redis连接状态
 */
@Injectable()
export class RedisHealthIndicator {
    constructor(
        private readonly redisService: RedisService,
        private readonly healthIndicatorService: HealthIndicatorService,
    ) {}

    /**
     * 检查Redis连接
     * @param key 健康检查结果的键名
     * @returns 健康检查结果
     */
    async isHealthy(key: string): Promise<HealthIndicatorResult> {
        // 创建一个健康检查指示器
        const indicator = this.healthIndicatorService.check(key);

        try {
            // 获取Redis客户端并执行PING命令测试连接
            const client = this.redisService.getClient();
            const result = await client.ping();
            const isHealthy = result === "PONG";

            if (isHealthy) {
                return indicator.up({ message: "Redis连接正常" });
            } else {
                return indicator.down({ message: "Redis连接异常" });
            }
        } catch (error) {
            return indicator.down({
                message: "Redis连接异常",
                error: error.message,
            });
        }
    }
}
