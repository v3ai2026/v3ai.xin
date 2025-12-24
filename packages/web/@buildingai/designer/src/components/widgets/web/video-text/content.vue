<script setup lang="ts">
/**
 * 视频文字组件
 * @description 用于展示带有文字遮罩效果的视频组件，支持自定义视频参数和文字样式
 */
import { computed, onMounted, onUnmounted, ref, watch } from "vue";

import WidgetsBaseContent from "../../base/widgets-base-content.vue";
import type { Props } from "./config";

const props = withDefaults(defineProps<Props>(), {
    src: "",
    content: "Video Text",
    autoPlay: true,
    muted: true,
    loop: true,
    preload: "auto",
    fontSize: 20,
    fontWeight: 700,
    textAnchor: "middle",
    dominantBaseline: "middle",
    fontFamily: "sans-serif",
    className: "",
});

/**
 * SVG遮罩字符串
 */
const svgMask = ref("");

/**
 * 计算属性：生成Data URL遮罩
 */
const dataUrlMask = computed(
    () => `url("data:image/svg+xml,${encodeURIComponent(svgMask.value)}")`,
);

/**
 * 计算属性：容器类名
 */
const containerClass = computed(() => {
    return props.className ? `relative size-full ${props.className}` : "relative size-full";
});

/**
 * 更新SVG遮罩
 */
function updateSvgMask() {
    const responsiveFontSize = `${props.fontSize}vw`;
    svgMask.value = `<svg xmlns='http://www.w3.org/2000/svg' width='100%' height='100%'><text x='50%' y='50%' font-size='${responsiveFontSize}' font-weight='${props.fontWeight}' text-anchor='${props.textAnchor}' dominant-baseline='${props.dominantBaseline}' font-family='${props.fontFamily}'>${props.content}</text></svg>`;
}

/**
 * 计算属性：遮罩样式
 */
const maskStyle = computed(() => ({
    maskImage: dataUrlMask.value,
    WebkitMaskImage: dataUrlMask.value,
    WebkitMaskSize: "contain",
    maskRepeat: "no-repeat",
    WebkitMaskRepeat: "no-repeat",
    maskPosition: "center",
    WebkitMaskPosition: "center",
}));

// 监听内容变化
watch(() => props.content, updateSvgMask);

// 监听字体相关属性变化
watch(
    () => [
        props.fontSize,
        props.fontWeight,
        props.textAnchor,
        props.dominantBaseline,
        props.fontFamily,
    ],
    updateSvgMask,
);

onMounted(() => {
    updateSvgMask();
    window.addEventListener("resize", updateSvgMask);
});

onUnmounted(() => {
    window.removeEventListener("resize", updateSvgMask);
});
</script>

<template>
    <WidgetsBaseContent
        :style="props.style"
        :override-bg-color="true"
        custom-class="video-text-content"
    >
        <template #default="{ style }">
            <div :class="containerClass">
                <div class="absolute inset-0 flex items-center justify-center" :style="maskStyle">
                    <video
                        v-if="props.src"
                        class="size-full object-cover"
                        :autoplay="props.autoPlay"
                        :muted="props.muted"
                        :loop="props.loop"
                        :preload="props.preload"
                    >
                        <source :src="props.src" />
                        Your browser does not support the video tag.
                    </video>
                    <div
                        v-else
                        class="flex size-full items-center justify-center bg-gray-200 text-gray-500 dark:bg-gray-800 dark:text-gray-400"
                    >
                        <div class="text-center">
                            <i class="i-heroicons-video-camera mb-2 text-4xl" />
                            <p>请上传视频</p>
                        </div>
                    </div>
                </div>
                <span class="sr-only">{{ props.content }}</span>
            </div>
        </template>
    </WidgetsBaseContent>
</template>

<style lang="scss" scoped>
.video-text-content {
    position: relative;
    overflow: hidden;
    min-height: 300px;

    video {
        position: absolute;
        inset: 0;
        width: 100%;
        height: 100%;
        object-fit: cover;
    }
}
</style>
