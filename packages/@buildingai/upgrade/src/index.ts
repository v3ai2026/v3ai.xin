import { DataSource } from "@buildingai/db/typeorm";
import { TerminalLogger } from "@buildingai/logger";

/**
 * @buildingai/upgrade
 *
 * Version upgrade scripts package
 * Contains complex business logic handlers for version upgrades
 */

/**
 * Upgrade context interface
 *
 * Provides necessary dependencies for upgrade scripts
 */
export interface UpgradeContext {
    /**
     * TypeORM DataSource instance
     *
     * Provides access to:
     * - dataSource.query(sql, params) - Execute raw SQL
     * - dataSource.getRepository(entity) - Get entity repository
     * - dataSource.createQueryRunner() - Create query runner for transactions
     * - dataSource.manager - Entity manager
     */
    dataSource: DataSource;

    /** Additional services can be added here */
    [key: string]: any;
}

/**
 * Base upgrade script interface
 *
 * All version upgrade scripts should implement this interface
 */
export interface IUpgradeScript {
    /** Script version */
    readonly version: string;
    /** Execute upgrade logic */
    execute(context: UpgradeContext): Promise<void>;
}

/**
 * Base upgrade script class
 *
 * Provides common functionality for upgrade scripts
 */
export abstract class BaseUpgradeScript implements IUpgradeScript {
    abstract readonly version: string;

    /**
     * Execute upgrade logic
     * Override this method in subclasses
     */
    abstract execute(context: UpgradeContext): Promise<void>;

    /**
     * Log info message
     */
    protected log(message: string): void {
        TerminalLogger.log(`Upgrade ${this.version}`, message, {
            icon: "⬆",
        });
    }

    /**
     * Log error message
     */
    protected error(message: string, error?: unknown): void {
        TerminalLogger.error(
            `Upgrade ${this.version}`,
            `ERROR: ${message} \n${error instanceof Error ? error.message : String(error)}`,
        );
    }

    /**
     * Log success message
     */
    protected success(message: string): void {
        TerminalLogger.success(`Upgrade ${this.version}`, message);
    }
}

// Export types
export type { IUpgradeScript as UpgradeScript };
