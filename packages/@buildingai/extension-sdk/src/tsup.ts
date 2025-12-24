import "@buildingai/config/utils/env";

import * as fs from "fs-extra";
import { glob } from "glob";
import * as path from "path";
import type { Options } from "tsup";

/**
 * BuildingAI extension tsup options
 */
export interface BuildingAITsupOptions extends Options {
    /**
     * Static files/directories to copy after build
     * Paths are relative to src/api/ and support glob patterns
     * Will be copied to build/ (src/api/ prefix is removed)
     *
     * @example
     * ["db/seeds/data", "assets/**\/*"]
     */
    assets?: string[];
}

/**
 * Default static files to copy
 */
const defaultAssets: string[] = ["db/seeds/data"];

/**
 * Create onSuccess handler for copying static files
 */
function createOnSuccessHandler(patterns: string[]) {
    return async () => {
        for (const pattern of patterns) {
            const srcPattern = path.join(process.cwd(), "src", "api", pattern);
            const matches = await glob(srcPattern, { nodir: false });

            if (matches.length === 0) {
                continue;
            }

            for (const srcPath of matches) {
                // Calculate relative path from src/api/
                const relativePath = path.relative(path.join(process.cwd(), "src", "api"), srcPath);
                const destPath = path.join(process.cwd(), "build", relativePath);

                await fs.copy(srcPath, destPath);
                console.log(`✓ Copied: src/api/${relativePath} → build/${relativePath}`);
            }
        }
    };
}

/**
 * Default tsup configuration for BuildingAI extensions
 */
const defaultConfig: Options = {
    entry: ["src/api/**/*.ts"],
    outDir: "build",
    format: ["cjs"],
    dts: false,
    bundle: false,
    sourcemap: process.env.NODE_ENV === "development",
    clean: true,
    splitting: false,
    treeshake: true,
    target: "es2023",
    tsconfig: "tsconfig.api.json",
    skipNodeModulesBundle: false,
};

/**
 * Define BuildingAI extension tsup configuration
 *
 * @param options - Custom tsup options to override defaults
 * @returns Merged tsup configuration
 */
export function defineBuildingAITsupConfig(options: BuildingAITsupOptions = {}): Options {
    const { assets, ...restOptions } = options;

    const mergedAssets = Array.from(new Set([...defaultAssets, ...(assets ?? [])]));

    return {
        ...defaultConfig,
        ...restOptions,
        onSuccess: createOnSuccessHandler(mergedAssets),
    };
}
