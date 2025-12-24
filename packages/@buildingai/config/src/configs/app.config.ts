/**
 * @fileoverview Application global configuration
 * @description This file contains the global configuration for the BuildingAI application,
 * including API endpoints, timeout settings, and environment-specific configurations.
 *
 * @author BuildingAI Teams
 */

import * as fs from "fs";
import * as path from "path";

export interface AppConfigType {
    name: string;
    version: string;
}

/**
 * Get version from root package.json
 */
function getVersionFromPackageJson(): string {
    try {
        // Use process.cwd() to get the execution root directory
        // In production, cwd is packages/api, so we need to go up 2 levels to reach monorepo root
        const rootDir = path.resolve(process.cwd(), "..", "..");
        const packageJsonPath = path.join(rootDir, "package.json");

        if (fs.existsSync(packageJsonPath)) {
            const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, "utf-8"));
            return packageJson.version || "unknown version";
        }
    } catch (error) {
        console.error("Failed to read version from package.json:", error);
    }
    return "unknown version";
}

/**
 * Application global configuration object
 * @description Contains all global configuration settings for the application
 */
export const AppConfig: AppConfigType = {
    /** Application name */
    name: "BuildingAI",

    /** Application version */
    version: getVersionFromPackageJson(),
};
