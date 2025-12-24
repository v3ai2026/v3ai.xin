<script lang="ts" setup>
/**
 * 卡片组件
 * @description 支持标题、内容、图片、按钮的卡片组件
 */
import { computed, type CSSProperties } from "vue";

import { navigateToWeb } from "@/utils/helper";

import WidgetsBaseContent from "../../base/widgets-base-content.vue";
import type { Props } from "./config";

const props = defineProps<Props>();

/**
 * 卡片容器样式计算
 */
const cardStyle = computed<CSSProperties>(() => ({
    borderRadius: `${props.borderRadius}px`,
    border: props.borderWidth > 0 ? `${props.borderWidth}px solid ${props.borderColor}` : "none",
    backgroundColor: props.style.bgColor,
    overflow: "hidden",
    height: "100%",
    display: "flex",
    flexDirection: "column",
    transition: "all 0.2s ease",
    ...(props.shadow !== "none" && {
        boxShadow: {
            sm: "0 1px 2px 0 rgb(0 0 0 / 0.05)",
            md: "0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)",
            lg: "0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)",
            xl: "0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)",
        }[props.shadow],
    }),
}));

/**
 * 图片样式计算
 */
const imageStyle = computed<CSSProperties>(() => ({
    width: "100%",
    height: `${props.imageHeight}px`,
    objectFit: "cover",
    display: "block",
}));

/**
 * 内容区域样式
 */
const contentAreaStyle = computed<CSSProperties>(() => ({
    padding: `${props.style.paddingTop}px ${props.style.paddingRight}px ${props.style.paddingBottom}px ${props.style.paddingLeft}px`,
    flex: 1,
    display: "flex",
    flexDirection: "column",
    gap: "12px",
}));

/**
 * 图片占位样式
 */
const imagePlaceholderStyle = computed<CSSProperties>(() => ({
    width: "100%",
    height: `${props.imageHeight}px`,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#f3f4f6",
    color: "#9ca3af",
}));
</script>

<template>
    <WidgetsBaseContent :style="props.style" :override-bg-color="true" custom-class="card-content">
        <template #default="{ style }">
            <div
                :style="cardStyle"
                class="card-wrapper"
                :class="{ 'cursor-pointer hover:shadow-lg': !!props.to.path }"
                @click="navigateToWeb(props.to)"
            >
                <!-- 头部图片 -->
                <div v-if="props.showImage" class="card-image">
                    <NuxtImg
                        v-if="props.image"
                        :src="props.image"
                        :alt="props.title"
                        :style="imageStyle"
                    />
                    <div v-else :style="imagePlaceholderStyle">
                        <UIcon name="i-heroicons-photo" class="h-12 w-12" />
                    </div>
                </div>

                <!-- 内容区域 -->
                <div :style="contentAreaStyle" class="card-body">
                    <!-- 标题 -->
                    <div v-if="props.title" class="card-title">
                        <h3
                            class="text-secondary-foreground dark:text-background line-clamp-2 text-lg font-semibold"
                        >
                            {{ props.title }}
                        </h3>
                    </div>

                    <!-- 副标题 -->
                    <div v-if="props.subtitle" class="card-subtitle">
                        <p
                            class="text-accent-foreground line-clamp-1 text-sm font-medium dark:text-gray-300"
                        >
                            {{ props.subtitle }}
                        </p>
                    </div>

                    <!-- 内容描述 -->
                    <div v-if="props.content" class="card-description flex-1">
                        <p class="dark:text-muted-foreground line-clamp-3 text-sm text-gray-700">
                            {{ props.content }}
                        </p>
                    </div>

                    <!-- 操作按钮 -->
                    <div v-if="props.showButton && props.buttonText" class="card-actions mt-auto">
                        <UButton
                            :color="props.buttonColor"
                            :variant="props.buttonVariant"
                            size="sm"
                            class="w-full"
                        >
                            {{ props.buttonText }}
                        </UButton>
                    </div>
                </div>
            </div>
        </template>
    </WidgetsBaseContent>
</template>

<style lang="scss" scoped>
.card-content {
    height: 100%;

    .card-wrapper {
        transition: all 0.2s ease;

        &.cursor-pointer {
            &:hover {
                transform: translateY(-2px);
            }
        }
    }

    .card-image {
        flex-shrink: 0;
    }

    .card-body {
        min-height: 0; // 允许flex子元素收缩
    }

    .card-title h3 {
        margin: 0;
        line-height: 1.4;
    }

    .card-subtitle p {
        margin: 0;
        line-height: 1.3;
    }

    .card-description p {
        margin: 0;
        line-height: 1.5;
    }

    // 行数限制类
    .line-clamp-1 {
        display: -webkit-box;
        -webkit-line-clamp: 1;
        -webkit-box-orient: vertical;
        overflow: hidden;
    }

    .line-clamp-2 {
        display: -webkit-box;
        -webkit-line-clamp: 2;
        -webkit-box-orient: vertical;
        overflow: hidden;
    }

    .line-clamp-3 {
        display: -webkit-box;
        -webkit-line-clamp: 3;
        -webkit-box-orient: vertical;
        overflow: hidden;
    }
}
</style>
