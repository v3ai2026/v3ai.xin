import { Entity, EntityOptions } from "../typeorm";

/**
 * 应用实体装饰器
 *
 * @param name 实体名称
 * @returns 装饰器函数
 *
 * @example
 * ```typescript
 *
 * // 注意：此装饰器不能在插件目录下使用
 * // 插件实体应使用 @ExtensionEntity 装饰器
 * ```
 */
export function AppEntity(options?: string | EntityOptions): ClassDecorator {
    return function (target: any) {
        let tableName: string;
        if (typeof options === "string") {
            // 如果options是字符串，直接使用
            tableName = options;
        } else if (options && typeof options === "object" && options.name) {
            // 如果options是对象且有name属性，使用name
            tableName = options.name;
        } else {
            // 如果没有提供表名，使用类名（转换为snake_case）
            const className = target.name
                .replace(/([A-Z])/g, "_$1")
                .toLowerCase()
                .slice(1);
            tableName = className;
        }

        // 应用原生Entity装饰器
        if (typeof options === "object" && options) {
            // 如果是EntityOptions对象，保持其他选项并更新name
            Entity({ ...options, name: tableName })(target);
        } else {
            // 如果是字符串或undefined，直接传递表名
            Entity(tableName)(target);
        }
    };
}
