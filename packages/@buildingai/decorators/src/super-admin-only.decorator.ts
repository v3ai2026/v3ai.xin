import { applyDecorators, SetMetadata } from "@nestjs/common";

/**
 * Super admin only decorator metadata key
 */
export const SUPER_ADMIN_ONLY_KEY = "decorator:super-admin-only";

/**
 * Super admin only decorator
 *
 * Restricts access to super administrators only.
 * This decorator should be used on controller methods that require super admin privileges.
 *
 * @example
 * ```typescript
 * @Post('delete')
 * @SuperAdminOnly()
 * async delete(@Body() dto: DeleteDto) {
 *   return this.service.delete(dto);
 * }
 * ```
 */
export const SuperAdminOnly = () => {
    return applyDecorators(SetMetadata(SUPER_ADMIN_ONLY_KEY, true));
};
