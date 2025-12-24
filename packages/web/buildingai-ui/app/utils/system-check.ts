/**
 * System initialization check utility
 * @description Used to check if the system is initialized and handle route redirection logic
 */

import { apiGetSystemInfo } from "@buildingai/service/consoleapi/system";
import type { RouteLocationNormalized } from "vue-router";

/**
 * Check if system is initialized
 * @description Returns the install page path if system is not initialized and user is not on install page.
 * If system is already initialized and user tries to access install page, redirect to home.
 * @param to Target route
 * @returns Redirect path if needed, null otherwise
 */
export async function checkSystemInitialization(
    to: RouteLocationNormalized,
): Promise<string | null> {
    // Normalize path by removing trailing slash for comparison
    const normalizedPath = to.path.replace(/\/$/, "") || "/";
    const isInstallPage = normalizedPath === "/install";

    try {
        const systemInfo = await apiGetSystemInfo();

        // If system is already initialized and user is trying to access install page, redirect to home
        if (systemInfo.isInitialized && isInstallPage) {
            return "/";
        }

        // If system is not initialized and user is not on install page, redirect to install page
        if (!systemInfo.isInitialized && !isInstallPage) {
            return "/install";
        }
    } catch (error) {
        // If API call fails, it might be because system is not initialized or network issue
        console.error("Failed to check system initialization:", error);

        throw createError({
            statusCode: 404,
            statusMessage: "System not Connected",
            fatal: true,
        });
    }

    return null;
}
