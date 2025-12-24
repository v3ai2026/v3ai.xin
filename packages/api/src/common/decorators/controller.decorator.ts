import { validatePath } from "@buildingai/utils";
import { applyDecorators, Controller, SetMetadata } from "@nestjs/common";

import { DECORATOR_KEYS } from "../constants/decorators-key.constant";

/**
 * Console控制器装饰器选项
 */
export interface ConsoleControllerOptions extends WebControllerOptions {
    /**
     * 是否跳过权限检查
     * 默认为false，即需要进行权限检查
     */
    skipPermissionCheck?: boolean;
}

/**
 * API控制器装饰器选项
 */
export interface WebControllerOptions {
    /**
     * 路由路径
     */
    path?: string;

    /**
     * 是否跳过认证
     * 默认为false，即需要进行认证
     */
    skipAuth?: boolean;
}

/**
 * Console控制器装饰器
 *
 * 用于标记控制器为Console后台控制器，自动添加路由前缀、用户类型和认证守卫
 * 支持设置权限组别信息，将控制器路径作为权限组别的code，groupName作为组别的名称
 *
 * @param optionsOrPath 控制器选项或路径
 * @param groupName 权限组别名称
 * @returns 装饰器
 *
 * @example
 * ```typescript
 * // 基本用法 - 使用路径字符串
 * @ConsoleController('user', '用户管理')
 * export class UserController {
 *   // 生成路由: /console/user
 *   @Get()
 *   findAll() {
 *     return this.userService.findAll();
 *   }
 * }
 *
 * // 使用选项对象
 * @ConsoleController({
 *   path: 'settings',
 *   skipPermissionCheck: true // 跳过权限检查
 * }, '系统设置')
 * export class SettingsController {
 *   // 生成路由: /console/settings
 *   @Get()
 *   getSettings() {
 *     return this.settingsService.getAll();
 *   }
 * }
 *
 * // 跳过认证和权限检查
 * @ConsoleController({
 *   path: 'public',
 *   skipAuth: true,
 *   skipPermissionCheck: true
 * }, '公共接口')
 * export class PublicController {
 *   // 生成路由: /console/public
 *   // 此路由不需要认证和权限检查
 *   @Get()
 *   getPublicData() {
 *     return this.publicService.getData();
 *   }
 * }
 * ```
 */

export function ConsoleController(
    optionsOrPath: ConsoleControllerOptions | string,
    groupName: string,
): ClassDecorator {
    const options: ConsoleControllerOptions =
        typeof optionsOrPath === "string" ? { path: optionsOrPath } : optionsOrPath || {};

    const path = options.path || "";

    // 校验路径是否包含非法字符
    if (path) {
        validatePath(path, {
            errorMessage: `控制器路径 "${path}" 包含非法字符。路径中不允许包含 "/" 和 ":" 字符。`,
        });
    }

    const apiPrefix = process.env.VITE_APP_CONSOLE_API_PREFIX;

    // 处理API前缀，去除可能存在的前导斜杠
    const normalizedPrefix = apiPrefix ? apiPrefix.replace(/^\/+/, "") : "";

    // 构建完整的路由路径
    const routePath = normalizedPrefix ? `${normalizedPrefix}/${path}` : `consoleapi/${path}`;

    const decorators = [
        Controller(routePath),
        SetMetadata(DECORATOR_KEYS.CONSOLE_CONTROLLER_KEY, true),
    ];

    // 通过元数据标记是否跳过认证
    if (options.skipAuth === true) {
        decorators.push(SetMetadata(DECORATOR_KEYS.IS_PUBLIC_KEY, true));
    }

    // 通过元数据标记是否跳过权限检查
    if (options.skipPermissionCheck === true) {
        decorators.push(SetMetadata(DECORATOR_KEYS.IS_SKIP_PERMISSIONS_KEY, true));
    }

    // 如果提供了groupName，则设置权限组别元数据
    decorators.push(
        SetMetadata(DECORATOR_KEYS.PERMISSION_GROUP_KEY, {
            code: path,
            name: groupName,
        }),
    );

    return applyDecorators(...decorators);
}

/**
 * API控制器装饰器
 *
 * 用于标记控制器为API前台控制器，自动添加路由前缀、用户类型和认证守卫
 *
 * @param options 控制器选项
 * @returns 装饰器
 *
 * @example
 * ```typescript
 * // 基本用法 - 使用路径字符串
 * @WebController('article')
 * export class ArticleController {
 *   // 生成路由: /web/article
 *   @Get()
 *   findAll() {
 *     return this.articleService.findAll();
 *   }
 * }
 *
 * // 使用选项对象
 * @WebController({
 *   path: 'profile',
 *   skipAuth: false // 需要认证（默认）
 * })
 * export class ProfileController {
 *   // 生成路由: /web/profile
 *   @Get()
 *   getProfile(@Playground() playground) {
 *     return this.profileService.getByUserId(playground.userId);
 *   }
 * }
 *
 * // 公开接口（跳过认证）
 * @WebController({
 *   path: 'public',
 *   skipAuth: true
 * })
 * export class PublicController {
 *   // 生成路由: /web/public
 *   // 此路由不需要认证
 *   @Get('config')
 *   getPublicConfig() {
 *     return this.configService.getPublicConfig();
 *   }
 * }
 * ```
 */
export function WebController(optionsOrPath: WebControllerOptions | string): ClassDecorator {
    const options: WebControllerOptions =
        typeof optionsOrPath === "string" ? { path: optionsOrPath } : optionsOrPath || {};

    const path = options.path || "";

    // 校验路径是否包含非法字符
    if (path) {
        validatePath(path, {
            errorMessage: `控制器路径 "${path}" 包含非法字符。路径中不允许包含 "/" 和 ":" 字符。`,
        });
    }

    // 从环境变量中读取API前缀
    const apiPrefix = process.env.VITE_APP_WEB_API_PREFIX;

    // 处理API前缀，去除可能存在的前导斜杠
    const normalizedPrefix = apiPrefix ? apiPrefix.replace(/^\/+/, "") : "";

    // 构建完整的路由路径
    const routePath = normalizedPrefix ? `${normalizedPrefix}/${path}` : `api/${path}`;

    const decorators = [
        Controller(routePath),
        SetMetadata(DECORATOR_KEYS.WEB_CONTROLLER_KEY, true),
    ];

    // 通过元数据标记是否跳过认证
    if (options.skipAuth === true) {
        decorators.push(SetMetadata(DECORATOR_KEYS.IS_PUBLIC_KEY, true));
    }

    return applyDecorators(...decorators);
}
