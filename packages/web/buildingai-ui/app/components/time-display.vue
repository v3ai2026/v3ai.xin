<script setup lang="ts">
/**
 * Unified time display component
 * Based on NuxtTime component, provides commonly used time display formats in the project
 */

import { STORAGE_KEYS } from "@buildingai/constants/web";
import { useI18n } from "vue-i18n";

type TimeDisplayMode = "relative" | "datetime" | "date" | "time" | "short" | "long" | "year";

interface TimeDisplayProps {
    /** Date time value */
    datetime: Date | number | string;
    /** Display mode */
    mode?: TimeDisplayMode;
    /** Custom locale setting */
    locale?: string;
    /** Custom timezone (takes priority over global timezone setting) */
    timeZone?: string;
    /** Whether to show year (only effective in date and datetime modes) */
    showYear?: boolean;
    /** Custom class name */
    class?: string;
}

const props = withDefaults(defineProps<TimeDisplayProps>(), {
    mode: "relative",
    locale: undefined,
    showYear: true,
});

// Get current language setting as default locale
const { locale: currentLocale } = useI18n();

// Global timezone setting Cookie
const globalTimeZoneCookie = useCookie<string>(STORAGE_KEYS.USER_TIMEZONE, {
    default: () => Intl.DateTimeFormat().resolvedOptions().timeZone, // Default to system timezone
});

// Time format configuration mapping table
const TIME_FORMAT_CONFIGS: Record<
    TimeDisplayMode,
    | Intl.RelativeTimeFormatOptions
    | ((showYear: boolean, timeZone?: string) => Intl.DateTimeFormatOptions)
> = {
    relative: {
        numeric: "auto",
        style: "long",
    } as Intl.RelativeTimeFormatOptions,
    datetime: (showYear: boolean, timeZone?: string) => ({
        year: showYear ? "numeric" : undefined,
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
        timeZone,
    }),
    date: (showYear: boolean, timeZone?: string) => ({
        year: showYear ? "numeric" : undefined,
        month: "short",
        day: "numeric",
        timeZone,
    }),
    time: (showYear: boolean, timeZone?: string) => ({
        hour: "2-digit",
        minute: "2-digit",
        timeZone,
    }),
    short: (showYear: boolean, timeZone?: string) => ({
        month: "numeric",
        day: "numeric",
        timeZone,
    }),
    long: (showYear: boolean, timeZone?: string) => ({
        year: "numeric",
        month: "long",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
        weekday: "long",
        timeZone,
    }),
    year: (showYear: boolean, timeZone?: string) => ({
        year: "numeric",
        timeZone,
    }),
};

/**
 * Generate NuxtTime component properties
 */
const timeProps = computed(() => {
    // Force English locale for year mode to avoid "year" suffix, only display numeric year
    const effectiveLocale = props.mode === "year" ? "en" : props.locale || currentLocale.value;

    const baseProps = {
        datetime: props.datetime,
        locale: effectiveLocale,
    };

    // Determine timezone to use: prop timezone > global timezone setting > system default
    const effectiveTimeZone = props.timeZone || globalTimeZoneCookie.value;

    const formatConfig = TIME_FORMAT_CONFIGS[props.mode];

    // Handle function-type configuration (supports showYear and timeZone parameters)
    const config =
        typeof formatConfig === "function"
            ? formatConfig(props.showYear, effectiveTimeZone)
            : { ...formatConfig, timeZone: effectiveTimeZone };

    return { ...baseProps, ...config };
});
</script>

<template>
    <NuxtTime v-bind="timeProps" :class="props.class" />
</template>
