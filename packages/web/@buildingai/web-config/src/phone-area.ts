/**
 * 手机号区号配置
 * 使用 libphonenumber-js 进行专业的手机号验证
 */

import type { CountryCode } from "libphonenumber-js";
import { getCountryCallingCode, isValidPhoneNumber } from "libphonenumber-js";

export interface PhoneAreaCode {
    /** 国家/地区代码 */
    code: CountryCode;
    /** 区号 */
    areaCode: string;
    /** 国旗 emoji */
    flag: string;
    /** 国际化键名 */
    i18nKey: string;
}

/**
 * 支持的国家/地区列表
 */
export const PHONE_AREA_CODES: PhoneAreaCode[] = [
    {
        code: "CN",
        areaCode: getCountryCallingCode("CN"),
        flag: "🇨🇳",
        i18nKey: "console-common.phoneAreaCodes.china",
    },
    {
        code: "TW",
        areaCode: getCountryCallingCode("TW"),
        flag: "🇨🇳",
        i18nKey: "console-common.phoneAreaCodes.taiwan",
    },
    {
        code: "HK",
        areaCode: getCountryCallingCode("HK"),
        flag: "🇭🇰",
        i18nKey: "console-common.phoneAreaCodes.hongkong",
    },
    {
        code: "MO",
        areaCode: getCountryCallingCode("MO"),
        flag: "🇲🇴",
        i18nKey: "console-common.phoneAreaCodes.macau",
    },
    {
        code: "US",
        areaCode: getCountryCallingCode("US"),
        flag: "🇺🇸",
        i18nKey: "console-common.phoneAreaCodes.usa",
    },
    {
        code: "JP",
        areaCode: getCountryCallingCode("JP"),
        flag: "🇯🇵",
        i18nKey: "console-common.phoneAreaCodes.japan",
    },
    {
        code: "GB",
        areaCode: getCountryCallingCode("GB"),
        flag: "🇬🇧",
        i18nKey: "console-common.phoneAreaCodes.uk",
    },
    {
        code: "DE",
        areaCode: getCountryCallingCode("DE"),
        flag: "🇩🇪",
        i18nKey: "console-common.phoneAreaCodes.germany",
    },
    {
        code: "FR",
        areaCode: getCountryCallingCode("FR"),
        flag: "🇫🇷",
        i18nKey: "console-common.phoneAreaCodes.france",
    },
    {
        code: "KR",
        areaCode: getCountryCallingCode("KR"),
        flag: "🇰🇷",
        i18nKey: "console-common.phoneAreaCodes.korea",
    },
    {
        code: "AU",
        areaCode: getCountryCallingCode("AU"),
        flag: "🇦🇺",
        i18nKey: "console-common.phoneAreaCodes.australia",
    },
    {
        code: "SG",
        areaCode: getCountryCallingCode("SG"),
        flag: "🇸🇬",
        i18nKey: "console-common.phoneAreaCodes.singapore",
    },
];

/**
 * 验证手机号格式（使用 libphonenumber-js）
 */
export function validatePhoneNumber(phone: string, countryCode: CountryCode): boolean {
    try {
        if (!phone) return true; // 可选字段
        return isValidPhoneNumber(phone, countryCode);
    } catch {
        return false;
    }
}

/**
 * 获取浏览器推测的国家代码
 */
export function getGuessedCountryCode(): CountryCode {
    if (import.meta.client) {
        const lang = navigator.language || "en-US";
        const locale = new Intl.Locale(lang);
        const region = locale.region;

        if (region && /^[A-Z]{2}$/.test(region)) {
            return region as CountryCode;
        }
    }
    return "CN";
}

/**
 * 获取默认区号（简化版）
 */
export function getDefaultAreaCode(): string {
    const countryCode = getGuessedCountryCode();
    return getCountryCallingCode(countryCode);
}
