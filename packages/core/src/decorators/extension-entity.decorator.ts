import { Entity, EntityOptions } from "@buildingai/db/typeorm";
import { findStackTargetFile } from "@buildingai/utils";
import chalk from "chalk";
import { sep } from "path";

import { getExtensionSchemaName } from "../modules/extension/utils/extension.utils";

/**
 * Extension entity decorator
 *
 * Automatically assigns entities to their plugin's schema
 */
export function ExtensionEntity(options?: string | EntityOptions): ClassDecorator {
    return function (target: any) {
        // Get the error stack to inspect the call site
        // Support both Unix (/) and Windows (\) path separators
        const stackCallerFile = findStackTargetFile([`${sep}build${sep}db${sep}entities${sep}`]);

        // Extract plugin information from the file path
        if (stackCallerFile.length >= 1) {
            // Normalize the path to use forward slashes for consistent processing
            const normalizedPath = stackCallerFile[0].replace(/\\/g, "/");
            const pluginsStr = "/extensions/";
            const pluginsIndex = normalizedPath.indexOf(pluginsStr);
            if (pluginsIndex !== -1) {
                // Extract the plugin directory name from the path
                const pluginPath = normalizedPath.substring(pluginsIndex + pluginsStr.length);
                const parts = pluginPath.split("/");
                const pluginDir = parts[0]; // Get the plugin directory name

                // Sanitize schema name using the same logic as schema creation
                try {
                    const schemaName = getExtensionSchemaName(pluginDir);

                    // Determine the table name based on the options type
                    let tableName: string;
                    if (typeof options === "string") {
                        // Use the string value directly when options is a string
                        tableName = options;
                    } else if (options && typeof options === "object" && options.name) {
                        // Use the name property when options is an object with name
                        tableName = options.name;
                    } else {
                        // Use the class name (converted to snake_case) when no table name is provided
                        const className = target.name
                            .replace(/([A-Z])/g, "_$1")
                            .toLowerCase()
                            .slice(1);
                        tableName = className;
                    }

                    // Apply the native Entity decorator
                    if (typeof options === "object" && options) {
                        // Preserve other properties and update name when options is EntityOptions
                        Entity({ ...options, name: tableName, schema: schemaName })(target);
                    } else {
                        // Pass the table name directly when options is a string or undefined
                        Entity(tableName, { schema: schemaName })(target);
                    }
                    return;
                } catch (error) {
                    console.error("Failed to get plugin package name:", error);
                }
            }
        }

        // Throw an exception if all attempts fail
        console.error(
            chalk.bgRed("\nError"),
            chalk.red(
                `@ExtensionEntity decorator was invoked incorrectly. Please verify the call site.\n` +
                    `Entity file: ${stackCallerFile}\n`,
            ),
        );
        return process.exit(1);
    };
}
