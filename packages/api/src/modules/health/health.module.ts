import { HttpModule } from "@nestjs/axios";
import { Module } from "@nestjs/common";
import { TerminusModule } from "@nestjs/terminus";

import { HealthController } from "./controllers/console/health.controller";
import { AppHealthIndicator } from "./indicators/app.health";
import { DatabaseHealthIndicator } from "./indicators/database.health";
import { RedisHealthIndicator } from "./indicators/redis.health";

/**
 * 健康检查模块
 * 提供应用程序和依赖服务的健康状态监控
 */
@Module({
    imports: [
        TerminusModule.forRoot({
            errorLogStyle: "pretty",
        }),
        HttpModule,
    ],
    controllers: [HealthController],
    providers: [AppHealthIndicator, DatabaseHealthIndicator, RedisHealthIndicator],
})
export class HealthModule {}
