<script setup lang="ts">
/**
 * 图片魔方组件
 * @description 用于展示多种布局的图片魔方，支持多种布局方式和样式自定义
 */
import { computed } from "vue";

import { getImageUrl, navigateToWeb } from "@/utils/helper";

import WidgetsBaseContent from "../../base/widgets-base-content.vue";
import type { Props } from "./config";

const props = defineProps<Props>();

// 布局映射 - 提高性能
const LAYOUT_MAP = {
    "one-row-one": { class: "grid-cols-1", count: 1 },
    "one-row-two": { class: "grid-cols-2", count: 2 },
    "one-row-three": { class: "grid-cols-3", count: 3 },
    "left-one-right-two": { class: "grid-layout-left-one-right-two", count: 3 },
    "left-two-right-one": { class: "grid-layout-left-two-right-one", count: 3 },
    "top-one-bottom-two": { class: "grid-layout-top-one-bottom-two", count: 3 },
    "top-two-bottom-one": { class: "grid-layout-top-two-bottom-one", count: 3 },
} as const;

const layoutInfo = computed(
    () => LAYOUT_MAP[props.layoutType] || { class: "grid-cols-2", count: 2 },
);
const displayImages = computed(() => props.images.slice(0, layoutInfo.value.count));

/**
 * 图片项样式类
 */
const getImageItemClass = (index: number) => {
    const { layoutType } = props;
    return {
        "row-span-2":
            (layoutType === "left-one-right-two" && index === 0) ||
            (layoutType === "left-two-right-one" && index === 2) ||
            (layoutType === "top-one-bottom-two" && index === 0) ||
            (layoutType === "top-two-bottom-one" && index === 2),
        "col-span-2":
            (layoutType === "top-one-bottom-two" && index === 0) ||
            (layoutType === "top-two-bottom-one" && index === 2),
    };
};
</script>

<template>
    <WidgetsBaseContent :style="props.style" custom-class="image-cube-container">
        <template #default="{ getSpacing, getBorderRadius }">
            <div
                class="grid h-full w-full"
                :class="layoutInfo.class"
                :style="{ gap: getSpacing(props.style.imageGap) }"
            >
                <template v-for="(item, index) in displayImages" :key="index">
                    <div
                        class="image-item"
                        :class="getImageItemClass(index)"
                        @click="navigateToWeb(item.to)"
                    >
                        <NuxtImg
                            v-if="item.image"
                            :src="getImageUrl(item.image)"
                            class="image"
                            :style="{ borderRadius: getBorderRadius(props.style.imageRadius) }"
                            alt=""
                        />
                        <div
                            v-else
                            class="bg-accent flex h-full w-full items-center justify-center"
                        >
                            <UIcon name="i-lucide-image" class="text-muted-foreground size-5" />
                        </div>
                    </div>
                </template>
            </div>
        </template>
    </WidgetsBaseContent>
</template>

<style lang="scss" scoped>
.image-cube-container {
    .grid {
        display: grid;

        &.grid-layout-left-one-right-two,
        &.grid-layout-left-two-right-one,
        &.grid-layout-top-one-bottom-two,
        &.grid-layout-top-two-bottom-one {
            grid-template-columns: 1fr 1fr;
            grid-template-rows: 1fr 1fr;
        }
    }

    .image-item {
        width: 100%;
        height: 100%;
        overflow: hidden;
        position: relative;
    }

    .image {
        width: 100%;
        height: 100%;
        object-fit: cover;
    }
}
</style>
