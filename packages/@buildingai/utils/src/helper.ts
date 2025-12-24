import { DecoratorKeyType } from "@buildingai/constants/server/decorators-key.constant";
import { ExecutionContext } from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import callsites from "callsites";
import * as path from "path";
import { FindOptionsWhere, ObjectLiteral } from "typeorm";
import { Repository } from "typeorm";

/**
 * 检查控制器是否使用了指定的装饰器
 * @param context 执行上下文
 * @param metadataKeys 要检查的元数据键数组
 * @param errorMessage 如果缺少装饰器时的错误消息
 * @param checkHandler 是否同时检查处理方法上的装饰器，默认为 true
 * @param throwError 是否在缺少装饰器时抛出异常，默认为 true
 * @returns 如果 throwError 为 false，返回检查结果，否则如果检查通过返回 true，如果检查失败则抛出异常
 */
export const checkRequiredDecorators = (
    context: ExecutionContext,
    metadataKeys: DecoratorKeyType[],
    errorMessage: string = "控制器缺少必要的装饰器",
    checkHandler: boolean = true,
    throwError: boolean = true,
): boolean => {
    // 获取控制器类
    const controller = context.getClass();

    // 获取当前控制器上所有的元数据键
    const controllerMetadataKeys = Reflect.getMetadataKeys(controller) || [];

    // 初始化缺失的元数据键数组
    const missingKeys: string[] = [];

    // 检查控制器类上的元数据键
    for (const key of metadataKeys) {
        if (!controllerMetadataKeys.includes(key)) {
            // 如果需要检查处理方法，则获取处理方法上的元数据键
            if (checkHandler) {
                const handler = context.getHandler();
                const handlerMetadataKeys = Reflect.getMetadataKeys(handler) || [];

                // 如果处理方法上也没有该元数据键，则添加到缺失的元数据键数组中
                if (!handlerMetadataKeys.includes(key)) {
                    missingKeys.push(key);
                }
            } else {
                // 如果不检查处理方法，则直接添加到缺失的元数据键数组中
                missingKeys.push(key);
            }
        }
    }

    // 如果有缺失的元数据键
    if (missingKeys.length > 0) {
        const detailedErrorMessage = `${errorMessage}: ${missingKeys.join(", ")}`;

        // 如果需要抛出异常
        if (throwError) {
            throw new Error(detailedErrorMessage);
        }

        return false;
    }

    return true;
};

/**
 * 检查并获取控制器的元数据值
 * @param context 执行上下文
 * @param metadataKey 要获取的元数据键
 * @param defaultValue 如果没有找到元数据时的默认值
 * @param checkHandler 是否同时检查处理方法上的元数据，默认为 true
 * @returns 元数据值或默认值
 */
export const getDecoratorMetadata = <T>(
    context: ExecutionContext,
    metadataKey: DecoratorKeyType,
    defaultValue?: T,
    checkHandler: boolean = true,
): T | undefined => {
    // 获取控制器类
    const controller = context.getClass();

    // 如果需要检查处理方法
    if (checkHandler) {
        const handler = context.getHandler();

        // 先检查处理方法上的元数据
        if (Reflect.hasMetadata(metadataKey, handler)) {
            return Reflect.getMetadata(metadataKey, handler);
        }
    }

    // 检查控制器类上的元数据
    if (Reflect.hasMetadata(metadataKey, controller)) {
        return Reflect.getMetadata(metadataKey, controller);
    }

    // 如果都没有找到，返回默认值
    return defaultValue;
};

/**
 * 检查控制器不应该存在的装饰器
 * @param context 执行上下文
 * @param forbiddenMetadataKeys 不允许存在的元数据键数组
 * @param errorMessage 如果存在禁止的装饰器时的错误消息
 * @param checkHandler 是否同时检查处理方法上的装饰器，默认为 true
 * @param throwError 是否在存在禁止的装饰器时抛出异常，默认为 true
 * @returns 如果 throwError 为 false，返回检查结果，否则如果检查通过返回 true，如果检查失败则抛出异常
 */
export const checkForbiddenDecorators = (
    context: ExecutionContext,
    forbiddenMetadataKeys: DecoratorKeyType[],
    errorMessage: string = "控制器存在禁止的装饰器",
    checkHandler: boolean = true,
    throwError: boolean = true,
): boolean => {
    // 获取控制器类
    const controller = context.getClass();

    // 获取当前控制器上所有的元数据键
    const controllerMetadataKeys = Reflect.getMetadataKeys(controller) || [];

    // 初始化存在的禁止元数据键数组
    const existingForbiddenKeys: string[] = [];

    // 检查控制器类上的元数据键
    for (const key of forbiddenMetadataKeys) {
        if (controllerMetadataKeys.includes(key)) {
            existingForbiddenKeys.push(key);
        }
    }

    // 如果需要检查处理方法
    if (checkHandler) {
        const handler = context.getHandler();
        const handlerMetadataKeys = Reflect.getMetadataKeys(handler) || [];

        // 检查处理方法上的元数据键
        for (const key of forbiddenMetadataKeys) {
            if (handlerMetadataKeys.includes(key) && !existingForbiddenKeys.includes(key)) {
                existingForbiddenKeys.push(key);
            }
        }
    }

    // 如果有存在的禁止元数据键
    if (existingForbiddenKeys.length > 0) {
        const detailedErrorMessage = `${errorMessage}: ${existingForbiddenKeys.join(", ")}`;

        // 如果需要抛出异常
        if (throwError) {
            throw new Error(detailedErrorMessage);
        }

        return false;
    }

    return true;
};

/**
 * 获取当前控制器的类型
 * @param context 执行上下文
 * @returns 控制器类型字符串，如 'web', 'console', 'plugin-web', 'plugin-console' 或 'unknown'
 */
export const getControllerType = (context: ExecutionContext): string => {
    const controller = context.getClass();
    const controllerMetadataKeys = Reflect.getMetadataKeys(controller) || [];

    // 检查控制器类型
    if (controllerMetadataKeys.includes("webController")) {
        return "web";
    } else if (controllerMetadataKeys.includes("consoleController")) {
        return "console";
    } else if (controllerMetadataKeys.includes("pluginWebController")) {
        return "plugin-web";
    } else if (controllerMetadataKeys.includes("pluginConsoleController")) {
        return "plugin-console";
    }

    return "unknown";
};

/**
 * 获取并覆盖元数据，优先从处理程序（Handler）获取，如果不存在则从类（Class）获取
 * 这个工具函数主要用于在守卫、拦截器等组件中获取通过装饰器设置的元数据
 *
 * @param reflector NestJS的反射器实例，用于获取元数据
 * @param metadataKey 元数据的键名
 * @param context 执行上下文，包含处理程序和类的信息
 * @returns 返回找到的元数据值，如果未找到则返回undefined
 * @template T 元数据的类型
 */
export function getOverrideMetadata<T = any>(
    reflector: Reflector,
    metadataKey: string,
    context: ExecutionContext,
): T | undefined {
    return reflector.getAllAndOverride<T>(metadataKey, [context.getHandler(), context.getClass()]);
}

/**
 * 从堆栈中寻找调用某个方法的文件
 * @param suffixes 文件路径后缀关键字
 * @returns 匹配的文件路径数组
 */
export function findStackTargetFile(suffixes: string[]): string[] {
    const frames = callsites();

    // 使用 Set 存储文件路径，自动去重
    const uniqueFiles = new Set<string>();

    frames.forEach((frame: any) => {
        const fileName: string | undefined = frame?.getFileName?.();
        if (!fileName) return;

        if (suffixes.some((suffix) => fileName.includes(suffix))) {
            // 统一使用正斜杠作为路径分隔符，确保跨平台兼容性
            const normalizedPath = fileName.split(path.sep).join("/");
            uniqueFiles.add(normalizedPath);
        }
    });

    // 将 Set 转换回数组
    return Array.from(uniqueFiles);
}

/**
 * 检查堆栈中是否存在指定的路径
 * @param suffixes 文件路径后缀
 * @param paths 文件路径
 * @param excludePaths 排除的路径
 * @returns 如果存在返回true，否则返回false
 */
export function checkIfPathInStack(
    suffixes: string[],
    paths: string[],
    excludePaths?: string[],
): boolean {
    const files = findStackTargetFile(suffixes);

    // 检查是否有任何文件路径包含指定的路径
    return files.some((file) => {
        // 文件路径已在 findStackTargetFile 中标准化为使用正斜杠
        const normalizedFile = file;

        // 检查是否包含任意指定路径
        const hasMatchingPath = paths.some((p) => {
            // 将比较路径统一为使用正斜杠的格式，确保跨平台兼容性
            const normalizedPath = p.split(path.sep).join("/");
            return normalizedFile.includes(normalizedPath);
        });

        // 检查是否不包含任何排除路径
        const notExcluded =
            !excludePaths?.some((p) => {
                // 将排除路径统一为使用正斜杠的格式
                const normalizedExcludePath = p.split(path.sep).join("/");
                return normalizedFile.includes(normalizedExcludePath);
            }) || !excludePaths;

        return hasMatchingPath && notExcluded;
    });
}

/**
 * 拼接路径，避免出现多重斜杠的问题
 * 例如：joinPaths("foo/", "/bar") => "foo/bar"
 *
 * @param segments 要拼接的路径片段
 * @param leadingSlash 是否在结果前添加前导斜杠，默认为 true
 * @param trailingSlash 是否在结果后添加尾部斜杠，默认为 false
 * @returns 拼接后的路径
 */
export function joinPaths(...segments: string[]): string {
    // 过滤掉空字符串
    const filteredSegments = segments.filter((segment) => segment !== "");

    if (filteredSegments.length === 0) {
        return "";
    }

    // 处理每个片段，移除前后多余的斜杠
    const normalizedSegments = filteredSegments.map((segment, index) => {
        // 移除开头的斜杠（第一个片段除外）
        let normalized = index === 0 ? segment : segment.replace(/^\/+/, "");
        // 移除结尾的斜杠（最后一个片段除外）
        normalized =
            index === filteredSegments.length - 1 ? normalized : normalized.replace(/\/+$/, "");
        return normalized;
    });

    // 使用单个斜杠连接所有片段
    return normalizedSegments.join("/");
}

/**
 * 拼接API路径，用于构建控制器路由
 *
 * @param segments 要拼接的路径片段
 * @param options 配置选项
 * @returns 拼接后的API路径
 */
export function joinRouterPaths(...segments: string[]): string {
    // 过滤掉空字符串
    const filteredSegments = segments.filter((segment) => segment !== "");

    if (filteredSegments.length === 0) {
        return "/";
    }

    // 处理每个片段，移除前后多余的斜杠
    const normalizedSegments = filteredSegments.map((segment) => {
        // 移除开头和结尾的斜杠
        return segment.replace(/^\/+/, "").replace(/\/+$/, "");
    });

    // 使用单个斜杠连接所有片段，并确保以斜杠开头
    const result = `/${normalizedSegments.join("/")}`;

    // 确保路径不以多个斜杠开头
    return result.replace(/^\/+/, "/");
}

/**
 * 将kebab-case转换为snake_case
 *
 * @param str 要转换的字符串
 * @returns 转换后的字符串
 */
export function kebabToSnake(str: string) {
    if (typeof str !== "string") return str;
    return str.includes("-") ? str.replace(/-/g, "_") : str;
}

/**
 * 验证数组中的每个元素是否满足给定的验证函数
 *
 * @param array 要验证的数组
 * @param validator 验证函数，返回boolean
 * @param errorMessage 自定义错误消息
 */
export function validateArrayItems<T>(
    array: T[],
    validator: (item: T) => boolean,
    errorMessage: string = "Array item validation failed",
): boolean {
    if (!Array.isArray(array)) {
        console.error("Input must be an array");
        return false;
    }

    const result = array.every(validator);
    if (!result) {
        console.error(errorMessage);
    }
    return result;
}
/**
 * 生成表唯一编码
 * @param entityRepository 表
 * @param field 表字段
 * @param datePrefix 是否时间前缀
 * @param prefix 是否指定前缀
 * @param randSuffixLength 随机数长度
 * @param pool 随机数范围
 * @returns
 */
export async function generateNo<T extends ObjectLiteral>(
    entityRepository: Repository<T>,
    field: keyof T,
    datePrefix: boolean = true,
    prefix: string = "",
    randSuffixLength: number = 6,
    pool: string[] = [],
): Promise<string> {
    let suffix: string = "";
    for (let i = 0; i < randSuffixLength; i++) {
        if (pool.length === 0) {
            suffix += Math.floor(Math.random() * 10); // 0-9 随机数
        } else {
            suffix += pool[Math.floor(Math.random() * pool.length)];
        }
    }
    const now = new Date();
    let currentDateString: string = "";
    if (datePrefix) {
        currentDateString = [
            now.getFullYear(),
            (now.getMonth() + 1).toString().padStart(2, "0"),
            now.getDate().toString().padStart(2, "0"),
            now.getHours().toString().padStart(2, "0"),
            now.getMinutes().toString().padStart(2, "0"),
            now.getSeconds().toString().padStart(2, "0"),
        ].join("");
    }

    const sn = `${prefix}${currentDateString}${suffix}`;
    // 检查编码是否已存在
    const exists = await entityRepository.findOne({ where: { [field]: sn } as any });
    if (exists) {
        return generateNo(entityRepository, field, true, prefix, randSuffixLength, pool);
    }
    return sn;
}

/**
 * 类型安全的条件构建工具函数
 * 只有当值不为 undefined 时，才会将其添加到目标对象中
 *
 * @param target 目标对象
 * @param conditions 条件对象，包含要添加的键值对
 * @returns 构建后的目标对象
 *
 * @example
 * ```typescript
 * const where = buildConditionalObject(
 *   { userId: user.id },
 *   {
 *     name: name ? Like(`%${name}%`) : undefined,
 *     type: type,
 *     isShow: isShow !== undefined ? isEnabled(isShow) : undefined
 *   }
 * );
 * ```
 */
export function buildConditionalObject<T extends Record<string, any>>(
    target: Partial<T>,
    conditions: { [K in keyof T]?: T[K] | undefined },
): Partial<T> {
    const result = { ...target };

    for (const [key, value] of Object.entries(conditions)) {
        if (value !== undefined) {
            result[key as keyof T] = value;
        }
    }

    return result;
}

/**
 * 更简洁的条件构建函数，直接返回构建的对象
 * 支持泛型推断，可以直接指定目标类型
 *
 * @param conditions 条件对象，包含要添加的键值对
 * @returns 构建后的对象，过滤掉 undefined 值
 *
 * @example
 * ```typescript
 * // 自动推断类型
 * const where = buildWhere({
 *   userId: user.id,
 *   name: name ? Like(`%${name}%`) : undefined,
 *   type: type,
 * });
 *
 * // 显式指定类型
 * const where = buildWhere<AiMcpServerWithIsShow>({
 *   creatorId: user.id,
 *   isShow: isShow !== undefined ? isEnabled(isShow) : undefined,
 *   type: type,
 *   name: name ? Like(`%${name}%`) : undefined,
 * });
 * ```
 */
export function buildWhere<T extends Record<string, any> = Record<string, any>>(
    conditions: { [K in keyof T]?: T[K] | undefined } | Record<string, any>,
): FindOptionsWhere<T> {
    const result: FindOptionsWhere<T> = {};

    for (const [key, value] of Object.entries(conditions)) {
        if (value !== undefined) {
            result[key as keyof T] = value;
        }
    }

    return result;
}

/**
 * 获取供应商密钥配置
 * @param key 键名
 * @param config 配置对象，格式：Record<string, {value: string, required: boolean}>
 * @returns 配置值
 * @throws 当键不存在或必填字段值为空时抛出异常
 */
export const getProviderSecret = (
    key: string,
    config: Record<string, { value: string; required: boolean }>,
): string => {
    // 检查键是否存在
    if (!(key in config)) {
        throw new Error(`${key} 字段不存在`);
    }

    const configValue = config[key];

    if (!configValue || typeof configValue !== "object") {
        throw new Error(`${key} 字段格式错误`);
    }

    const { value, required } = configValue;

    // 只有在必填的情况下才检查值是否为空
    if (required && (!value || value.trim() === "")) {
        throw new Error(`${key} 键内容为空`);
    }

    return value ? value.trim() : "";
};
