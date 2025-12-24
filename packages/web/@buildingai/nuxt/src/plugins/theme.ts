import { STORAGE_KEYS } from "@buildingai/constants/web";
import { useColorMode } from "@vueuse/core";

export default defineNuxtPlugin({
    enforce: "post",
    setup() {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const appConfig: Record<string, any> = useAppConfig();
        const blackAsPrimary = useCookie(STORAGE_KEYS.NUXT_UI_BLACK_AS_PRIMARY);
        const radius = useCookie(STORAGE_KEYS.NUXT_UI_RADIUS);
        const primary = useCookie(STORAGE_KEYS.NUXT_UI_PRIMARY);
        const neutral = useCookie(STORAGE_KEYS.NUXT_UI_NEUTRAL);
        const colorMode = useColorMode();

        colorMode.value = colorMode.value === "dark" ? "dark" : "light";

        if (blackAsPrimary.value) {
            appConfig.theme.blackAsPrimary = Boolean(blackAsPrimary.value);
        }

        if (primary.value) {
            appConfig.ui.colors.primary = primary.value;
        }

        if (neutral.value) {
            appConfig.ui.colors.neutral = neutral.value;
        }

        if (radius.value) {
            appConfig.theme.radius = Number.parseFloat(radius.value);
        }
    },
});
