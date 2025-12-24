# @buildingai/cache

Cache and Redis management package for BuildingAI.

## Features

- **Cache Service**: Memory-based caching using NestJS cache-manager
- **Redis Service**: Full-featured Redis client with pub/sub support
- **Type Safety**: Comprehensive TypeScript type definitions
- **Global Modules**: Both modules are globally available
- **Health Checks**: Built-in health check and connection monitoring
- **Batch Operations**: Support for batch get/set/delete operations
- **Auto Reconnection**: Automatic reconnection with configurable retry logic

## Installation

This package is part of the BuildingAI monorepo and uses workspace dependencies.

```bash
pnpm install
```

## Usage

### Cache Service

```typescript
import { CacheService } from "@buildingai/cache";

@Injectable()
export class MyService {
    constructor(private cacheService: CacheService) {}

    async getData(key: string) {
        // Get from cache
        const cached = await this.cacheService.get<MyData>(key);
        if (cached) return cached;

        // Get from database and cache
        const data = await this.fetchFromDb();
        await this.cacheService.set(key, data, 3600); // TTL in seconds
        return data;
    }

    // Batch operations
    async batchGet(keys: string[]) {
        return this.cacheService.mget<MyData>(keys);
    }

    // Get or set pattern
    async getOrSet(key: string) {
        return this.cacheService.getOrSet(
            key,
            async () => {
                return await this.fetchFromDb();
            },
            3600,
        );
    }
}
```

### Redis Service

```typescript
import { RedisService } from "@buildingai/cache";

@Injectable()
export class MyService {
    constructor(private redisService: RedisService) {}

    async useRedis() {
        // Basic operations
        await this.redisService.set("key", "value", 3600);
        const value = await this.redisService.get("key");

        // Batch operations
        await this.redisService.mset([
            { key: "key1", value: "value1" },
            { key: "key2", value: "value2" },
        ]);

        // Pub/Sub
        await this.redisService.subscribe("channel", (message, channel) => {
            console.log(`Received: ${message} from ${channel}`);
        });

        await this.redisService.publish("channel", "Hello World");

        // Health check
        const isHealthy = await this.redisService.healthCheck();
    }
}
```

## Configuration

### Environment Variables

```env
# Cache Configuration
CACHE_TTL=86400                    # Default TTL in seconds (24 hours)
CACHE_MAX_ITEMS=1000               # Maximum number of items in cache

# Redis Configuration
REDIS_HOST=localhost               # Redis host
REDIS_PORT=6379                    # Redis port
REDIS_USERNAME=                    # Redis username (optional)
REDIS_PASSWORD=                    # Redis password (optional)
REDIS_DB=0                         # Redis database number
REDIS_MAX_RECONNECT_ATTEMPTS=5     # Maximum reconnection attempts
REDIS_RECONNECT_DELAY=3000         # Reconnection delay in milliseconds
```

## API Reference

### CacheService

- `get<T>(key: string): Promise<T | undefined>` - Get value from cache
- `set(key: string, value: any, ttl?: number): Promise<void>` - Set value in cache
- `del(key: string): Promise<void>` - Delete key from cache
- `has(key: string): Promise<boolean>` - Check if key exists
- `mget<T>(keys: string[]): Promise<(T | undefined)[]>` - Get multiple values
- `mset(entries: Array<{key, value}>, ttl?: number): Promise<void>` - Set multiple values
- `mdel(keys: string[]): Promise<void>` - Delete multiple keys
- `getOrSet<T>(key, factory, ttl?): Promise<T>` - Get or set if not exists
- `increment(key: string, delta?: number): Promise<number>` - Increment numeric value
- `decrement(key: string, delta?: number): Promise<number>` - Decrement numeric value
- `reset(): Promise<void>` - Clear all cache

### RedisService

- `get<T>(key: string): Promise<T | null>` - Get value
- `set(key: string, value: string, ttl?: number): Promise<void>` - Set value
- `del(key: string): Promise<void>` - Delete key
- `exists(key: string): Promise<boolean>` - Check if key exists
- `ttl(key: string): Promise<number>` - Get TTL for key
- `expire(key: string, seconds: number): Promise<boolean>` - Set expiry
- `mget(keys: string[]): Promise<(string | null)[]>` - Get multiple values
- `mset(entries: Array<{key, value}>): Promise<void>` - Set multiple values
- `mdel(keys: string[]): Promise<number>` - Delete multiple keys
- `keys(pattern: string): Promise<string[]>` - Get keys matching pattern
- `incr(key: string, delta?: number): Promise<number>` - Increment value
- `decr(key: string, delta?: number): Promise<number>` - Decrement value
- `publish(channel: string, message: string): Promise<number>` - Publish message
- `subscribe(channel: string, callback: MessageHandler): Promise<void>` - Subscribe to channel
- `unsubscribe(channel: string): Promise<void>` - Unsubscribe from channel
- `healthCheck(): Promise<boolean>` - Health check
- `isReady(): boolean` - Check if connected
- `getClient(): RedisClientType` - Get raw Redis client

## License

MIT
