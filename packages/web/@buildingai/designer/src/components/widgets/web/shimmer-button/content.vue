<script setup lang="ts">
/**
 * 闪光按钮组件
 * @description 带有闪光动画效果的按钮组件，支持自定义闪光颜色、大小、动画时长等
 */
import { navigateToWeb } from "@/utils/helper";

import WidgetsBaseContent from "../../base/widgets-base-content.vue";
import type { Props } from "./config";

const props = withDefaults(defineProps<Props>(), {
    text: "Shimmer Button",
    class: "",
    shimmerColor: "#ffffff",
    shimmerSize: "0.05em",
    borderRadius: "100px",
    shimmerDuration: "3s",
    background: "var(--foreground)",
});

// 工具函数 - 临时简化版本的cn函数
const cn = (...classes: (string | undefined)[]) => {
    return classes.filter(Boolean).join(" ");
};
</script>

<template>
    <WidgetsBaseContent
        :style="props.style"
        :override-bg-color="true"
        custom-class="shimmer-button-content"
    >
        <template #default="{ style }">
            <button
                :class="
                    cn(
                        'group relative z-0 flex cursor-pointer items-center justify-center overflow-hidden [border-radius:var(--radius)] border border-white/10 px-6 py-3 whitespace-nowrap text-white [background:var(--bg)] dark:text-black',
                        'transform-gpu transition-transform duration-300 ease-in-out active:translate-y-px',
                        props.class,
                    )
                "
                :style="{
                    '--spread': '90deg',
                    '--shimmer-color': props.shimmerColor,
                    '--radius': props.borderRadius,
                    '--speed': props.shimmerDuration,
                    '--cut': props.shimmerSize,
                    '--bg': props.background,
                }"
                @click="navigateToWeb(props.to)"
            >
                <div
                    :class="
                        cn(
                            '-z-30 blur-[2px]',
                            '[container-type:size] absolute inset-0 overflow-visible',
                        )
                    "
                >
                    <div
                        class="animate-shimmer-btn-shimmer-slide absolute inset-0 [aspect-ratio:1] h-[100cqh] [border-radius:0] [mask:none]"
                    >
                        <div
                            class="animate-shimmer-btn-spin-around absolute -inset-full w-auto [translate:0_0] rotate-0 [background:conic-gradient(from_calc(270deg-(var(--spread)*0.5)),transparent_0,var(--shimmer-color)_var(--spread),transparent_var(--spread))]"
                        />
                    </div>
                </div>
                {{ props.text }}

                <div
                    :class="
                        cn(
                            'insert-0 absolute size-full',

                            'rounded-2xl px-4 py-1.5 text-sm font-medium shadow-[inset_0_-8px_10px_#ffffff1f]',

                            // transition
                            'transform-gpu transition-all duration-300 ease-in-out',

                            // on hover
                            'group-hover:shadow-[inset_0_-6px_10px_#ffffff3f]',

                            // on click
                            'group-active:shadow-[inset_0_-10px_10px_#ffffff3f]',
                        )
                    "
                />

                <div
                    class="absolute [inset:var(--cut)] -z-20 [border-radius:var(--radius)] [background:var(--bg)]"
                />
            </button>
        </template>
    </WidgetsBaseContent>
</template>

<style scoped>
.shimmer-button-content {
    display: flex;
    align-items: center;
    justify-content: center;
    overflow: hidden;
}

@keyframes shimmer-btn-shimmer-slide {
    to {
        transform: translate(calc(100cqw - 100%), 0);
    }
}

@keyframes shimmer-btn-spin-around {
    0% {
        transform: translateZ(0) rotate(0);
    }
    15%,
    35% {
        transform: translateZ(0) rotate(90deg);
    }
    65%,
    85% {
        transform: translateZ(0) rotate(270deg);
    }
    100% {
        transform: translateZ(0) rotate(360deg);
    }
}

.animate-shimmer-btn-shimmer-slide {
    animation: shimmer-btn-shimmer-slide var(--speed) ease-in-out infinite alternate;
}

.animate-shimmer-btn-spin-around {
    animation: shimmer-btn-spin-around calc(var(--speed) * 2) infinite linear;
}
</style>
