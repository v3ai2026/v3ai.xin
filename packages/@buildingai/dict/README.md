# @buildingai/dict

A powerful and flexible dictionary configuration management package for NestJS applications with
built-in caching support.

## Features

- 🚀 **High Performance** - Built-in memory caching with automatic synchronization
- 🔄 **Event-Driven** - Automatic cache updates via event emitters
- 📦 **Batch Operations** - Support for batch get, set, and delete operations
- 🎯 **Type Safe** - Full TypeScript support with generic types
- 🔍 **Flexible Queries** - Support for group-based queries and filtering
- 📊 **Statistics** - Built-in cache statistics and monitoring
- 🌐 **Global Module** - Available throughout your application
- ⚡ **Cache Warmup** - Preload specific groups for optimal performance

## Installation

This package is part of the BuildingAI monorepo and uses workspace dependencies:

```bash
pnpm add @buildingai/dict
```

## Quick Start

### 1. Import the Module

```typescript
import { DictModule } from "@buildingai/dict";

@Module({
    imports: [DictModule],
})
export class AppModule {}
```

The `DictModule` is a global module, so you only need to import it once in your root module.

### 2. Use the Services

```typescript
import { DictService, DictCacheService } from "@buildingai/dict";

@Injectable()
export class YourService {
    constructor(
        private readonly dictService: DictService,
        private readonly dictCacheService: DictCacheService,
    ) {}

    async example() {
        // Get configuration value (with cache)
        const value = await this.dictCacheService.get("app_name", "My App");

        // Set configuration value
        await this.dictService.set("app_name", "My Awesome App", {
            group: "system",
            description: "Application name",
        });

        // Get all configurations in a group
        const configs = await this.dictCacheService.getByGroup("system");

        // Get group values as key-value mapping
        const systemConfig = await this.dictCacheService.getGroupValues<{
            app_name: string;
            app_version: string;
        }>("system");
    }
}
```

## API Reference

### DictService

Core service for dictionary CRUD operations.

#### Methods

##### `get<T>(key: string, defaultValue?: T, group?: string): Promise<T>`

Get configuration value with automatic type conversion.

```typescript
const maxRetries = await dictService.get<number>("max_retries", 3, "system");
const features = await dictService.get<string[]>("enabled_features", [], "app");
```

##### `set<T>(key: string, value: T, options?: DictSetOptions): Promise<Partial<Dict>>`

Set configuration value (creates or updates).

```typescript
await dictService.set("theme", "dark", {
    group: "ui",
    description: "UI theme preference",
    isEnabled: true,
});
```

##### `getValue<T>(key: string, group?: string): Promise<T>`

Get configuration value (throws error if not found or disabled).

```typescript
try {
    const apiKey = await dictService.getValue<string>("api_key", "secrets");
} catch (error) {
    // Handle missing or disabled configuration
}
```

##### `getByGroup(group: string, onlyEnabled?: boolean): Promise<Dict[]>`

Get all configurations in a group.

```typescript
const paymentConfigs = await dictService.getByGroup("payment_config");
```

##### `getGroupValues<T>(group: string, onlyEnabled?: boolean): Promise<Record<string, T>>`

Get group configurations as key-value mapping.

```typescript
interface StorageConfig {
    provider: string;
    bucket: string;
    region: string;
}

const storage = await dictService.getGroupValues<StorageConfig>("storage_config");
console.log(storage.provider); // 'aws'
```

##### `enable(key: string, isEnabled: boolean, group?: string): Promise<Partial<Dict>>`

Enable or disable a configuration.

```typescript
await dictService.enable("maintenance_mode", false, "system");
```

##### `deleteByKey(key: string, group?: string): Promise<boolean>`

Delete configuration by key.

```typescript
const deleted = await dictService.deleteByKey("old_config", "system");
```

### DictCacheService

High-performance caching service for dictionary configurations.

#### Methods

##### `get<T>(key: string, defaultValue?: T, group?: string): Promise<T>`

Get configuration value from cache (with database fallback).

```typescript
const siteName = await dictCacheService.get<string>("site_name", "Default Site");
```

##### `mget<T>(keys: Array<{ key: string; group?: string }>): Promise<Array<T | undefined>>`

Batch get multiple configuration values.

```typescript
const values = await dictCacheService.mget<string>([
    { key: "app_name", group: "system" },
    { key: "app_version", group: "system" },
    { key: "theme", group: "ui" },
]);
```

##### `has(key: string, group?: string): Promise<boolean>`

Check if configuration exists and is enabled.

```typescript
const hasFeature = await dictCacheService.has("new_feature", "features");
if (hasFeature) {
    // Enable feature
}
```

##### `getAll(): Promise<Dict[]>`

Get all dictionary configurations from cache.

```typescript
const allConfigs = await dictCacheService.getAll();
```

##### `getByGroup(group: string, onlyEnabled?: boolean): Promise<Dict[]>`

Get all configurations in a group from cache.

```typescript
const emailConfigs = await dictCacheService.getByGroup("email_config");
```

##### `getGroupValues<T>(group: string, onlyEnabled?: boolean): Promise<T>`

Get group configurations as typed object.

```typescript
interface WeChatConfig {
    appId: string;
    appSecret: string;
    token: string;
}

const wechat = await dictCacheService.getGroupValues<WeChatConfig>("wechat_config");
```

##### `warmupCache(groups?: string[]): Promise<void>`

Preload specific groups into cache.

```typescript
// Warm up all configurations
await dictCacheService.warmupCache();

// Warm up specific groups
await dictCacheService.warmupCache(["system", "payment_config", "email_config"]);
```

##### `getCacheStats(): Promise<DictCacheStats>`

Get cache statistics.

```typescript
const stats = await dictCacheService.getCacheStats();
console.log(`Total: ${stats.totalCount}, Enabled: ${stats.enabledCount}`);
console.log("Group distribution:", stats.groupCounts);
```

##### `clearCache(): Promise<void>`

Clear all dictionary caches.

```typescript
await dictCacheService.clearCache();
```

## Configuration Groups

Use predefined group constants for consistency:

```typescript
import { DICT_GROUPS } from "@buildingai/dict";

await dictService.set("app_name", "My App", {
    group: DICT_GROUPS.SYSTEM,
});

await dictService.set("s3_bucket", "my-bucket", {
    group: DICT_GROUPS.STORAGE,
});

await dictService.set("stripe_key", "sk_test_xxx", {
    group: DICT_GROUPS.PAYMENT,
});
```

Available groups:

- `DICT_GROUPS.DEFAULT` - Default group
- `DICT_GROUPS.SYSTEM` - System configuration
- `DICT_GROUPS.STORAGE` - Storage configuration
- `DICT_GROUPS.PAYMENT` - Payment configuration
- `DICT_GROUPS.WECHAT` - WeChat configuration
- `DICT_GROUPS.EMAIL` - Email configuration
- `DICT_GROUPS.SMS` - SMS configuration

## Events

The package emits events for cache synchronization:

```typescript
import { DICT_CACHE_EVENTS } from '@buildingai/dict';

// Listen to dictionary updates
@OnEvent(DICT_CACHE_EVENTS.DICT_UPDATED)
handleDictUpdated(dict: Dict) {
  console.log(`Configuration updated: ${dict.key}@${dict.group}`);
}

// Listen to dictionary deletions
@OnEvent(DICT_CACHE_EVENTS.DICT_DELETED)
handleDictDeleted(params: { key: string; group: string }) {
  console.log(`Configuration deleted: ${params.key}@${params.group}`);
}
```

## Type Safety

The package provides full TypeScript support:

```typescript
import type { DictKey, DictSetOptions, DictCacheStats } from "@buildingai/dict";

// Type-safe configuration retrieval
interface AppConfig {
    name: string;
    version: string;
    debug: boolean;
    maxConnections: number;
}

const config = await dictCacheService.getGroupValues<AppConfig>("app_config");

// Type-safe batch operations
const keys: DictKey[] = [
    { key: "feature_a", group: "features" },
    { key: "feature_b", group: "features" },
];

const features = await dictCacheService.mget<boolean>(keys);
```

## Best Practices

### 1. Use Cache Service for Reads

Always use `DictCacheService` for reading configurations to benefit from caching:

```typescript
// ✅ Good - uses cache
const value = await dictCacheService.get("key");

// ❌ Avoid - bypasses cache
const value = await dictService.get("key");
```

### 2. Group Related Configurations

Organize configurations into logical groups:

```typescript
// Email configurations
await dictService.set("smtp_host", "smtp.gmail.com", { group: "email_config" });
await dictService.set("smtp_port", "587", { group: "email_config" });
await dictService.set("smtp_user", "user@example.com", { group: "email_config" });

// Retrieve as a group
const emailConfig = await dictCacheService.getGroupValues("email_config");
```

### 3. Warm Up Critical Configurations

Preload frequently accessed configurations on application startup:

```typescript
@Injectable()
export class AppService implements OnModuleInit {
    constructor(private readonly dictCacheService: DictCacheService) {}

    async onModuleInit() {
        // Warm up critical configuration groups
        await this.dictCacheService.warmupCache(["system", "payment_config", "email_config"]);
    }
}
```

### 4. Use Type Definitions

Define interfaces for your configuration groups:

```typescript
// config.types.ts
export interface SystemConfig {
    app_name: string;
    app_version: string;
    maintenance_mode: boolean;
    max_upload_size: number;
}

// usage
const config = await dictCacheService.getGroupValues<SystemConfig>("system");
```

### 5. Handle Missing Configurations Gracefully

Always provide default values or handle errors:

```typescript
// With default value
const timeout = await dictCacheService.get<number>("api_timeout", 5000);

// With error handling
try {
    const apiKey = await dictService.getValue<string>("api_key", "secrets");
} catch (error) {
    logger.error("API key not configured");
    // Fallback logic
}
```

## Performance Tips

1. **Batch Operations**: Use `mget` for retrieving multiple values
2. **Cache Warmup**: Preload frequently accessed groups
3. **Group Organization**: Keep related configs in the same group
4. **Monitor Stats**: Use `getCacheStats()` to monitor cache performance

## Migration from Core Module

If you're migrating from `@buildingai/core/modules/dict`:

```typescript
// Before
import { DictService } from "@buildingai/core/modules/dict/services/dict.service";
import { DictCacheService } from "@buildingai/core/modules/dict/services/dict-cache.service";

// After
import { DictService, DictCacheService } from "@buildingai/dict";
```

All APIs remain **100% compatible**. No code changes required!

## License

MIT
