<script lang="ts" setup>
/**
 * 轮播图组件
 * @description 基于Nuxt UI UCarousel的现代化轮播图组件
 */
import { computed, type CSSProperties } from "vue";

import { navigateToWeb } from "@/utils/helper";

import WidgetsBaseContent from "../../base/widgets-base-content.vue";
import type { CarouselItem, Props } from "./config";

const props = defineProps<Props>();

/**
 * 容器样式计算
 */
const containerStyle = computed<CSSProperties>(() => ({
    backgroundColor: props.style.bgColor,
    padding: `${props.style.paddingTop}px ${props.style.paddingRight}px ${props.style.paddingBottom}px ${props.style.paddingLeft}px`,
    height: "100%",
    display: "flex",
    flexDirection: "column",
    overflow: "hidden",
}));

/**
 * 轮播图容器样式
 */
const carouselContainerStyle = computed<CSSProperties>(() => ({
    height: `${props.carouselHeight}px`,
    width: "100%",
    position: "relative",
}));

/**
 * 图片样式
 */
const imageStyle = computed<CSSProperties>(() => ({
    width: "100%",
    height: "100%",
    objectFit: props.objectFit,
    borderRadius: `${props.imageRadius}px`,
    display: "block",
}));

/**
 * 标题样式
 */
const titleStyle = computed<CSSProperties>(() => {
    const baseStyle: CSSProperties = {
        fontSize: "14px",
        fontWeight: "600",
        color: "#ffffff",
        textAlign: "center",
        lineHeight: "1.4",
        padding: "8px 12px",
    };

    if (props.titlePosition === "overlay") {
        return {
            ...baseStyle,
            position: "absolute",
            bottom: "0",
            left: "0",
            right: "0",
            background: "linear-gradient(transparent, rgba(0, 0, 0, 0.7))",
            borderRadius: `0 0 ${props.imageRadius}px ${props.imageRadius}px`,
        };
    } else {
        return {
            ...baseStyle,
            color: "#374151",
            background: "transparent",
            padding: "8px 0",
        };
    }
});

/**
 * 自动播放配置
 */
const autoplayConfig = computed(() => {
    if (!props.autoplay) return false;
    return {
        delay: props.autoplayDelay,
        stopOnInteraction: true,
        stopOnMouseEnter: true,
        playOnInit: true,
    };
});

/**
 * 按钮配置
 */
const prevButtonConfig = computed(() => ({
    size: "md" as const,
    color: "neutral" as const,
    variant: "soft" as const,
    square: true,
}));

const nextButtonConfig = computed(() => ({
    size: "md" as const,
    color: "neutral" as const,
    variant: "soft" as const,
    square: true,
}));
</script>

<template>
    <WidgetsBaseContent
        :style="props.style"
        :override-bg-color="true"
        custom-class="carousel-content"
    >
        <template #default="{ style }">
            <div :style="containerStyle" class="carousel-container">
                <div :style="carouselContainerStyle" class="carousel-wrapper">
                    <UCarousel
                        v-slot="{ item }: { item: CarouselItem }"
                        :items="props.items"
                        :arrows="props.arrows"
                        :dots="props.dots"
                        :orientation="props.orientation"
                        :autoplay="autoplayConfig"
                        :loop="props.loop"
                        :drag-free="props.dragFree"
                        :slides-to-scroll="props.slidesToScroll"
                        :align="props.align"
                        :prev="prevButtonConfig"
                        :next="nextButtonConfig"
                        :ui="{
                            root: 'relative focus:outline-none h-full',
                            viewport: 'overflow-hidden h-full',
                            container: 'flex items-start h-full',
                            item: 'min-w-0 shrink-0 basis-full h-full',
                            prev: 'absolute z-10 bg-white/80 backdrop-blur-sm hover:bg-white/90',
                            next: 'absolute z-10 bg-white/80 backdrop-blur-sm hover:bg-white/90',
                            dots: 'absolute inset-x-0 -bottom-7 flex flex-wrap items-center justify-center gap-2',
                            dot: 'cursor-pointer size-2 bg-gray-300 hover:bg-gray-400 rounded-full transition-all duration-200 data-[state=active]:bg-blue-500 data-[state=active]:scale-125',
                        }"
                        class="carousel-component"
                    >
                        <div class="carousel-item-wrapper">
                            <!-- 图片容器 -->
                            <div
                                class="image-container"
                                :class="{ 'cursor-pointer': item.to?.path }"
                                @click="item.to?.path && navigateToWeb(item.to)"
                            >
                                <NuxtImg
                                    :src="item.src"
                                    :alt="item.alt || '轮播图'"
                                    :style="imageStyle"
                                    class="carousel-image"
                                    loading="lazy"
                                />

                                <!-- 覆盖标题 -->
                                <div
                                    v-if="
                                        props.showTitle &&
                                        item.title &&
                                        props.titlePosition === 'overlay'
                                    "
                                    :style="titleStyle"
                                    class="image-title overlay"
                                >
                                    {{ item.title }}
                                </div>
                            </div>

                            <!-- 底部标题 -->
                            <div
                                v-if="
                                    props.showTitle &&
                                    item.title &&
                                    props.titlePosition === 'bottom'
                                "
                                :style="titleStyle"
                                class="image-title bottom"
                            >
                                {{ item.title }}
                            </div>
                        </div>
                    </UCarousel>
                </div>
            </div>
        </template>
    </WidgetsBaseContent>
</template>

<style lang="scss" scoped>
.carousel-content {
    height: 100%;

    .carousel-container {
        height: 100%;
        position: relative;
    }

    .carousel-wrapper {
        position: relative;
        border-radius: 8px;
        overflow: hidden;
    }

    .carousel-component {
        height: 100%;
    }

    .carousel-item-wrapper {
        height: 100%;
        display: flex;
        flex-direction: column;
    }

    .image-container {
        position: relative;
        flex: 1;
        overflow: hidden;
        border-radius: inherit;
    }

    .carousel-image {
        transition: transform 0.3s ease;

        &:hover {
            transform: scale(1.02);
        }
    }

    .image-title {
        user-select: none;

        &.overlay {
            pointer-events: none;
        }

        &.bottom {
            flex-shrink: 0;
        }
    }

    // 响应式优化
    @media (max-width: 640px) {
        .carousel-wrapper {
            border-radius: 6px;
        }

        .image-title {
            font-size: 12px;
            padding: 6px 8px;
        }
    }
}

// 深色模式支持
@media (prefers-color-scheme: dark) {
    .carousel-content {
        .image-title.bottom {
            color: #f9fafb;
        }
    }
}

// 垂直方向样式调整
.carousel-content:has([data-orientation="vertical"]) {
    .carousel-wrapper {
        height: 100%;
    }

    .carousel-item-wrapper {
        width: 100%;
        height: 100%;
    }
}
</style>
