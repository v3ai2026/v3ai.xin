/**
 * 终端类型常量
 */
export const TERMINAL_TYPES = {
    WEB: "web",
    MOBILE: "mobile",
} as const;

/**
 * 终端类型数组，用于验证
 */
export const TERMINAL_TYPE_VALUES = Object.values(TERMINAL_TYPES);

/**
 * 终端类型联合类型
 */
export type TerminalType = (typeof TERMINAL_TYPES)[keyof typeof TERMINAL_TYPES];
