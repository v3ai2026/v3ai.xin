// logger.js
const colors = {
    reset: "\x1b[0m",
    bold: "\x1b[1m",

    cyan: "\x1b[36m",
    yellow: "\x1b[33m",
    green: "\x1b[32m",
    red: "\x1b[31m",
    gray: "\x1b[90m",
    white: "\x1b[37m",
    magenta: "\x1b[35m",
    blue: "\x1b[34m",
};

function colorize(color, text, bold = false) {
    return `${bold ? colors.bold : ""}${color}${text}${colors.reset}`;
}

/* ------------------ 简单 Logger ------------------ */
const Logger = {
    info: function (title, message) {
        console.log(`${colorize(colors.cyan, `[${title}]`, true)} ${message}`);
    },
    warning: function (title, message) {
        console.log(`${colorize(colors.yellow, `[${title}]`, true)} ${message}`);
    },
    success: function (title, message) {
        console.log(`${colorize(colors.green, `[${title}]`, true)} ${message}`);
    },
    error: function (title, message) {
        console.error(`${colorize(colors.red, `[${title}]`, true)} ${message}`);
    },
    log: function (title, message) {
        console.log(`${colorize(colors.gray, `[${title}]`)} ${message}`);
    },
};

/* ------------------ 高级 Logger ------------------ */
// 默认图标和颜色
const defaultIcons = { success: "✔", error: "✖", warn: "⚠", info: "ℹ", log: "➜" };
const defaultColors = {
    success: colors.green,
    error: colors.red,
    warn: colors.yellow,
    info: colors.cyan,
    log: colors.blue,
};

// 计算显示宽度（中文字符算 2 个）
function getDisplayWidth(str) {
    let width = 0;
    for (let i = 0; i < str.length; i++) {
        width += /[\u4e00-\u9fff\u3400-\u4dbf\uff00-\uffef]/.test(str[i]) ? 2 : 1;
    }
    return width;
}

// 填充到指定宽度
function padEndByDisplayWidth(str, targetWidth, fillChar = " ") {
    const width = getDisplayWidth(str);
    return str + fillChar.repeat(Math.max(0, targetWidth - width));
}

// 高级打印
function printLog(message, options = {}) {
    const {
        icon = "➜",
        iconColor = colors.magenta,
        color = colors.white,
        label = "",
        labelWidth = 15,
    } = options;
    const coloredIcon = colorize(iconColor, icon);
    const coloredMessage = colorize(color, message);
    let paddedLabel = "";
    if (label) {
        let labelText = label.includes(":") ? label : label + ":";
        paddedLabel = padEndByDisplayWidth(labelText, labelWidth);
    }
    const space = "  ";
    console.log(
        paddedLabel
            ? `${coloredIcon}${space}${paddedLabel}${space}${coloredMessage}`
            : `${coloredIcon}${space}${coloredMessage}`,
    );
}

const AdvancedLogger = {
    success: (label, message, opts = {}) =>
        printLog(message, {
            icon: defaultIcons.success,
            iconColor: defaultColors.success,
            color: defaultColors.success,
            label,
            ...opts,
        }),
    error: (label, message, opts = {}) =>
        printLog(message, {
            icon: defaultIcons.error,
            iconColor: defaultColors.error,
            color: defaultColors.error,
            label,
            ...opts,
        }),
    warn: (label, message, opts = {}) =>
        printLog(message, {
            icon: defaultIcons.warn,
            iconColor: defaultColors.warn,
            color: defaultColors.warn,
            label,
            ...opts,
        }),
    info: (label, message, opts = {}) =>
        printLog(message, {
            icon: defaultIcons.info,
            iconColor: defaultColors.info,
            color: defaultColors.info,
            label,
            ...opts,
        }),
    log: (label, message, opts = {}) =>
        printLog(message, {
            icon: defaultIcons.log,
            iconColor: defaultColors.log,
            color: colors.white,
            label,
            ...opts,
        }),
};

/* ------------------ 导出 ------------------ */
export { AdvancedLogger, Logger };

/**
 * Print the BuildingAI brand logo to console
 */
export const printBrandLogo = () => {
    const colorStart = `\x1b[38;2;97;95;255m`;
    const colorEnd = `\x1b[0m`;

    const logo = [
        " ____                 ___       __                      $0______  ______$1",
        "/\\  _`\\           $0__$1 /\\_ \\     /\\ \\  $0__$1                $0/\\  _  \\/\\__  _\\$1",
        "\\ \\ \\L\\ \\  __  __$0/\\_\\$1\\//\\ \\    \\_\\ \\$0/\\_\\$1    ___      __$0\\ \\ \\L\\ \\/_/\\ \\/$1",
        " \\ \\  _ <'/\\ \\/\\ $0\\/$1\\ \\ \\ \\ \\   /'_` $0\\/$1\\ \\ /' _ `\\  /'_ `$0\\ \\  __ \\ \\ \\ \\$1",
        "  \\ \\ \\L\\ \\ \\ \\_\\ \\ \\ \\ \\_\\ \\_/\\ \\L\\ \\ \\ \\/\\ \\/\\ \\/\\ \\L\\ $0\\ \\ \\/\\ \\ \\_\\ \\__$1",
        "   \\ \\____/\\ \\____/\\ \\_\\/\\____\\ \\___,_\\ \\_\\ \\_\\ \\_\\ \\____ $0\\ \\_\\ \\_\\/\\_____\\$1",
        "    \\/___/  \\/___/  \\/_/\\/____/\\/__,_ /\\/_/\\/_/\\/_/\\/___L\\ $0\\/_/\\/_/\\/_____/$1",
        "                                                     /\\____/",
        "                                                     \\_/__/",
    ];
    const coloredLogo = logo
        .map((line) => line.replace(/\$0/g, colorStart).replace(/\$1/g, colorEnd))
        .join("\n");

    console.log("\n" + coloredLogo + "\n");
};
