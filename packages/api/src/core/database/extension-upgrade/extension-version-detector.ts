import { Logger } from "@nestjs/common";
import fse from "fs-extra";
import * as path from "path";
import * as semver from "semver";

/**
 * Extension version information interface
 */
export interface ExtensionVersionInfo {
    /** Extension identifier */
    identifier: string;
    /** Current version */
    current: string;
    /** Installed version (from version file) */
    installed: string | null;
    /** Whether upgrade is needed */
    needsUpgrade: boolean;
    /** Versions that need to be upgraded through */
    upgradeVersions: string[];
}

/**
 * Extension version detector
 *
 * Responsible for detecting extension version and determining if upgrade is needed
 */
export class ExtensionVersionDetector {
    private readonly logger = new Logger(ExtensionVersionDetector.name);
    private readonly extensionDir: string;
    private readonly versionsDir: string;

    constructor(private readonly extensionIdentifier: string) {
        // Navigate up from packages/api to project root
        this.extensionDir = path.join(process.cwd(), "..", "..", "extensions", extensionIdentifier);
        this.versionsDir = path.join(this.extensionDir, "data", "versions");
    }

    /**
     * Get current version from extension package.json
     */
    async getCurrentVersion(): Promise<string> {
        try {
            const packagePath = path.join(this.extensionDir, "package.json");
            const packageJson = await fse.readJson(packagePath);
            return packageJson.version;
        } catch (error) {
            this.logger.error(
                `Failed to read version from package.json for ${this.extensionIdentifier}: ${error.message}`,
            );
            throw error;
        }
    }

    /**
     * Get installed version from version file
     */
    async getInstalledVersion(): Promise<string | null> {
        try {
            if (!(await fse.pathExists(this.versionsDir))) {
                return null;
            }

            const versionFiles = await fse.readdir(this.versionsDir);
            if (versionFiles.length === 0) {
                return null;
            }

            // Return the latest version
            const validVersions = versionFiles.filter((v) => semver.valid(v));
            if (validVersions.length === 0) {
                return null;
            }

            return validVersions.sort((a, b) => semver.compare(b, a))[0];
        } catch (error) {
            this.logger.error(
                `Failed to get installed version for ${this.extensionIdentifier}: ${error.message}`,
            );
            return null;
        }
    }

    /**
     * Check if version file exists
     */
    async versionFileExists(version: string): Promise<boolean> {
        const versionFilePath = path.join(this.versionsDir, version);
        return fse.pathExists(versionFilePath);
    }

    /**
     * Get all versions that need to be upgraded through
     *
     * @param installedVersion Current installed version
     * @param currentVersion Target version
     * @returns Array of versions to upgrade through (sorted)
     */
    private async getUpgradeVersions(
        installedVersion: string | null,
        currentVersion: string,
    ): Promise<string[]> {
        try {
            // If no installed version, this is initial installation
            if (!installedVersion) {
                return [currentVersion];
            }

            // If versions are the same, no upgrade needed
            if (installedVersion === currentVersion) {
                return [];
            }

            const allVersions = new Set<string>();

            // Collect versions from upgrade scripts
            const upgradeDir = path.join(this.extensionDir, "build", "upgrade");
            if (await fse.pathExists(upgradeDir)) {
                const scriptDirs = await fse.readdir(upgradeDir);
                scriptDirs.forEach((dir) => {
                    if (semver.valid(dir)) {
                        allVersions.add(dir);
                    }
                });
            }

            // Collect versions from migration files
            const migrationsDir = path.join(this.extensionDir, "build", "db", "migrations");
            if (await fse.pathExists(migrationsDir)) {
                const migrationFiles = await fse.readdir(migrationsDir);
                migrationFiles.forEach((file) => {
                    if (file.endsWith(".js")) {
                        // Migration file format: timestamp-version-description.js
                        const parts = file.replace(".js", "").split("-");
                        if (parts.length >= 2) {
                            const version = parts[1];
                            if (semver.valid(version)) {
                                allVersions.add(version);
                            }
                        }
                    }
                });
            }

            // Filter and sort versions between installed and current
            const upgradeVersions = Array.from(allVersions)
                .filter((version) => {
                    return (
                        semver.gt(version, installedVersion) && semver.lte(version, currentVersion)
                    );
                })
                .sort((a, b) => semver.compare(a, b));

            // Always include current version if not in the list
            if (!upgradeVersions.includes(currentVersion)) {
                upgradeVersions.push(currentVersion);
            }

            return upgradeVersions;
        } catch (error) {
            this.logger.error(
                `Failed to get upgrade versions for ${this.extensionIdentifier}: ${error.message}`,
            );
            return [currentVersion];
        }
    }

    /**
     * Detect version information
     */
    async detect(): Promise<ExtensionVersionInfo> {
        const currentVersion = await this.getCurrentVersion();
        const installedVersion = await this.getInstalledVersion();

        const needsUpgrade = installedVersion !== currentVersion;

        // Get all versions to upgrade through
        const upgradeVersions = needsUpgrade
            ? await this.getUpgradeVersions(installedVersion, currentVersion)
            : [];

        return {
            identifier: this.extensionIdentifier,
            current: currentVersion,
            installed: installedVersion,
            needsUpgrade,
            upgradeVersions,
        };
    }
}
