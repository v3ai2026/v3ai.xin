import type { RouteLocationRaw } from "vue-router";

/**
 * Smart navigation composable
 *
 * Automatically determines whether to use Vue Router or location.href based on the app context:
 * - Main app (baseURL === "/"): Uses Vue Router for SPA navigation
 * - Plugin app (baseURL !== "/"): Uses location.href for full page reload
 *
 * @returns Navigation functions
 *
 * @example
 * ```ts
 * const { smartNavigate } = useSmartNavigate();
 *
 * // Navigate to a path
 * smartNavigate('/about');
 *
 * // Navigate with route object
 * smartNavigate({ path: '/users', query: { id: 1 } });
 * ```
 */
/**
 * Check if a path is an extension path (starts with /extensions)
 * @param path - Path to check
 * @returns true if path is an extension path
 */
function isExtensionPath(path: string): boolean {
    return path.startsWith("/extensions");
}

/**
 * Check if a path should use location navigation instead of router navigation
 * @param path - Path to check
 * @param isPlugin - Whether current app is a plugin
 * @param forceLocation - Whether to force location navigation
 * @returns true if should use location navigation
 */
function shouldUseLocationNavigation(
    path: string,
    isPlugin: boolean,
    forceLocation = false,
): boolean {
    return isPlugin || forceLocation || isExtensionPath(path);
}

export function useSmartNavigate() {
    const config = useRuntimeConfig();
    const router = useRouter();

    // Check if current app is a plugin
    const isPlugin = config.public.isPlugin as boolean;
    const baseURL = (config.public.appBaseURL as string) || "/";

    /**
     * Convert route location to string path
     * @param to - Route location
     * @returns String path
     */
    const resolvePath = (to: string | RouteLocationRaw): string => {
        if (typeof to === "string") {
            return to;
        }
        const resolved = router.resolve(to);
        return resolved.href;
    };

    /**
     * Clean path by removing baseURL prefix if exists
     * @param path - Path to clean
     * @returns Cleaned path
     */
    const cleanPath = (path: string): string => {
        return path.startsWith(baseURL) ? path : path.replace(new RegExp(`^${baseURL}`), "");
    };

    /**
     * Smart navigate function
     *
     * @param to - Route location (string path or RouteLocationRaw object)
     * @param options - Navigation options
     * @returns void
     */
    const smartNavigate = (
        to: string | RouteLocationRaw,
        options?: {
            /** Open in new tab */
            newTab?: boolean;
            /** Force use location.href even in main app */
            forceLocation?: boolean;
        },
    ) => {
        const { newTab = false, forceLocation = false } = options || {};
        const targetPath = resolvePath(to);

        // Handle external URLs
        if (targetPath.startsWith("http://") || targetPath.startsWith("https://")) {
            if (newTab) {
                window.open(targetPath, "_blank", "noopener,noreferrer");
            } else {
                window.location.href = targetPath;
            }
            return;
        }

        // Open in new tab
        if (newTab) {
            const fullPath = shouldUseLocationNavigation(targetPath, isPlugin, forceLocation)
                ? targetPath
                : isPlugin
                  ? `${baseURL}${targetPath}`.replace(/\/+/g, "/")
                  : targetPath;
            window.open(fullPath, "_blank", "noopener,noreferrer");
            return;
        }

        // Determine navigation method
        if (shouldUseLocationNavigation(targetPath, isPlugin, forceLocation)) {
            window.location.href = cleanPath(targetPath);
        } else {
            // Main app: Use Vue Router
            navigateTo(to);
        }
    };

    /**
     * Smart replace function (similar to router.replace)
     *
     * @param to - Route location
     * @returns void
     */
    const smartReplace = (to: string | RouteLocationRaw) => {
        const targetPath = resolvePath(to);

        if (shouldUseLocationNavigation(targetPath, isPlugin)) {
            window.location.replace(targetPath);
        } else {
            navigateTo(to, { replace: true });
        }
    };

    /**
     * Convert path to absolute URL if needed
     * Used for converting paths to full URLs for proper navigation in plugin mode or extension paths
     * @param path - Path to convert
     * @returns Absolute URL or original path
     */
    const toAbsolutePath = (path: string): string => {
        // External URLs: return as-is
        if (path.startsWith("http://") || path.startsWith("https://")) {
            return path;
        }

        // Convert to absolute URL if in plugin mode or is extension path
        if (shouldUseLocationNavigation(path, isPlugin)) {
            const cleaned = cleanPath(path);
            const absolutePath = cleaned.startsWith("/") ? cleaned : `/${cleaned}`;
            return `${window.location.origin}${absolutePath}`;
        }

        return path;
    };

    return {
        smartNavigate,
        smartReplace,
        toAbsolutePath,
        isPlugin,
        baseURL,
        isExtensionPath,
    };
}
