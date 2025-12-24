import { Injectable } from "@nestjs/common";
import { HealthIndicatorResult, HealthIndicatorService } from "@nestjs/terminus";

/**
 * 应用健康检查指示器
 * 用于检查应用本身的状态
 */
@Injectable()
export class AppHealthIndicator {
    constructor(private readonly healthIndicatorService: HealthIndicatorService) {}
    /**
     * 检查应用是否健康
     * @param key 健康检查结果的键名
     * @returns 健康检查结果
     */
    async isHealthy(key: string): Promise<HealthIndicatorResult> {
        // 创建一个健康检查指示器
        const indicator = this.healthIndicatorService.check(key);

        // 应用程序始终被认为是健康的，因为如果应用程序不健康，这个方法将无法执行
        const isHealthy = true;

        if (!isHealthy) {
            return indicator.down({ message: "应用程序运行异常" });
        }

        return indicator.up({ message: "应用程序运行正常" });
    }
}
