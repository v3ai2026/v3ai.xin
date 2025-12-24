/**
 * 路径校验工具函数
 * 用于校验路由路径是否包含非法字符
 */

/**
 * 校验路径是否包含非法字符
 * @param path 需要校验的路径
 * @param options 校验选项
 * @returns 如果路径合法，返回true；否则抛出错误
 */
export function validatePath(
    path: string,
    options: {
        /** 不允许的字符列表 */
        disallowedChars?: string[];
        /** 自定义错误消息 */
        errorMessage?: string;
        /** 是否抛出错误，默认为true */
        throwError?: boolean;
    } = {},
): boolean {
    const { disallowedChars = ["/", ":"], errorMessage, throwError = true } = options;

    // 检查路径中是否包含不允许的字符
    const invalidChar = disallowedChars.find((char) => path.includes(char));

    if (invalidChar) {
        const message =
            errorMessage ||
            `路径 "${path}" 包含非法字符 "${invalidChar}"。路径中不允许包含以下字符: ${disallowedChars.join(", ")}`;

        if (throwError) {
            throw new Error(message);
        }

        return false;
    }

    return true;
}
