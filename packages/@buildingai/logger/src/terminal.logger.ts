import chalk from "chalk";

type LogLevel = "success" | "error" | "warn" | "info" | "log";

interface LoggerOptions {
    icon?: string;
    iconColor?: keyof typeof chalk;
    color?: keyof typeof chalk;
    label?: string;
    labelWidth?: number;
}

const defaultIcons: Record<LogLevel, string> = {
    success: "✔",
    error: "✖",
    warn: "⚠",
    info: "ℹ",
    log: "➜",
};

const defaultColors: Record<LogLevel, keyof typeof chalk> = {
    success: "green",
    error: "red",
    warn: "yellow",
    info: "cyan",
    log: "blue",
};

/**
 * 计算字符串的实际显示宽度（中文字符按2个字符宽度计算）
 *
 * @param str 输入字符串
 * @returns 实际显示宽度
 */
const getDisplayWidth = (str: string): number => {
    let width = 0;
    for (let i = 0; i < str.length; i++) {
        const char = str.charAt(i);
        // 判断是否为中文字符（包括中文标点符号）
        if (/[\u4e00-\u9fff\u3400-\u4dbf\uff00-\uffef]/.test(char)) {
            width += 2;
        } else {
            width += 1;
        }
    }
    return width;
};

/**
 * 按实际显示宽度填充字符串
 *
 * @param str 输入字符串
 * @param targetWidth 目标显示宽度
 * @param fillChar 填充字符，默认为空格
 * @returns 填充后的字符串
 */
const padEndByDisplayWidth = (str: string, targetWidth: number, fillChar: string = " "): string => {
    const currentWidth = getDisplayWidth(str);
    const paddingNeeded = Math.max(0, targetWidth - currentWidth);
    return str + fillChar.repeat(paddingNeeded);
};

/**
 * Check if should skip logging in PM2 cluster mode
 * Only log from the first instance (instance 0) to avoid duplicate logs
 */
const shouldSkipPm2ClusterLog = (): boolean => {
    const pm2InstanceId = process.env.NODE_APP_INSTANCE || process.env.pm_id;
    return pm2InstanceId !== undefined && pm2InstanceId !== "0";
};

/**
 * 通用日志输出函数
 *
 * @param message 消息内容
 * @param opts 日志选项
 */
const TerminalLogger = (message: string, opts: LoggerOptions = {}) => {
    // Skip logging in PM2 cluster mode for non-primary instances
    if (shouldSkipPm2ClusterLog()) {
        return;
    }

    const { icon = "➜", iconColor = "magenta", color, label = "", labelWidth = 21 } = opts;

    const chalkInstance = chalk as any;
    const coloredIcon = iconColor ? chalkInstance[iconColor](icon) : icon;
    const coloredMessage = color && chalkInstance[color] ? chalkInstance[color](message) : message;
    const space = "  ";

    let labelText = label;
    if (!labelText.includes(":") && labelText) {
        labelText += ":";
    }
    const paddedLabel = padEndByDisplayWidth(labelText, labelWidth);

    if (!label) {
        console.log(`${coloredIcon}${space}${coloredMessage}`);
        return;
    }
    console.log(`${coloredIcon}${space}${paddedLabel}${space}${coloredMessage}`);
};

TerminalLogger.success = (label: string, message: string, opts?: LoggerOptions) =>
    TerminalLogger(message, {
        icon: defaultIcons.success,
        iconColor: defaultColors.success,
        color: defaultColors.success,
        label,
        ...opts,
    });

TerminalLogger.error = (label: string, message: string, opts?: LoggerOptions) =>
    TerminalLogger(message, {
        icon: defaultIcons.error,
        iconColor: defaultColors.error,
        color: defaultColors.error,
        label,
        ...opts,
    });

TerminalLogger.warn = (label: string, message: string, opts?: LoggerOptions) =>
    TerminalLogger(message, {
        icon: defaultIcons.warn,
        iconColor: defaultColors.warn,
        color: defaultColors.warn,
        label,
        ...opts,
    });

TerminalLogger.info = (label: string, message: string, opts?: LoggerOptions) =>
    TerminalLogger(message, {
        icon: defaultIcons.info,
        iconColor: defaultColors.info,
        color: defaultColors.info,
        label,
        ...opts,
    });

TerminalLogger.log = (label: string, message: string, opts?: LoggerOptions) =>
    TerminalLogger(message, {
        icon: defaultIcons.log,
        iconColor: defaultColors.log,
        label,
        ...opts,
    });

// 导出命名函数和类型
export { TerminalLogger };
