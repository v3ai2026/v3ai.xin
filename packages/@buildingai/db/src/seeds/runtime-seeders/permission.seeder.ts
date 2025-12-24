import { TerminalLogger } from "@buildingai/logger";

/**
 * Permission synchronization result
 */
interface SyncResult {
    added: number;
    updated: number;
    deprecated: number;
}

/**
 * Permission seeder
 *
 * Responsible for scanning controllers and synchronizing permission data
 * Depends on the NestJS runtime environment
 */
export class PermissionSeeder {
    readonly name = "PermissionSeeder";

    constructor(private readonly permissionService: any) {}

    /**
     * Execute permission synchronization
     */
    async run(): Promise<void> {
        try {
            TerminalLogger.log(
                this.name,
                "Starting controller scan and permission synchronization...",
            );

            // Synchronize permission data
            const result: SyncResult = await this.permissionService.syncApiPermissions();

            TerminalLogger.success(
                this.name,
                `Permission data synchronized: added ${result.added}, updated ${result.updated}, deprecated ${result.deprecated}`,
            );
        } catch (error) {
            TerminalLogger.error(
                this.name,
                `Permission data synchronization failed: ${error.message}`,
            );
            throw error;
        }
    }
}
