<script setup lang="ts">
/**
 * 彩虹按钮组件
 * @description 带有彩虹渐变边框动画的按钮组件，支持自定义动画速度和HTML标签类型
 */
import { computed } from "vue";

import { navigateToWeb } from "@/utils/helper";

import WidgetsBaseContent from "../../base/widgets-base-content.vue";
import type { Props } from "./config";

const props = withDefaults(defineProps<Props>(), {
    text: "Button",
    class: "",
    is: "button",
    speed: 2,
    textColor: "var(--background)",
    buttonBgColor: "var(--foreground)",
});

// 工具函数 - 临时简化版本的cn函数
const cn = (...classes: (string | undefined)[]) => {
    return classes.filter(Boolean).join(" ");
};

const speedInSeconds = computed(() => `${props.speed}s`);

// 计算按钮样式
const buttonStyle = computed(() => ({
    color: props.textColor,
    backgroundColor: props.buttonBgColor,
}));
</script>

<template>
    <WidgetsBaseContent
        :style="props.style"
        :override-bg-color="true"
        custom-class="rainbow-button-content"
    >
        <template #default="{ style }">
            <component
                :is="props.is"
                :class="
                    cn(
                        'rainbow-button',
                        'group focus-visible:ring-ring relative inline-flex h-11 cursor-pointer items-center justify-center rounded-xl border-0 bg-[length:200%] [background-clip:padding-box,border-box,border-box] [background-origin:border-box] px-8 py-2 font-medium transition-colors [border:calc(0.08*1rem)_solid_transparent] focus-visible:ring-1 focus-visible:outline-none disabled:pointer-events-none disabled:opacity-50',
                        'before:absolute before:bottom-[-20%] before:left-1/2 before:z-0 before:h-1/5 before:w-3/5 before:-translate-x-1/2 before:bg-[linear-gradient(90deg,var(--color-1),var(--color-5),var(--color-3),var(--color-4),var(--color-2))] before:bg-[length:200%] before:[filter:blur(calc(0.8*1rem))]',
                        props.class,
                    )
                "
                :style="buttonStyle"
                @click="navigateToWeb(props.to)"
            >
                {{ props.text }}
            </component>
        </template>
    </WidgetsBaseContent>
</template>

<style scoped>
.rainbow-button-content {
    display: flex;
    align-items: center;
    justify-content: center;
    overflow: hidden;
}

.rainbow-button {
    --color-1: hsl(0 100% 63%);
    --color-2: hsl(270 100% 63%);
    --color-3: hsl(210 100% 63%);
    --color-4: hsl(195 100% 63%);
    --color-5: hsl(90 100% 63%);
    --speed: v-bind(speedInSeconds);
    animation: rainbow var(--speed) infinite linear;
}

.rainbow-button:before {
    animation: rainbow var(--speed) infinite linear;
}

@keyframes rainbow {
    0% {
        background-position: 0;
    }
    100% {
        background-position: 200%;
    }
}
</style>
