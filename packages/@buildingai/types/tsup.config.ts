import { defineConfig } from "tsup";

/**
 * Tsup configuration for @buildingai/types package
 * @description Builds the package in both ESM and CJS formats with TypeScript declarations
 * Supports sub-path imports via wildcard exports
 */
export default defineConfig({
    entry: ["src/**/*.ts"],
    format: ["esm", "cjs"],
    dts: {
        compilerOptions: {
            incremental: false,
            composite: false,
        },
    },
    clean: true,
    sourcemap: true,
    splitting: false,
    treeshake: true,
    outDir: "dist",
});
