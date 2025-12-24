/**
 * @fileoverview Language configuration and utilities
 * @description Defines supported languages, mappings, and utility functions for internationalization
 *
 * @author BuildingAI Teams
 */

/**
 * Language option interface
 * @description Configuration for a supported language
 */
interface LanguageOption {
    /** Language identifier code */
    code: LanguageCode;
    /** Display name of the language */
    name: string;
    /** Optional flag emoji icon */
    // icon?: string;
    /** Language code used by translation APIs */
    translationCode: string;
}

/**
 * Nuxt UI language code mapping
 * @description Maps internal language codes to Nuxt UI supported codes
 */
export const uiI18nMap: Record<string, string> = {
    zh: "zh-cn",
    en: "en",
    jp: "jp",
} as const;

/**
 * Browser language code mapping
 * @description Maps browser language codes to internal language codes
 */
export const navigatorMap: Record<string, string> = {
    "zh-cn": "zh",
    "zh-tw": "zh",
    "ja-jp": "jp",
    en: "en",
    "en-us": "en",
    "en-gb": "en",
} as const;

/**
 * Supported language constants
 * @description Enum-like object containing all supported language codes
 */
export const Language = {
    /** Chinese (Simplified) */
    ZH: "zh",
    /** English */
    EN: "en",
    /** Japanese */
    JP: "jp",
} as const;

/** Language code type */
export type LanguageCode = (typeof Language)[keyof typeof Language];

/**
 * Available language options list
 * @description Array of supported language configurations with display information
 */
export const languageOptions: LanguageOption[] = [
    {
        code: Language.ZH,
        name: "简体中文",
        // icon: "🇨🇳",
        translationCode: "zh",
    },
    {
        code: Language.EN,
        name: "English",
        // icon: "🇺🇸",
        translationCode: "en",
    },
    {
        code: Language.JP,
        name: "日本語",
        // icon: "🇯🇵",
        translationCode: "ja",
    },
];

/**
 * Get translation code for a language
 * @description Retrieves the API-compatible language code for translation services
 * @param lang Language code
 * @returns Translation API compatible language code
 */
export function getTranslationCode(lang: LanguageCode): string {
    const option = languageOptions.find((opt) => opt.code === lang);
    return option ? option.translationCode : lang;
}

/**
 * Get display name for a language
 * @description Retrieves the human-readable name for a language code
 * @param lang Language code
 * @returns Display name of the language
 */
export function getTranslationName(lang: LanguageCode): string {
    const option = languageOptions.find((opt) => opt.code === lang);
    return option ? option.name : lang;
}

/**
 * Get default language based on browser/system settings
 * @description Determines the default language by checking browser language settings
 * Falls back to Chinese if the browser language is not supported
 * @returns Default language code
 */
export function getDefaultLanguage(): string {
    // Check if running in browser environment
    if (typeof window !== "undefined" && window.navigator) {
        try {
            // Get browser language
            const browserLang = navigator.language.toLowerCase();
            // Check if the language is supported
            return navigatorMap[browserLang] || Language.ZH;
        } catch (error) {
            console.warn("Failed to get browser language settings, using default language", error);
        }
    }

    // Default fallback to Chinese
    return Language.ZH;
}

/**
 * Check if a language code is supported
 * @description Validates whether a given language code is in the supported languages list
 * @param lang Language code to check
 * @returns True if the language is supported, false otherwise
 */
export function isLanguageSupported(lang: string): lang is LanguageCode {
    return Object.values(Language).includes(lang as LanguageCode);
}

/**
 * Get language option by code
 * @description Retrieves the complete language option configuration for a given code
 * @param lang Language code
 * @returns Language option object or undefined if not found
 */
export function getLanguageOption(lang: LanguageCode): LanguageOption | undefined {
    return languageOptions.find((option) => option.code === lang);
}

/**
 * Get all supported language codes
 * @description Returns an array of all supported language codes
 * @returns Array of supported language codes
 */
export function getSupportedLanguageCodes(): LanguageCode[] {
    return Object.values(Language);
}

/**
 * Get Nuxt UI language code
 * @description Maps internal language code to Nuxt UI compatible code
 * @param lang Internal language code
 * @returns Nuxt UI compatible language code
 */
export function getNuxtUILanguageCode(lang: LanguageCode): string {
    return uiI18nMap[lang] || lang;
}
