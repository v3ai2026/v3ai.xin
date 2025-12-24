import type { StorybookConfig } from "@storybook-vue/nuxt";
import { dirname, join } from "path";

/**
 * Resolve the absolute path of a package.
 * This function is needed in projects that use Yarn PnP or are set up within a monorepo.
 *
 * @param value - The package name to resolve
 * @returns The absolute path to the package
 */
function getAbsolutePath(value: string): any {
    return dirname(require.resolve(join(value, "package.json")));
}

/**
 * Shared BuildingAI Storybook configuration
 * This configuration provides a standard setup for all BuildingAI projects
 */
export const sharedConfig: StorybookConfig = {
    stories: [
        "../components/buildingai-ui/**/*.mdx",
        "../components/buildingai-ui/**/*.stories.@(js|jsx|ts|tsx|mdx)",
        "../@buildingai/ui/src/components/**/*.stories.@(js|jsx|ts|tsx|mdx)",
    ],
    addons: [getAbsolutePath("@chromatic-com/storybook"), getAbsolutePath("@storybook/addon-docs")],
    framework: {
        name: getAbsolutePath("@storybook-vue/nuxt"),
        options: {},
    },
    docs: {
        defaultName: "Documentation",
    },
    typescript: {
        check: false,
    },
    viteFinal: async (config, { configType }) => {
        // Customize Vite configuration for Storybook
        if (configType === "DEVELOPMENT") {
            // Development-specific configurations
            config.optimizeDeps = {
                ...config.optimizeDeps,
                include: [
                    ...(config.optimizeDeps?.include || []),
                    "vue-dompurify-html",
                    "clsx",
                    "tailwind-merge",
                    "@buildingai/hooks",
                ],
            };
        }

        // Optimize module resolution to reduce duplicate import warnings
        config.resolve = config.resolve || {};
        config.resolve.dedupe = config.resolve.dedupe || [];
        config.resolve.dedupe.push("@buildingai/hooks");

        // Suppress warnings about missing package.json files
        config.logLevel = "error";

        // Add custom logger to filter out specific warnings
        const originalWarn = console.warn;
        console.warn = (...args) => {
            const message = args.join(" ");
            if (
                message.includes("unable to find package.json for @buildingai/") ||
                message.includes("Duplicated imports") ||
                message.includes("You are currently using Storybook") ||
                message.includes("Error fetching app manifest") ||
                message.includes("storybook.json")
            ) {
                return; // Suppress these specific warnings
            }
            originalWarn.apply(console, args);
        };

        // Remove problematic plugins for Storybook
        if (config.plugins) {
            config.plugins = config.plugins.filter((plugin: any) => {
                // Remove vite-plugin-checker and related plugins that cause issues in Storybook
                if (plugin && typeof plugin === "object") {
                    const pluginName = plugin.name || "";
                    return (
                        !pluginName.includes("vite-plugin-checker") &&
                        !pluginName.includes("checker-runtime")
                    );
                }
                return true;
            });
        }

        // Add resolve alias to handle missing vite-plugin-checker-runtime-entry
        config.resolve = config.resolve || {};
        config.resolve.alias = config.resolve.alias || {};

        // Create a virtual module for the missing entry
        const virtualModuleId = "/@vite-plugin-checker-runtime-entry";
        const virtualModuleId2 = "/vite-plugin-checker-runtime-entry";

        (config.resolve.alias as any)[virtualModuleId] = virtualModuleId;
        (config.resolve.alias as any)[virtualModuleId2] = virtualModuleId2;

        // Add a plugin to handle the virtual module
        config.plugins = config.plugins || [];
        config.plugins.push({
            name: "virtual-checker-runtime",
            resolveId(id) {
                if (id === virtualModuleId || id === virtualModuleId2) {
                    return id;
                }
            },
            load(id) {
                if (id === virtualModuleId || id === virtualModuleId2) {
                    return "export default {};";
                }
            },
        });

        // Add a plugin to handle Nuxt manifest requests
        config.plugins.push({
            name: "nuxt-manifest-handler",
            configureServer(server) {
                server.middlewares.use("/_nuxt/builds/meta/storybook.json", (req, res) => {
                    res.setHeader("Content-Type", "application/json");
                    res.end(
                        JSON.stringify({
                            id: "storybook",
                            timestamp: Date.now(),
                            version: "1.0.0",
                        }),
                    );
                });
            },
        });

        return config;
    },
    staticDirs: ["../public"],
    env: (config) => ({
        ...config,
        // Add environment variables for Storybook
        NODE_ENV: "development",
    }),
};

export default sharedConfig;
