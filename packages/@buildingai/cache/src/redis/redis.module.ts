import { Global, Module } from "@nestjs/common";

import { RedisService } from "./redis.service";

/**
 * Redis Module
 *
 * Global module responsible for configuring and managing Redis connections
 * Provides Redis client instance and advanced Redis operations
 * Reads Redis configuration from environment variables
 */
@Global()
@Module({
    providers: [RedisService],
    exports: [RedisService],
})
export class RedisModule {}
