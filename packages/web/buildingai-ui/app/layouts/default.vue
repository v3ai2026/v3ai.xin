<script lang="ts" setup>
import { Style1, Style2, Style3, Style4, Style5 } from "@buildingai/layouts/web";
import { apiGetWebLayoutConfig } from "@buildingai/service/webapi/decorate";
import { type Component, computed } from "vue";

const layoutToComponentMap: Record<string, Component> = {
    "layout-1": Style1,
    "layout-2": Style2,
    "layout-3": Style3,
    "layout-4": Style4,
    "layout-5": Style5,
};

const { data: layoutResponse } = await useAsyncData(
    "web-layout-config",
    () => apiGetWebLayoutConfig("web"),
    {
        default: () => ({
            code: 200,
            data: {
                layout: "layout-5",
                menus: [],
            },
            message: "success",
        }),
        server: import.meta.server,
    },
);

const controlsStore = useControlsStore();

const layoutConfig = computed(() => {
    return (
        layoutResponse.value?.data || {
            layout: "layout-5",
            menus: [],
        }
    );
});

controlsStore.setLayoutStyle(layoutConfig.value.layout as string);

const LayoutComponent = computed(() => {
    return layoutToComponentMap[layoutConfig.value.layout] || Style1;
});

interface NavigationConfig {
    items: Array<{
        id: string;
        title: string;
        link: { path: string };
        icon: string;
    }>;
}

const navigationConfig = computed((): NavigationConfig => {
    return {
        items: layoutConfig.value.menus || [
            {
                id: "1",
                title: "首页",
                link: { path: "/" },
                icon: "i-lucide-home",
            },
            {
                id: "2",
                title: "用户",
                link: { path: "/profile" },
                icon: "i-lucide-user",
            },
        ],
    };
});
</script>

<template>
    <component :is="LayoutComponent" :navigation-config="navigationConfig">
        <slot />
    </component>
</template>
