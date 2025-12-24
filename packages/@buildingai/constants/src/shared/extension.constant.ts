/**
 * 插件状态
 */
export const ExtensionStatus = {
    /** 禁用 */
    DISABLED: 0,
    /** 启用 */
    ENABLED: 1,
} as const;

export type ExtensionStatusType = (typeof ExtensionStatus)[keyof typeof ExtensionStatus];
export type ExtensionStatusKey = keyof typeof ExtensionStatus;

/**
 * 插件类型
 */
export const ExtensionType = {
    /** 应用插件 */
    APPLICATION: 1,
    /** 功能插件 */
    FUNCTIONAL: 2,
} as const;

export type ExtensionTypeType = (typeof ExtensionType)[keyof typeof ExtensionType];
export type ExtensionTypeKey = keyof typeof ExtensionType;

/**
 * 插件支持的终端类型
 */
export const ExtensionSupportTerminal = {
    /** Web端 */
    WEB: 1,
    /** 公众号 */
    WEIXIN: 2,
    /** H5 */
    H5: 3,
    /** 小程序 */
    MP: 4,
    /** API端 */
    API: 5,
} as const;

export type ExtensionSupportTerminalType =
    (typeof ExtensionSupportTerminal)[keyof typeof ExtensionSupportTerminal];
export type ExtensionSupportTerminalKey = keyof typeof ExtensionSupportTerminal;

/**
 * 插件下载类型
 */
export const ExtensionDownload = {
    /** 安装 */
    INSTALL: 1,
    /** 升级 */
    UPGRADE: 2,
} as const;

export type ExtensionDownloadType = (typeof ExtensionDownload)[keyof typeof ExtensionDownload];
export type ExtensionDownloadTypeKey = keyof typeof ExtensionDownload;
