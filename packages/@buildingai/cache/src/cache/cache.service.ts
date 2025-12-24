import type { Cache } from "@nestjs/cache-manager";
import { CACHE_MANAGER } from "@nestjs/cache-manager";
import { Inject, Injectable } from "@nestjs/common";

/**
 * Cache Service
 *
 * Provides encapsulation of cache operations, including basic cache operations
 * Uses NestJS CacheManager for cache management
 * Uses memory storage, suitable for non-distributed deployment scenarios
 */
@Injectable()
export class CacheService {
    constructor(@Inject(CACHE_MANAGER) private cacheManager: Cache) {}

    /**
     * Get cache value
     * @param key Cache key
     * @returns Cache value
     */
    async get<T>(key: string): Promise<T | undefined> {
        return this.cacheManager.get<T>(key);
    }

    /**
     * Set cache value
     * @param key Cache key
     * @param value Cache value
     * @param ttl Time to live in seconds, optional
     */
    async set(key: string, value: any, ttl?: number): Promise<void> {
        await this.cacheManager.set(key, value, ttl ? ttl * 1000 : undefined);
    }

    /**
     * Delete cache
     * @param key Cache key
     */
    async del(key: string): Promise<void> {
        await this.cacheManager.del(key);
    }

    /**
     * Reset all caches
     */
    async reset(): Promise<void> {
        await this.cacheManager.clear();
    }

    /**
     * Check if key exists
     * @param key Cache key
     * @returns True if key exists
     */
    async has(key: string): Promise<boolean> {
        const value = await this.cacheManager.get(key);
        return value !== undefined && value !== null;
    }

    /**
     * Get multiple values
     * @param keys Array of cache keys
     * @returns Array of cache values
     */
    async mget<T>(keys: string[]): Promise<(T | undefined)[]> {
        const promises = keys.map((key) => this.get<T>(key));
        return Promise.all(promises);
    }

    /**
     * Set multiple values
     * @param entries Array of key-value pairs
     * @param ttl Time to live in seconds, optional
     */
    async mset(entries: Array<{ key: string; value: any }>, ttl?: number): Promise<void> {
        const promises = entries.map((entry) => this.set(entry.key, entry.value, ttl));
        await Promise.all(promises);
    }

    /**
     * Delete multiple keys
     * @param keys Array of cache keys
     */
    async mdel(keys: string[]): Promise<void> {
        const promises = keys.map((key) => this.del(key));
        await Promise.all(promises);
    }

    /**
     * Get value or set if not exists
     * @param key Cache key
     * @param factory Function to generate value if not exists
     * @param ttl Time to live in seconds, optional
     * @returns Cache value
     */
    async getOrSet<T>(
        key: string,
        factory: () => Promise<T> | T,
        ttl?: number,
    ): Promise<T | undefined> {
        const value = await this.get<T>(key);
        if (value !== undefined) {
            return value;
        }

        const newValue = await factory();
        if (newValue !== undefined) {
            await this.set(key, newValue, ttl);
        }
        return newValue;
    }

    /**
     * Increment numeric value
     * @param key Cache key
     * @param delta Increment amount, defaults to 1
     * @returns New value after increment
     */
    async increment(key: string, delta: number = 1): Promise<number> {
        const value = await this.get<number>(key);
        const newValue = (value || 0) + delta;
        await this.set(key, newValue);
        return newValue;
    }

    /**
     * Decrement numeric value
     * @param key Cache key
     * @param delta Decrement amount, defaults to 1
     * @returns New value after decrement
     */
    async decrement(key: string, delta: number = 1): Promise<number> {
        return this.increment(key, -delta);
    }
}
