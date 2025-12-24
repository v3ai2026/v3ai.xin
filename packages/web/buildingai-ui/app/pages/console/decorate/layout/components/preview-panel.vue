<script setup lang="ts">
import { Style1, Style2, Style3, Style4, Style5 } from "@buildingai/layouts/web";
import { markRaw } from "vue";

import { useLayoutStore } from "../stores/layout";

const layoutStore = useLayoutStore();

const currentLayoutStyle = computed(() => layoutStore.currentLayoutStyle);
const navigationConfig = computed(() => layoutStore.navigationConfig);

const currentLayoutComponent = computed(() => {
    const componentMap = {
        Layout1: markRaw(Style1),
        Layout2: markRaw(Style2),
        Layout3: markRaw(Style3),
        Layout4: markRaw(Style4),
        Layout5: markRaw(Style5),
    };
    return (
        componentMap[currentLayoutStyle.value?.component as keyof typeof componentMap] ||
        componentMap.Layout1
    );
});
</script>

<template>
    <div class="bg-muted flex h-full flex-1 flex-col rounded-lg">
        <div class="pointer-events-none flex h-full w-full justify-center">
            <component
                :is="currentLayoutComponent"
                :has-preview="true"
                :navigation-config="JSON.parse(JSON.stringify(navigationConfig))"
            >
                <BdPlaceholder class="m-0! ml-4!" />
            </component>
        </div>
    </div>
</template>
