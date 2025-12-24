/**
 * BuildingAI Shared Internationalization
 * @description Shared i18n for layouts, login, and other common components
 */

import enCommon from "./en/common.json";
import enLayouts from "./en/layouts.json";
import enLogin from "./en/login.json";
import jpCommon from "./jp/common.json";
import jpLayouts from "./jp/layouts.json";
import jpLogin from "./jp/login.json";
import zhCommon from "./zh/common.json";
import zhLayouts from "./zh/layouts.json";
import zhLogin from "./zh/login.json";

/**
 * All available shared locale translations
 */
export const sharedMessages = {
    en: {
        common: enCommon,
        layouts: enLayouts,
        login: enLogin,
    },
    zh: {
        common: zhCommon,
        layouts: zhLayouts,
        login: zhLogin,
    },
    jp: {
        common: jpCommon,
        layouts: jpLayouts,
        login: jpLogin,
    },
} as const;

/**
 * Get shared messages for a specific locale
 * @param locale - The locale code (e.g., "en", "zh", "jp")
 * @returns The shared translations object for the specified locale, or undefined if not found
 */
export function getSharedMessagesForLocale(locale: string): Record<string, unknown> | undefined {
    return sharedMessages[locale as keyof typeof sharedMessages];
}

export default sharedMessages;
