import { CacheModule as NestCacheModule } from "@nestjs/cache-manager";
import { Global, Module } from "@nestjs/common";

import { DEFAULT_CACHE_MAX_ITEMS, DEFAULT_CACHE_TTL } from "../constants/cache.constants";
import { CacheService } from "./cache.service";

/**
 * Cache Manager Module
 *
 * Global module providing cache management functionality
 * Uses NestJS cache-manager with configurable TTL and max items
 */
@Global()
@Module({
    imports: [
        NestCacheModule.registerAsync({
            isGlobal: true,
            useFactory: () => {
                return {
                    ttl: (Number(process.env.CACHE_TTL) || DEFAULT_CACHE_TTL) * 1000,
                    max: Number(process.env.CACHE_MAX_ITEMS) || DEFAULT_CACHE_MAX_ITEMS,
                };
            },
        }),
    ],
    providers: [CacheService],
    exports: [CacheService],
})
export class CacheModule {}
