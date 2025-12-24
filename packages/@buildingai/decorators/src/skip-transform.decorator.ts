import { SetMetadata } from "@nestjs/common";

/**
 * 跳过响应转换拦截器的装饰器
 *
 * 使用此装饰器标记的接口将不会被 TransformInterceptor 处理，
 * 直接返回原始响应数据，适用于需要返回特定格式的接口（如第三方回调）
 *
 * @example
 * ```typescript
 * @SkipTransform()
 * @Post("webhook")
 * async webhook(@Body() body: any) {
 *   // 处理逻辑
 *   return "success"; // 直接返回，不会被包装成统一格式
 * }
 * ```
 */
export const SKIP_TRANSFORM_KEY = "skip_transform";

/**
 * 跳过响应转换拦截器装饰器
 */
export const SkipTransform = () => SetMetadata(SKIP_TRANSFORM_KEY, true);
