import { DECORATOR_KEYS } from "@buildingai/constants";
import { SetMetadata } from "@nestjs/common";

/**
 * 公共路由装饰器
 *
 * 用于标记不需要认证的公共路由
 *
 * @returns 装饰器
 *
 * @example
 * ```typescript
 * // 在方法上使用，只有特定方法不需要认证
 * @WebController('mixed')
 * export class MixedController {
 *   // 需要认证
 *   @Get('profile')
 *   getProfile(@Playground() playground) {
 *     return { userId: playground.userId };
 *   }
 *
 *   // 不需要认证
 *   @Public()
 *   @Get('info')
 *   getPublicInfo() {
 *     return { version: '1.0.0' };
 *   }
 * }
 *
 * // 也可以在控制器选项中设置 skipAuth 来跳过认证
 * @WebController({
 *   path: 'another-public',
 *   skipAuth: true // 相当于使用 @Public()
 * })
 * export class AnotherPublicController {
 *   // ...
 * }
 * ```
 */
export const Public = () => SetMetadata(DECORATOR_KEYS.IS_PUBLIC_KEY, true);
