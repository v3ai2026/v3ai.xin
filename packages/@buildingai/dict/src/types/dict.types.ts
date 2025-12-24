/**
 * Dictionary configuration key with optional group
 */
export interface DictKey {
    /**
     * Configuration key
     */
    key: string;

    /**
     * Configuration group, defaults to 'default'
     */
    group?: string;
}

/**
 * Dictionary cache statistics
 */
export interface DictCacheStats {
    /**
     * Total number of configurations
     */
    totalCount: number;

    /**
     * Number of enabled configurations
     */
    enabledCount: number;

    /**
     * Number of disabled configurations
     */
    disabledCount: number;

    /**
     * Configuration count by group
     */
    groupCounts: Record<string, number>;
}

/**
 * Dictionary set options
 */
export interface DictSetOptions {
    /**
     * Configuration group
     */
    group?: string;

    /**
     * Configuration description
     */
    description?: string;

    /**
     * Sort order
     */
    sort?: number;

    /**
     * Whether enabled
     */
    isEnabled?: boolean;
}

/**
 * Common dictionary group names
 */
export const DICT_GROUPS = {
    /**
     * Default group
     */
    DEFAULT: "default",

    /**
     * System configuration group
     */
    SYSTEM: "system",

    /**
     * Storage configuration group
     */
    STORAGE: "storage_config",

    /**
     * Payment configuration group
     */
    PAYMENT: "payment_config",

    /**
     * WeChat configuration group
     */
    WECHAT: "wechat_config",

    /**
     * Email configuration group
     */
    EMAIL: "email_config",

    /**
     * SMS configuration group
     */
    SMS: "sms_config",
} as const;

/**
 * Dictionary group type
 */
export type DictGroup = (typeof DICT_GROUPS)[keyof typeof DICT_GROUPS] | string;
