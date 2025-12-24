import { SetMetadata } from "@nestjs/common";

/**
 * 文件URL字段配置接口
 */
export interface FileUrlFieldConfig {
    /** 字段路径，支持嵌套路径，如 'avatar' 或 'user.avatar' 或 'items.*.avatar' */
    field: string;
    /** 是否为数组字段，当字段值为数组时需要设置为true */
    isArray?: boolean;
}

/**
 * 文件URL配置
 */
export interface FileUrlConfig {
    /** 需要处理的字段列表 */
    fields: (string | FileUrlFieldConfig)[];
}

/**
 * 文件URL元数据键
 */
export const FILE_URL_METADATA_KEY = "file_url_fields";

/**
 * 文件URL装饰器
 *
 * 用于标记控制器方法返回的数据中哪些字段需要进行文件域名拼接
 *
 * @param config 文件URL配置或字段数组
 *
 * @example
 * ```typescript
 * // 简单字段
 * @BuildFileUrl(['avatar', 'cover'])
 * async getUser() {
 *   return { avatar: 'path/to/avatar.jpg', cover: 'path/to/cover.jpg' };
 * }
 *
 * // 嵌套字段
 * @BuildFileUrl(['user.avatar', 'items.*.image'])
 * async getData() {
 *   return {
 *     user: { avatar: 'path/to/avatar.jpg' },
 *     items: [{ image: 'path/to/image1.jpg' }, { image: 'path/to/image2.jpg' }]
 *   };
 * }
 *
 * // 复杂配置
 * @BuildFileUrl({
 *   fields: [
 *     'avatar',
 *     { field: 'images', isArray: true },
 *     { field: 'items.*.thumbnail' }
 *   ]
 * })
 * async getComplexData() {
 *   return {
 *     avatar: 'path/to/avatar.jpg',
 *     images: ['path/to/img1.jpg', 'path/to/img2.jpg'],
 *     items: [{ thumbnail: 'path/to/thumb1.jpg' }]
 *   };
 * }
 * ```
 */
export const BuildFileUrl = (config: string[] | FileUrlConfig) => {
    const normalizedConfig: FileUrlConfig = Array.isArray(config) ? { fields: config } : config;

    return SetMetadata(FILE_URL_METADATA_KEY, normalizedConfig);
};
