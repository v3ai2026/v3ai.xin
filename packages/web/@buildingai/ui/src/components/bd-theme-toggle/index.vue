<script lang="ts" setup>
import { useColorMode } from "@vueuse/core";
import { Motion, type ValueAnimationTransition } from "motion-v";
import { computed } from "vue";

const colorMode = useColorMode();

// 切换主题
const toggleTheme = () => {
    colorMode.value = colorMode.value === "dark" ? "light" : "dark";
};

// 计算当前主题
const currentTheme = computed(() => colorMode.value);

// 动画配置
const trans: ValueAnimationTransition = {
    type: "spring",
    stiffness: 200,
    damping: 20,
    mass: 1,
};

// 旋转动画变体
const vRotate = {
    dark: {
        rotate: 40,
    },
    light: {
        rotate: 180,
    },
};

// 光线动画变体
const vLine = {
    dark: {
        scale: 0,
        opacity: 0,
    },
    light: {
        scale: 1,
        opacity: 1,
    },
};

// 遮罩圆动画变体
const vMCircle = {
    dark: {
        cx: 12,
        cy: 4,
    },
    light: {
        cx: 30,
        cy: 0,
    },
};

// 中心圆动画变体
const vCCircle = {
    dark: {
        r: 9,
    },
    light: {
        r: 5,
    },
};
</script>

<template>
    <div @click="toggleTheme">
        <div class="theme-toggle-wrapper pointer-events-none">
            <Motion :initial="false" :animate="currentTheme === 'dark' ? 'dark' : 'light'">
                <Motion
                    as="svg"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                    :variants="vRotate"
                    :transition="trans"
                    :style="{ originX: '50%', originY: '50%' }"
                    class="theme-toggle-animation"
                >
                    <mask id="moon-mask">
                        <rect x="0" y="0" width="100%" height="100%" fill="white" />
                        <Motion
                            as="circle"
                            :variants="vMCircle"
                            :transition="trans"
                            cx="12"
                            cy="4"
                            r="9"
                            fill="black"
                        />
                    </mask>
                    <Motion
                        as="circle"
                        :variants="vCCircle"
                        :transition="trans"
                        cx="12"
                        cy="12"
                        r="9"
                        mask="url(#moon-mask)"
                    />

                    <Motion
                        as="g"
                        :variants="vLine"
                        stroke="currentColor"
                        stroke-width="2"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        :style="{ originX: '50%', originY: '50%' }"
                    >
                        <line x1="12" y1="2" x2="12" y2="3" />
                        <line x1="12" y1="21" x2="12" y2="22" />
                        <line x1="4.93" y1="4.93" x2="5.64" y2="5.64" />
                        <line x1="18.36" y1="18.36" x2="19.07" y2="19.07" />
                        <line x1="2" y1="12" x2="3" y2="12" />
                        <line x1="21" y1="12" x2="22" y2="12" />
                        <line x1="4.93" y1="19.07" x2="5.64" y2="18.36" />
                        <line x1="18.36" y1="5.64" x2="19.07" y2="4.93" />
                    </Motion>
                </Motion>
            </Motion>
        </div>
    </div>
</template>

<style lang="scss" scoped>
.theme-toggle-wrapper {
    position: relative;
    width: 32px;
    height: 32px;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 50%;
    transition: background-color 0.3s ease;
    user-select: none;
    cursor: pointer;
    border: none;
    background: none;

    &:hover {
        background-color: rgba(var(--color-text), 0.05);
    }

    &:active {
        background-color: rgba(var(--color-text), 0.1);
    }

    &.is-animating {
        pointer-events: none;
    }
}

.theme-toggle-animation {
    width: 22px;
    height: 22px;
    will-change: transform;
}
</style>
