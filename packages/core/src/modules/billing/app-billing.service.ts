import { Injectable, Logger } from "@nestjs/common";

import { BaseBillingService } from "./base-billing.service";

/**
 * App Billing Service
 *
 * Provides billing functionality for the main application.
 * Extends BaseBillingService with app-specific billing logic.
 *
 * Use this service for:
 * - Application-level power deductions
 * - Core feature billing
 * - System service billing
 *
 * @example
 * ```ts
 * @Injectable()
 * export class SomeAppService {
 *   constructor(private readonly appBillingService: AppBillingService) {}
 *
 *   async someMethod() {
 *     await this.appBillingService.deductUserPower({
 *       userId: 'user-id',
 *       amount: 1,
 *       source: {
 *         type: ACCOUNT_LOG_SOURCE.APP,
 *         source: 'Feature Name'
 *       },
 *       remark: 'Feature usage fee'
 *     });
 *   }
 * }
 * ```
 */
@Injectable()
export class AppBillingService extends BaseBillingService {
    protected readonly logger = new Logger(AppBillingService.name);

    /**
     * Add app-specific billing methods here
     *
     * For example:
     * - Batch deductions
     * - Discount calculations
     * - Special billing rules
     */
}
