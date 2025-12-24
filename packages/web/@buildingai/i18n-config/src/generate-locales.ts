/**
 * @fileoverview Internationalization locale generation utilities
 * @description Functions for generating and loading translation modules for different locales
 *
 * @author BuildingAI Teams
 */

// Import shared i18n module
import { sharedMessages } from "./i18n";

/**
 * Get shared translations for a specific locale
 * @description Returns all shared translations including layouts, login, etc.
 */
function getSharedMessages(locale: string): Record<string, unknown> {
    const messages = sharedMessages[locale as keyof typeof sharedMessages];
    return messages || {};
}

/**
 * Get translation modules using Vite's glob import
 * @description Dynamically imports all JSON translation files from the i18n directory
 * @returns Object containing module loaders for translation files
 */
export function getTranslationModules() {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return (import.meta as any).glob([`/i18n/*/*.json`], {
        eager: false,
    });
}

/**
 * Extract locale from file path
 * @description Extracts the locale identifier from a translation file path
 * @param path File path (e.g., "/i18n/en/common.json")
 * @returns Locale identifier (e.g., "en") or "unknown" if not found
 */
function extractLocale(path: string): string {
    const match = path.match(/\/i18n\/([^/]+)\/[^/]+\.json$/);
    return match?.[1] ?? "unknown";
}

/**
 * Extract namespace from file path
 * @description Extracts the namespace identifier from a translation file path
 * @param path File path (e.g., "/i18n/en/common.json")
 * @returns Namespace identifier (e.g., "common") or "unknown" if not found
 */
function extractNamespace(path: string): string {
    const match = path.match(/\/i18n\/[^/]+\/([^/]+)\.json$/);
    return match?.[1] ?? "unknown";
}

/**
 * Generate application messages for a specific locale
 * @description Loads and combines all translation modules for the specified locale
 * @param locale Target locale identifier (e.g., "en", "zh-CN")
 * @returns Promise resolving to a record of namespace-to-messages mapping
 */
export async function generateAppMessagesForLocale(
    locale: string,
): Promise<Record<string, unknown>> {
    const messages: Record<string, unknown> = {};
    const modules = getTranslationModules();

    for (const path in modules) {
        const moduleLocale = extractLocale(path);
        const namespace = extractNamespace(path);

        if (moduleLocale !== locale) continue;
        if (moduleLocale === "unknown" || namespace === "unknown") {
            console.warn(`[i18n] Skipping invalid module path: ${path}`);
            continue;
        }

        try {
            const loader = modules[path] as () => Promise<{
                default?: unknown;
                [key: string]: unknown;
            }>;
            const mod = await loader();
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const moduleContent = (mod as any).default ?? mod;
            messages[namespace] = moduleContent;
        } catch (error) {
            console.warn(`[i18n] Failed to load module ${path}:`, error);
        }
    }

    // Merge shared translations (layouts, login, etc.)
    const sharedData = getSharedMessages(locale);
    Object.assign(messages, sharedData);

    return messages;
}
