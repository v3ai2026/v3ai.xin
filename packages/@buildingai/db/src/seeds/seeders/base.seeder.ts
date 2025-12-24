import { TerminalLogger } from "@buildingai/logger";
import fse from "fs-extra";
import * as path from "path";

import { DataSource } from "../../typeorm";

/**
 * Base seeder abstract class
 *
 * All seeders should extend this class and implement the run method
 */
export abstract class BaseSeeder {
    /**
     * Seeder name for logging purposes
     */
    abstract readonly name: string;

    /**
     * Execution priority, lower numbers run earlier
     */
    abstract readonly priority: number;

    /**
     * Primary seeder logic
     *
     * @param dataSource TypeORM data source
     */
    abstract run(dataSource: DataSource): Promise<void>;

    /**
     * Optional precondition check
     *
     * @param dataSource TypeORM data source
     * @returns Whether the seeder should run
     */
    async shouldRun(_dataSource: DataSource): Promise<boolean> {
        return true;
    }

    /**
     * Resolve a configuration file path
     *
     * Checks multiple possible paths and returns the first existing file path
     * Supports both main application seeds and extension seeds
     *
     * @param fileName Configuration file name
     * @returns File path
     * @throws Throws when the file cannot be found
     */
    protected getConfigPath(fileName: string): string {
        const possiblePaths = [
            // Development environment path (main app)
            path.join(process.cwd(), `packages/@buildingai/db/src/seeds/data/${fileName}`),
            // Compiled path (main app)
            path.join(__dirname, `../data/${fileName}`),
            // Extension development path (relative to seeder file)
            path.join(__dirname, `../data/${fileName}`),
            // Extension compiled path (relative to seeder file in build directory)
            path.join(__dirname, `data/${fileName}`),
        ];

        for (const possiblePath of possiblePaths) {
            if (fse.pathExistsSync(possiblePath)) {
                return possiblePath;
            }
        }

        throw new Error(`Unable to find configuration file: ${fileName}`);
    }

    /**
     * Read a JSON configuration file
     *
     * @param fileName Configuration file name
     * @returns Parsed JSON object
     */
    protected async loadConfig<T = any>(fileName: string): Promise<T> {
        const configPath = this.getConfigPath(fileName);
        return await fse.readJson(configPath);
    }

    /**
     * Log a success message
     *
     * @param message Log message
     */
    protected logSuccess(message: string): void {
        TerminalLogger.success(this.name, message);
    }

    /**
     * Log an informational message
     *
     * @param message Log message
     */
    protected logInfo(message: string): void {
        TerminalLogger.info(this.name, message);
    }

    /**
     * Log a warning message
     *
     * @param message Log message
     */
    protected logWarn(message: string): void {
        TerminalLogger.warn(this.name, message);
    }

    /**
     * Log an error message
     *
     * @param message Log message
     */
    protected logError(message: string): void {
        TerminalLogger.error(this.name, message);
    }
}
