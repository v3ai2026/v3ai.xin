/**
 * Default cache configuration constants
 */
export const DEFAULT_CACHE_TTL = 60 * 60 * 24; // 24 hours in seconds
export const DEFAULT_CACHE_MAX_ITEMS = 1000;

/**
 * Default Redis configuration constants
 */
export const DEFAULT_REDIS_HOST = "localhost";
export const DEFAULT_REDIS_PORT = 6379;
export const DEFAULT_REDIS_DB = 0;
export const DEFAULT_MAX_RECONNECT_ATTEMPTS = 5;
export const DEFAULT_RECONNECT_DELAY = 3000; // 3 seconds

/**
 * Cache key prefixes
 */
export const CACHE_KEY_PREFIX = {
    USER: "user:",
    SESSION: "session:",
    CONFIG: "config:",
    DICT: "dict:",
    TEMP: "temp:",
} as const;

/**
 * Redis command timeout
 */
export const REDIS_COMMAND_TIMEOUT = 5000; // 5 seconds
