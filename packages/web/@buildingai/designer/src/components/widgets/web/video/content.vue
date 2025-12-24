<script lang="ts" setup>
/**
 * 视频组件
 * @description 支持自动播放、控制条、海报图、链接跳转的视频组件
 */
import { computed, type CSSProperties } from "vue";

import { navigateToWeb } from "@/utils/helper";

import WidgetsBaseContent from "../../base/widgets-base-content.vue";
import type { Props } from "./config";

const props = defineProps<Props>();

/**
 * 视频样式计算
 */
const videoStyle = computed<CSSProperties>(() => ({
    width: "100%",
    height: "100%",
    objectFit: props.objectFit,
    borderRadius: `${props.borderRadius}px`,
    opacity: props.opacity,
    transition: "opacity 0.3s ease",
}));

/**
 * 占位图样式
 */
const placeholderStyle = computed<CSSProperties>(() => ({
    width: "100%",
    height: "100%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#f5f5f5",
    borderRadius: `${props.borderRadius}px`,
    color: "#999",
    fontSize: "14px",
}));
</script>

<template>
    <WidgetsBaseContent :style="props.style" :override-bg-color="true" custom-class="video-content">
        <template #default="{ style }">
            <div
                class="video-wrapper"
                :class="{ 'cursor-pointer': props.to.path }"
                @click="navigateToWeb(props.to)"
            >
                <!-- 占位图 -->
                <div v-if="!props.src" :style="placeholderStyle">
                    <UIcon name="i-heroicons-play-circle" class="text-muted-foreground h-12 w-12" />
                </div>

                <!-- 实际视频 -->
                <video
                    v-else
                    :src="props.src"
                    :poster="props.poster"
                    :controls="props.controls"
                    :autoplay="props.autoplay"
                    :loop="props.loop"
                    :muted="props.muted"
                    :preload="props.preload"
                    :title="props.title"
                    :style="videoStyle"
                    class="block"
                >
                    您的浏览器不支持视频播放。
                </video>
            </div>
        </template>
    </WidgetsBaseContent>
</template>

<style lang="scss" scoped>
.video-content {
    overflow: hidden;

    .video-wrapper {
        width: 100%;
        height: 100%;
        position: relative;

        &.cursor-pointer:hover {
            opacity: 0.9;
            transition: opacity 0.2s ease;
        }
    }
}
</style>
