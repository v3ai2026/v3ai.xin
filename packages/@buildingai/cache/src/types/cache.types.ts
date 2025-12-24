/**
 * Cache configuration options
 */
export interface CacheOptions {
    /**
     * Time to live in seconds
     */
    ttl?: number;

    /**
     * Maximum number of items in cache
     */
    max?: number;
}

/**
 * Cache entry with key and value
 */
export interface CacheEntry<T = any> {
    /**
     * Cache key
     */
    key: string;

    /**
     * Cache value
     */
    value: T;
}

/**
 * Redis configuration options
 */
export interface RedisOptions {
    /**
     * Redis host
     */
    host?: string;

    /**
     * Redis port
     */
    port?: number;

    /**
     * Redis username
     */
    username?: string;

    /**
     * Redis password
     */
    password?: string;

    /**
     * Redis database number
     */
    database?: number;

    /**
     * Maximum reconnection attempts
     */
    maxReconnectAttempts?: number;

    /**
     * Reconnection delay in milliseconds
     */
    reconnectDelay?: number;
}

/**
 * Pub/Sub message handler
 */
export type MessageHandler = (message: string, channel: string) => void;

/**
 * Cache statistics
 */
export interface CacheStats {
    /**
     * Number of cache hits
     */
    hits: number;

    /**
     * Number of cache misses
     */
    misses: number;

    /**
     * Total number of keys
     */
    keys: number;

    /**
     * Hit rate percentage
     */
    hitRate: number;
}
