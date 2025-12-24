/**
 * Router Configuration Utilities
 * @description Utilities for defining router configuration from menu items
 */

import type { PluginMenuItem } from "@buildingai/layouts/console/menu";
import { transformMenuToRoutes } from "@buildingai/layouts/console/menu";
import type { RouterConfig } from "@nuxt/schema";

/**
 * Options for defining routes configuration
 */
export interface DefineRoutesConfigOptions {
    /** Parent path for nested routes (default: "/console") */
    parentPath?: string;
}

/**
 * Define router configuration from menu items
 * @description Transform PluginMenuItem[] to RouterConfig for use in router.options.ts
 * @param menuItems - Menu configuration array
 * @param options - Configuration options
 * @returns RouterConfig object ready to export from router.options.ts
 *
 * @example
 * ```ts
 * // router.options.ts
 * import { defineRoutesConfig } from "@buildingai/nuxt";
 *
 * export const consoleMenu = [
 *   { name: "Dashboard", path: "/", component: () => import("~/pages/console/index.vue") },
 *   { name: "Articles", path: "articles", children: [...] },
 * ];
 *
 * export default defineRoutesConfig(consoleMenu);
 * ```
 *
 * @example
 * ```ts
 * // With custom parent path
 * export default defineRoutesConfig(consoleMenu, { parentPath: "/custom" });
 * ```
 */
export function defineRoutesConfig(
    menuItems: PluginMenuItem[],
    options: DefineRoutesConfigOptions = {},
): RouterConfig {
    const { parentPath = "/console" } = options;

    return {
        routes: (_routes) => {
            // Transform menu to routes
            const customRoutes = transformMenuToRoutes(menuItems, parentPath);

            return [..._routes, ...customRoutes];
        },
    };
}
