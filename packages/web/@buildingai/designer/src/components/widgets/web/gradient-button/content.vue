<script lang="ts" setup>
/**
 * 渐变按钮组件
 * @description 带有彩虹渐变边框动画的按钮组件，支持自定义颜色、动画时长和样式配置
 */
import { computed } from "vue";

import { navigateToWeb } from "@/utils/helper";

import WidgetsBaseContent from "../../base/widgets-base-content.vue";
import type { Props } from "./config";

const props = defineProps<Props>();

// 计算样式
const durationInMilliseconds = computed(() => `${props.duration}ms`);
const allColors = computed(() => props.colors.join(", "));
const borderWidthInPx = computed(() => `${props.borderWidth}px`);
const borderRadiusInPx = computed(() => `${props.borderRadius}px`);
const blurPx = computed(() => `${props.blur}px`);
const buttonBgColor = computed(() => props.bgColor);

// 工具函数 - 临时简化版本的cn函数
const cn = (...classes: (string | undefined)[]) => {
    return classes.filter(Boolean).join(" ");
};
</script>

<template>
    <WidgetsBaseContent
        :style="props.style"
        :override-bg-color="true"
        custom-class="gradient-button-content"
    >
        <template #default="{ style }">
            <button
                :class="
                    cn(
                        'animate-rainbow rainbow-btn relative flex min-h-10 min-w-28 items-center justify-center overflow-hidden before:absolute before:-inset-[200%]',
                        props.class,
                    )
                "
                @click="navigateToWeb(props.to)"
            >
                <span
                    class="btn-content inline-flex size-full items-center justify-center px-4 py-2"
                >
                    {{ props.label }}
                </span>
            </button>
        </template>
    </WidgetsBaseContent>
</template>

<style lang="scss" scoped>
.gradient-button-content {
    display: flex;
    align-items: center;
    justify-content: center;
    overflow: hidden;
}

.animate-rainbow::before {
    content: "";
    background: conic-gradient(v-bind(allColors));
    animation: rotate-rainbow v-bind(durationInMilliseconds) linear infinite;
    filter: blur(v-bind(blurPx));
    padding: v-bind(borderWidthInPx);
}

.rainbow-btn {
    padding: v-bind(borderWidthInPx);
    border-radius: v-bind(borderRadiusInPx);
}

.btn-content {
    border-radius: v-bind(borderRadiusInPx);
    background-color: v-bind(buttonBgColor);
    z-index: 0;
}

@keyframes rotate-rainbow {
    0% {
        transform: rotate(0deg);
    }
    100% {
        transform: rotate(360deg);
    }
}
</style>
