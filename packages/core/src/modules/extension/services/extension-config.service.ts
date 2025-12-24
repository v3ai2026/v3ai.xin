import { Injectable } from "@nestjs/common";
import { existsSync } from "fs";
import { readFile, writeFile } from "fs/promises";
import { join } from "path";

/**
 * Extension Configuration Service
 *
 * Handles extensions.json file operations for managing extension enabled/disabled state
 */
@Injectable()
export class ExtensionConfigService {
    /**
     * Get the path to extensions.json file
     *
     * @returns Absolute path to extensions.json
     */
    private getExtensionsJsonPath(): string {
        return join(process.cwd(), "..", "..", "extensions", "extensions.json");
    }

    /**
     * Normalize author field to ensure it has the correct structure
     *
     * @param author Author data (can be object or string)
     * @returns Normalized author object
     */
    private normalizeAuthor(author?: { avatar?: string; name?: string; homepage?: string }): {
        avatar: string;
        name: string;
        homepage: string;
    } {
        return {
            avatar: author?.avatar ?? "",
            name: author?.name ?? "",
            homepage: author?.homepage ?? "",
        };
    }

    /**
     * Update extensions.json file to enable/disable an extension
     *
     * @param identifier Extension identifier
     * @param enabled Whether to enable or disable the extension
     */
    async updateExtensionsJson(identifier: string, enabled: boolean): Promise<void> {
        try {
            const extensionsJsonPath = this.getExtensionsJsonPath();

            if (!existsSync(extensionsJsonPath)) {
                console.warn(`extensions.json not found at ${extensionsJsonPath}`);
                return;
            }

            // Read the current extensions.json
            const content = await readFile(extensionsJsonPath, "utf-8");
            const extensionsConfig = JSON.parse(content);

            // Update the enabled field for the extension
            let updated = false;

            // Check in applications
            if (extensionsConfig.applications) {
                for (const key in extensionsConfig.applications) {
                    const ext = extensionsConfig.applications[key];
                    if (ext.manifest?.identifier === identifier) {
                        ext.enabled = enabled;
                        updated = true;
                        break;
                    }
                }
            }

            // Check in functionals if not found in applications
            if (!updated && extensionsConfig.functionals) {
                for (const key in extensionsConfig.functionals) {
                    const ext = extensionsConfig.functionals[key];
                    if (ext.manifest?.identifier === identifier) {
                        ext.enabled = enabled;
                        updated = true;
                        break;
                    }
                }
            }

            if (updated) {
                // Write back to extensions.json
                await writeFile(
                    extensionsJsonPath,
                    JSON.stringify(extensionsConfig, null, 4),
                    "utf-8",
                );
                console.log(`Updated extensions.json: ${identifier} enabled=${enabled}`);
            } else {
                console.warn(`Extension ${identifier} not found in extensions.json`);
            }
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : String(error);
            console.error(`Failed to update extensions.json: ${errorMessage}`);
            // Don't throw error to avoid breaking the enable/disable operation
        }
    }

    /**
     * Read extensions.json file
     *
     * @returns Parsed extensions configuration or null if file doesn't exist
     */
    async readExtensionsJson(): Promise<any | null> {
        try {
            const extensionsJsonPath = this.getExtensionsJsonPath();

            if (!existsSync(extensionsJsonPath)) {
                return null;
            }

            const content = await readFile(extensionsJsonPath, "utf-8");
            return JSON.parse(content);
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : String(error);
            console.error(`Failed to read extensions.json: ${errorMessage}`);
            return null;
        }
    }

    /**
     * Remove extension from extensions.json file
     *
     * @param identifier Extension identifier
     */
    async removeExtension(identifier: string): Promise<void> {
        try {
            const extensionsJsonPath = this.getExtensionsJsonPath();

            if (!existsSync(extensionsJsonPath)) {
                console.warn(`extensions.json not found at ${extensionsJsonPath}`);
                return;
            }

            // Read the current extensions.json
            const content = await readFile(extensionsJsonPath, "utf-8");
            const extensionsConfig = JSON.parse(content);

            let removed = false;

            // Remove from applications
            if (extensionsConfig.applications) {
                for (const key in extensionsConfig.applications) {
                    const ext = extensionsConfig.applications[key];
                    if (ext.manifest?.identifier === identifier) {
                        delete extensionsConfig.applications[key];
                        removed = true;
                        break;
                    }
                }
            }

            // Remove from functionals if not found in applications
            if (!removed && extensionsConfig.functionals) {
                for (const key in extensionsConfig.functionals) {
                    const ext = extensionsConfig.functionals[key];
                    if (ext.manifest?.identifier === identifier) {
                        delete extensionsConfig.functionals[key];
                        removed = true;
                        break;
                    }
                }
            }

            if (removed) {
                // Write back to extensions.json
                await writeFile(
                    extensionsJsonPath,
                    JSON.stringify(extensionsConfig, null, 4),
                    "utf-8",
                );
                console.log(`Removed extension from extensions.json: ${identifier}`);
            } else {
                console.warn(`Extension ${identifier} not found in extensions.json`);
            }
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : String(error);
            console.error(`Failed to remove extension from extensions.json: ${errorMessage}`);
            // Don't throw error to avoid breaking the uninstall operation
        }
    }

    /**
     * Add extension to extensions.json file
     *
     * @param identifier Extension identifier
     * @param extensionConfig Extension configuration object
     * @param type Extension type ('applications' or 'functionals')
     */
    async addExtension(
        identifier: string,
        extensionConfig: any,
        type: "applications" | "functionals" = "applications",
    ): Promise<void> {
        try {
            const extensionsJsonPath = this.getExtensionsJsonPath();

            let extensionsConfig: any = {};

            if (existsSync(extensionsJsonPath)) {
                const content = await readFile(extensionsJsonPath, "utf-8");
                extensionsConfig = JSON.parse(content);
            }

            // Initialize the type section if it doesn't exist
            if (!extensionsConfig[type]) {
                extensionsConfig[type] = {};
            }

            // Normalize author field if it exists in manifest
            if (extensionConfig?.manifest?.author) {
                extensionConfig.manifest.author = this.normalizeAuthor(
                    extensionConfig.manifest.author,
                );
            }

            // Add the extension
            extensionsConfig[type][identifier] = extensionConfig;

            // Write back to extensions.json
            await writeFile(extensionsJsonPath, JSON.stringify(extensionsConfig, null, 4), "utf-8");
            console.log(`Added extension to extensions.json: ${identifier}`);
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : String(error);
            console.error(`Failed to add extension to extensions.json: ${errorMessage}`);
            throw new Error(`Failed to add extension to configuration: ${errorMessage}`);
        }
    }

    /**
     * Update author name in extensions.json
     *
     * @param identifier Extension identifier
     * @param authorName Author name to update
     */
    async updateAuthorName(identifier: string, authorName: string): Promise<void> {
        try {
            const extensionsJsonPath = this.getExtensionsJsonPath();

            if (!existsSync(extensionsJsonPath)) {
                return;
            }

            const content = await readFile(extensionsJsonPath, "utf-8");
            const extensionsConfig = JSON.parse(content);

            // Update in applications
            if (extensionsConfig.applications?.[identifier]?.manifest?.author) {
                extensionsConfig.applications[identifier].manifest.author.name = authorName;
            }

            // Update in functionals
            if (extensionsConfig.functionals?.[identifier]?.manifest?.author) {
                extensionsConfig.functionals[identifier].manifest.author.name = authorName;
            }

            await writeFile(extensionsJsonPath, JSON.stringify(extensionsConfig, null, 4), "utf-8");
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : String(error);
            console.error(`Failed to update author name in extensions.json: ${errorMessage}`);
        }
    }
}
