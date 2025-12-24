<script setup lang="ts">
import { STORAGE_KEYS } from "@buildingai/constants/web/storage.constant";
import { type LanguageCode, languageOptions } from "@buildingai/i18n-config";
import type { ChatWindowStyle } from "@buildingai/service/models/globals";
import {
    colorList,
    colorListMap,
    getColor,
    neutralColorList,
    neutralColorMap,
} from "@buildingai/web-config/theme";
import { useColorMode } from "@vueuse/core";

const { store } = useColorMode();
const appConfig = useAppConfig();
const { t, locale, setLocale } = useI18n();

// Theme mode options
const themeModeOptions: Array<{
    label: string;
    value: "light" | "dark" | "auto";
    icon: string;
    image: string;
}> = [
    {
        label: "common.theme.light",
        value: "light",
        icon: "i-lucide-sun",
        image: "/assets/images/theme_light.webp",
    },
    {
        label: "common.theme.dark",
        value: "dark",
        icon: "i-lucide-moon",
        image: "/assets/images/theme_dark.webp",
    },
    {
        label: "common.theme.system",
        value: "auto",
        icon: "i-heroicons-computer-desktop-20-solid",
        image: "/assets/images/theme_auto.webp",
    },
];

const languageCookie = useCookie<LanguageCode>("nuxt-ui-language");

const userTimeZoneCookie = useCookie<string>(STORAGE_KEYS.USER_TIMEZONE, {
    default: () => Intl.DateTimeFormat().resolvedOptions().timeZone,
});

// Common time zone options
const timeZoneOptions = computed(() => [
    { label: "UTC 协调世界时", value: "UTC" },
    // 亚洲时区
    { label: "北京时间 Beijing (GMT+8)", value: "Asia/Shanghai" },
    { label: "Hong Kong 香港 (GMT+8)", value: "Asia/Hong_Kong" },
    { label: "台北 Taipei (GMT+8)", value: "Asia/Taipei" },
    { label: "東京 Tokyo (GMT+9)", value: "Asia/Tokyo" },
    { label: "서울 Seoul (GMT+9)", value: "Asia/Seoul" },
    { label: "Singapore 新加坡 (GMT+8)", value: "Asia/Singapore" },
    { label: "Bangkok กรุงเทพ (GMT+7)", value: "Asia/Bangkok" },
    { label: "Jakarta (GMT+7)", value: "Asia/Jakarta" },
    { label: "Manila (GMT+8)", value: "Asia/Manila" },
    { label: "Mumbai मुंबई (GMT+5:30)", value: "Asia/Kolkata" },
    { label: "Dubai دبي (GMT+4)", value: "Asia/Dubai" },
    // European time zone
    { label: "Москва Moscow (GMT+3)", value: "Europe/Moscow" },
    { label: "London (GMT+0/+1)", value: "Europe/London" },
    { label: "Paris パリ (GMT+1/+2)", value: "Europe/Paris" },
    { label: "Berlin ベルリン (GMT+1/+2)", value: "Europe/Berlin" },
    { label: "Roma Rome (GMT+1/+2)", value: "Europe/Rome" },
    { label: "Madrid (GMT+1/+2)", value: "Europe/Madrid" },
    { label: "Amsterdam (GMT+1/+2)", value: "Europe/Amsterdam" },
    { label: "Stockholm (GMT+1/+2)", value: "Europe/Stockholm" },
    // American time zone
    { label: "New York ニューヨーク (GMT-5/-4)", value: "America/New_York" },
    { label: "Los Angeles ロサンゼルス (GMT-8/-7)", value: "America/Los_Angeles" },
    { label: "Chicago シカゴ (GMT-6/-5)", value: "America/Chicago" },
    { label: "Denver (GMT-7/-6)", value: "America/Denver" },
    { label: "Toronto (GMT-5/-4)", value: "America/Toronto" },
    { label: "México Ciudad de México (GMT-6/-5)", value: "America/Mexico_City" },
    { label: "São Paulo サンパウロ (GMT-3)", value: "America/Sao_Paulo" },
    { label: "Buenos Aires (GMT-3)", value: "America/Argentina/Buenos_Aires" },
    // Oceania time zone
    { label: "Sydney シドニー (GMT+10/+11)", value: "Australia/Sydney" },
    { label: "Melbourne メルボルン (GMT+10/+11)", value: "Australia/Melbourne" },
    { label: "Auckland (GMT+12/+13)", value: "Pacific/Auckland" },
    // African time zone
    { label: "Cairo القاهرة (GMT+2)", value: "Africa/Cairo" },
    { label: "Cape Town (GMT+2)", value: "Africa/Johannesburg" },
]);

const userTimeZone = computed({
    get: () => userTimeZoneCookie.value,
    set: (value: string) => {
        userTimeZoneCookie.value = value;
    },
});

/**
 * Handle language switch
 * @param code language code
 */
const handleLanguage = () => {
    const code = locale.value as LanguageCode;
    setLocale(code);
    languageCookie.value = code;
};

// ============ Primary color configuration ============
/**
 * Set primary color
 * @param color color
 */
const handlePrimaryColor = (color: (typeof colorList)[number]) => {
    const primaryCookie = useCookie<string>(STORAGE_KEYS.NUXT_UI_PRIMARY);
    const blackAsPrimary = useCookie<boolean>(STORAGE_KEYS.NUXT_UI_BLACK_AS_PRIMARY);

    primaryCookie.value = color;
    appConfig.ui.colors.primary = color;

    if (color === "black") {
        appConfig.theme.blackAsPrimary = true;
        blackAsPrimary.value = true;
    } else {
        appConfig.theme.blackAsPrimary = false;
        blackAsPrimary.value = false;
    }
};

/**
 * Set neutral color
 * @param color color
 */
const handleNeutralColor = (color: (typeof neutralColorList)[number]) => {
    const neutralCookie = useCookie<string>(STORAGE_KEYS.NUXT_UI_NEUTRAL);
    neutralCookie.value = color;
    appConfig.ui.colors.neutral = color;
};

// ============ Radius configuration ============
const radiusLabels = computed(() => [
    t("common.settings.radiusOptions.none"),
    t("common.settings.radiusOptions.xsmall"),
    t("common.settings.radiusOptions.small"),
    t("common.settings.radiusOptions.medium"),
    t("common.settings.radiusOptions.large"),
]);
const radiusValues = [0, 0.125, 0.25, 0.375, 0.5] as const;
const radiusMap = computed(() =>
    Object.fromEntries(radiusLabels.value.map((l, idx) => [l, radiusValues[idx]])),
);

const radius = computed({
    get: () => {
        const label = radiusLabels.value.find((l) => radiusMap.value[l] === appConfig.theme.radius);
        return label ?? appConfig.theme.radius;
    },
    set: (option: string | number) => {
        let value: number;
        if (typeof option === "string" && option in radiusMap.value)
            value = radiusMap.value[option] as number;
        else value = Number(option);
        if (Number.isNaN(value)) value = 0;
        appConfig.theme.radius = value;
        const radiusCookie = useCookie<string>(STORAGE_KEYS.NUXT_UI_RADIUS);
        radiusCookie.value = String(value);
    },
});

function handleRadiusSelect(index: number) {
    radius.value = radiusLabels.value[index] as string;
}

// ============ Chat window style ============
/** Chat window style options */
const chatWindowStyleOptions: Array<{
    label: string;
    value: ChatWindowStyle;
    icon: string;
    image: string;
}> = [
    {
        label: "common.settings.chat.conversationMode",
        value: "conversation",
        icon: "i-lucide-message-square-text",
        image: "/assets/images/chatmode_chat.webp",
    },
    {
        label: "common.settings.chat.documentMode",
        value: "document",
        icon: "i-lucide-file-text",
        image: "/assets/images/chatmode_docs.webp",
    },
];

/** Chat window style Cookie */
const chatWindowStyleCookie = useCookie<ChatWindowStyle>(STORAGE_KEYS.CHAT_WINDOW_STYLE, {
    default: () => "conversation",
});

/** Chat window style responsive state */
const chatWindowStyle = computed<ChatWindowStyle>({
    get: () => chatWindowStyleCookie.value || "conversation",
    set: (val: ChatWindowStyle) => {
        chatWindowStyleCookie.value = val;
    },
});

// Code highlight theme可选值（Shiki 内置）
const highlightThemeOptions: Array<{ label: string; value: string }> = [
    { label: "Snazzy Light", value: "snazzy-light" },
    { label: "GitHub Light", value: "github-light" },
    { label: "GitHub Dark", value: "github-dark" },
    { label: "Tokyo Night", value: "tokyo-night" },
    { label: "One Dark Pro", value: "one-dark-pro" },
    { label: "Dracula Soft", value: "dracula-soft" },
    { label: "Monokai", value: "monokai" },
    { label: "Material Palenight", value: "material-theme-palenight" },
    { label: "Vitesse Light", value: "vitesse-light" },
    { label: "Vitesse Dark", value: "vitesse-dark" },
    { label: "Nord", value: "nord" },
    { label: "Light Plus", value: "light-plus" },
    { label: "Dark Plus", value: "dark-plus" },
    { label: "Night Owl", value: "night-owl" },
    { label: "Ayu Light", value: "ayu-light" },
    { label: "Ayu Mirage", value: "ayu-mirage" },
    { label: "Poimandres", value: "poimandres" },
    { label: "Rose Pine", value: "rose-pine" },
    { label: "Rose Pine Dawn", value: "rose-pine-dawn" },
    { label: "Min Light", value: "min-light" },
    { label: "Min Dark", value: "min-dark" },
    { label: "Solarized Light", value: "solarized-light" },
    { label: "Solarized Dark", value: "solarized-dark" },
    { label: "Github Dark Dimmed", value: "github-dark-dimmed" },
    { label: "Material Theme", value: "material-theme" },
    { label: "Material Darker", value: "material-theme-darker" },
    { label: "Noctis Lilac", value: "noctis-lilac" },
    { label: "Slack Dark", value: "slack-dark" },
    { label: "Slack Ochin", value: "slack-ochin" },
];

// Mermaid theme可选值
const mermaidThemeOptions: Array<{
    label: string;
    value: "default" | "base" | "dark" | "forest" | "neutral";
}> = [
    { label: "Mermaid Default", value: "default" },
    { label: "Mermaid Base", value: "base" },
    { label: "Mermaid Dark", value: "dark" },
    { label: "Mermaid Forest", value: "forest" },
    { label: "Mermaid Neutral", value: "neutral" },
];

// Code highlight theme Cookie
const highlightThemeCookie = useCookie<string>(STORAGE_KEYS.CODE_HIGHLIGHT_THEME, {
    default: () => "snazzy-light",
});
const highlightTheme = computed({
    get: () => highlightThemeCookie.value,
    set: async (val: string) => {
        highlightThemeCookie.value = val;
    },
});

// Mermaid theme Cookie
type MermaidTheme = "default" | "dark" | "forest" | "neutral";
const mermaidThemeCookie = useCookie<MermaidTheme>(STORAGE_KEYS.MERMAID_THEME, {
    default: () => "default",
});
const mermaidTheme = computed<MermaidTheme>({
    get: () => mermaidThemeCookie.value,
    set: async (val: MermaidTheme) => {
        mermaidThemeCookie.value = val;
    },
});

// ============ Example preview ============
const sampleCode = `\n\`\`\`typescript\nfunction greet(name: string) {\n  return 'Hello, ' + name;\n}\n\`\`\``;

const sampleMermaid = `
\`\`\`mermaid
sequenceDiagram
    Alice->>John: 👋 Hello!
    John-->>Alice: 😄 I'm great!
    Alice->>Bob: 🕓 Are you free later?
    Bob-->>Alice: 👍 Sure!
    Alice-)John: 👋 See you!
    John-)Bob: 🕕 Meet at 6?
\`\`\`
`;

const codePreviewRef = useTemplateRef("codePreviewRef");
const mermaidPreviewRef = useTemplateRef("mermaidPreviewRef");

definePageMeta({
    title: "menu.general",
    inSystem: true,
    inLinkSelector: true,
});
</script>

<template>
    <div class="flex flex-col px-8">
        <div class="mb-8 flex flex-col gap-10">
            <!-- Theme -->
            <div class="flex items-stretch justify-between">
                <div class="text-accent-foreground flex-none text-base">
                    {{ t("common.settings.theme") }}
                </div>
                <div class="flex items-center gap-4">
                    <template v-for="option in themeModeOptions" :key="option.value">
                        <div
                            class="flex cursor-pointer flex-col items-center gap-2"
                            @click="store = option.value"
                        >
                            <img
                                :src="option.image"
                                alt="theme-icon"
                                class="h-16 w-25 rounded-md border-2 border-transparent"
                                :class="{ 'border-primary!': option.value === store }"
                            />
                            <div
                                class="flex items-center gap-1"
                                :class="{ 'text-primary font-medium': option.value === store }"
                            >
                                <UIcon :name="option.icon" class="text-xs" />
                                <span class="text-xs">{{ t(option.label) }}</span>
                            </div>
                        </div>
                    </template>
                </div>
            </div>

            <!-- Language -->
            <div class="flex items-stretch justify-between">
                <div class="text-accent-foreground flex-none text-base">
                    {{ t("common.settings.language") }}
                </div>
                <div class="flex items-center">
                    <USelect
                        v-model="locale"
                        :items="languageOptions"
                        label-key="name"
                        value-key="code"
                        class="w-60"
                        :placeholder="t('common.settings.languagePlaceholder')"
                        @change="handleLanguage"
                    />
                </div>
            </div>

            <!-- Timezone -->
            <div class="flex flex-col gap-4">
                <div class="flex items-stretch justify-between">
                    <div class="text-accent-foreground flex-none text-base">
                        {{ t("common.settings.timezone") }}
                    </div>
                    <div class="flex items-center">
                        <USelect
                            v-model="userTimeZone"
                            :items="timeZoneOptions"
                            label-key="label"
                            value-key="value"
                            class="w-60"
                            :placeholder="t('common.settings.timezonePlaceholder')"
                        />
                    </div>
                </div>

                <!-- Current timezone time display -->
                <div class="bg-muted/50 flex items-center justify-between rounded-lg p-4">
                    <div class="flex flex-col">
                        <div class="text-md font-medium">
                            {{
                                timeZoneOptions.find((option) => option.value === userTimeZone)
                                    ?.label || userTimeZone
                            }}
                        </div>
                        <div class="text-muted-foreground mt-2 text-xs">
                            {{ t("common.settings.currentTime") }}
                        </div>
                    </div>
                    <div class="flex flex-col items-end gap-1">
                        <TimeDisplay
                            :datetime="new Date()"
                            mode="time"
                            :time-zone="userTimeZone"
                            class="font-mono text-2xl font-bold"
                        />
                        <TimeDisplay
                            :datetime="new Date()"
                            mode="date"
                            :time-zone="userTimeZone"
                            show-year
                            class="text-muted-foreground text-sm"
                        />
                    </div>
                </div>
            </div>

            <!-- Color palette -->
            <div class="flex items-stretch justify-between">
                <div class="text-accent-foreground flex-none text-base">
                    {{ t("common.settings.colorPalette") }}
                </div>

                <!-- Preview skeleton -->
                <div
                    class="border-border bg-background relative h-40 w-80 max-w-xl overflow-hidden rounded-lg border shadow-sm"
                >
                    <!-- Sidebar -->
                    <div class="bg-muted absolute inset-y-0 w-16" />
                    <!-- Content area -->
                    <div class="absolute top-0 right-0 left-20 h-full p-6">
                        <div class="bg-muted mb-4 h-4 w-1/2 rounded" />
                        <div class="space-y-2">
                            <div class="bg-muted h-2 w-full rounded" />
                            <div class="bg-muted h-2 w-5/6 rounded" />
                            <div class="bg-muted h-2 w-3/4 rounded" />
                        </div>
                        <div
                            class="absolute right-3 bottom-3 h-6 w-14 rounded-md"
                            :style="{
                                backgroundColor: getColor(appConfig.ui.colors.primary as any, 500),
                            }"
                        />
                    </div>
                </div>
            </div>

            <!-- Select primary color -->
            <div class="flex items-stretch justify-between">
                <div class="text-accent-foreground flex-none text-base">
                    {{ t("common.theme.color") }}
                </div>
                <div class="flex flex-wrap gap-2">
                    <UTooltip
                        v-for="color in colorList"
                        :key="color"
                        :text="t(colorListMap[color])"
                        delay="0"
                    >
                        <div
                            class="border-border relative size-7 cursor-pointer rounded-full border shadow-sm"
                            :style="{ backgroundColor: getColor(color, 500) }"
                            @click="handlePrimaryColor(color)"
                        >
                            <UIcon
                                v-if="appConfig.ui.colors.primary === color"
                                name="i-lucide-check"
                                class="text-background absolute inset-0 m-auto size-4"
                            />
                        </div>
                    </UTooltip>
                </div>
            </div>

            <!-- Select neutral color -->
            <div class="flex items-stretch justify-between">
                <div class="text-accent-foreground flex-none text-base">
                    {{ t("common.theme.neutralLabel") }}
                </div>
                <div class="flex flex-wrap gap-2">
                    <UTooltip
                        v-for="color in neutralColorList"
                        :key="color"
                        :text="t(neutralColorMap[color])"
                        delay="0"
                    >
                        <div
                            class="border-border relative size-7 cursor-pointer rounded-full border shadow-sm"
                            :style="{ backgroundColor: getColor(color, 600) }"
                            @click="handleNeutralColor(color)"
                        >
                            <UIcon
                                v-if="appConfig.ui.colors.neutral === color"
                                name="i-lucide-check"
                                class="text-background absolute inset-0 m-auto size-4"
                            />
                        </div>
                    </UTooltip>
                </div>
            </div>

            <!-- Select radius -->
            <div class="flex items-stretch justify-between">
                <div class="text-accent-foreground flex-none text-base">
                    {{ t("common.settings.radius") }}
                </div>
                <div class="flex flex-wrap gap-2">
                    <template v-for="(label, idx) in radiusLabels" :key="label">
                        <UButton
                            :color="
                                String(radius) === label ||
                                String(radius) === String(radiusValues[idx])
                                    ? 'primary'
                                    : 'neutral'
                            "
                            variant="soft"
                            @click="handleRadiusSelect(idx)"
                        >
                            {{ label }}
                        </UButton>
                    </template>
                </div>
            </div>
        </div>

        <div class="mb-8 flex flex-col gap-10">
            <div class="text-lg font-bold">{{ t("common.settings.chat.title") }}</div>

            <div class="flex items-stretch justify-between">
                <div class="text-accent-foreground flex-none text-base">
                    {{ t("common.settings.chat.windowStyle") }}
                </div>
                <div class="flex items-center gap-4">
                    <template v-for="option in chatWindowStyleOptions" :key="option.value">
                        <div
                            class="flex cursor-pointer flex-col items-center gap-2"
                            @click="chatWindowStyle = option.value"
                        >
                            <img
                                :src="option.image"
                                alt="chat-window-style-icon"
                                class="bg-muted h-18 w-29 rounded-md border-2 border-transparent"
                                :class="{
                                    'border-primary!': option.value === chatWindowStyle,
                                }"
                            />
                            <div
                                class="flex items-center gap-1"
                                :class="{
                                    'text-primary font-medium': option.value === chatWindowStyle,
                                }"
                            >
                                <UIcon :name="option.icon" class="text-xs" />
                                <span class="text-xs">{{ t(option.label) }}</span>
                            </div>
                        </div>
                    </template>
                </div>
            </div>

            <div>
                <div class="flex items-stretch justify-between">
                    <div class="text-accent-foreground flex-none text-base">
                        {{ t("common.settings.chat.codeHighlight") }}
                    </div>
                    <div class="flex items-center gap-2">
                        <USelect
                            v-model="highlightTheme"
                            :items="highlightThemeOptions"
                            label-key="label"
                            value-key="value"
                            class="w-60"
                            :placeholder="t('common.settings.chat.codeHighlightPlaceholder')"
                        />
                    </div>
                </div>

                <!-- Preview -->
                <BdMarkdown
                    ref="codePreviewRef"
                    :content="sampleCode"
                    class="mt-4 max-h-60 w-full p-0!"
                />
            </div>

            <div>
                <div class="flex items-stretch justify-between">
                    <div class="text-accent-foreground flex-none text-base">
                        {{ t("common.settings.chat.mermaidTheme") }}
                    </div>
                    <div class="flex items-center gap-2">
                        <USelect
                            v-model="mermaidTheme"
                            :items="mermaidThemeOptions"
                            label-key="label"
                            value-key="value"
                            class="w-60"
                            :placeholder="t('common.settings.chat.mermaidThemePlaceholder')"
                        />
                    </div>
                </div>

                <!-- Mermaid preview -->
                <BdMarkdown
                    ref="mermaidPreviewRef"
                    :content="sampleMermaid"
                    class="mt-4 w-full p-0!"
                />
            </div>
        </div>
    </div>
</template>
