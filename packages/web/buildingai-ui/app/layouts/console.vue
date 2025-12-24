<script setup lang="ts">
import { STORAGE_KEYS } from "@buildingai/constants/web";
import { MixtureLayout, SearchModal, SidebarLayout } from "@buildingai/layouts/console";
import { useMediaQuery } from "@vueuse/core";

const controls = useControlsStore();
const isMobile = useMediaQuery("(max-width: 768px)");

const autoSwitchLayoutForMobile = (isMobile: boolean) => {
    if (isMobile && controls.consoleLayoutMode !== "side") {
        controls.consoleTempLayoutMode = controls.consoleLayoutMode;
        controls.consoleLayoutMode = "side";
        useCookie(STORAGE_KEYS.LAYOUT_MODE).value = "side";
    } else if (!isMobile && controls.consoleTempLayoutMode) {
        const originalMode = controls.consoleTempLayoutMode;
        controls.consoleLayoutMode = originalMode;
        useCookie(STORAGE_KEYS.LAYOUT_MODE).value = originalMode;
        controls.consoleTempLayoutMode = "";
    }
};

watch(isMobile, autoSwitchLayoutForMobile, { immediate: true });
</script>

<template>
    <main>
        <SidebarLayout v-if="controls.consoleLayoutMode === 'side'" />
        <MixtureLayout v-else-if="controls.consoleLayoutMode === 'mixture'" />

        <SearchModal />
    </main>
</template>
