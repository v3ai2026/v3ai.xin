<script setup lang="ts">
/**
 * 交互按钮组件
 * @description 带有悬停动画效果的交互按钮组件，支持文字滑动和箭头显示动画
 */
import { computed, ref } from "vue";

import { navigateToWeb } from "@/utils/helper";

import WidgetsBaseContent from "../../base/widgets-base-content.vue";
import type { Props } from "./config";

const props = withDefaults(defineProps<Props>(), {
    text: "Button",
    class: "",
});

const buttonRef = ref<HTMLButtonElement>();

// 工具函数 - 临时简化版本的cn函数
const cn = (...classes: (string | undefined)[]) => {
    return classes.filter(Boolean).join(" ");
};
</script>

<template>
    <WidgetsBaseContent
        :style="props.style"
        :override-bg-color="true"
        custom-class="interactive-button-content"
    >
        <template #default="{ style }">
            <button
                ref="buttonRef"
                :class="
                    cn(
                        'group bg-background relative w-auto cursor-pointer overflow-hidden rounded-full border p-2 px-6 text-center font-semibold',
                        props.class,
                    )
                "
                @click="navigateToWeb(props.to)"
            >
                <div class="flex items-center gap-2">
                    <div
                        class="bg-primary size-2 scale-100 rounded-lg transition-all duration-300 group-hover:scale-[100.8]"
                    ></div>
                    <span
                        class="inline-block whitespace-nowrap transition-all duration-300 group-hover:translate-x-12 group-hover:opacity-0"
                    >
                        {{ props.text }}
                    </span>
                </div>

                <div
                    class="text-primary-foreground absolute top-0 z-10 flex size-full translate-x-12 items-center justify-center gap-2 opacity-0 transition-all duration-300 group-hover:-translate-x-5 group-hover:opacity-100"
                >
                    <span class="whitespace-nowrap">{{ props.text }}</span>
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        stroke-width="2"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        class="lucide lucide-arrow-right"
                    >
                        <path d="M5 12h14" />
                        <path d="m12 5 7 7-7 7" />
                    </svg>
                </div>
            </button>
        </template>
    </WidgetsBaseContent>
</template>

<style lang="scss" scoped>
.interactive-button-content {
    display: flex;
    align-items: center;
    justify-content: center;
    overflow: hidden;
}
</style>
