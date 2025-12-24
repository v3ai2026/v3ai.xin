<script setup lang="ts">
/**
 * 网格图案组件
 * @description 用于展示交互式网格图案的组件，支持自定义方格大小和数量，具有鼠标悬停效果和文字覆盖
 */
import { computed, ref } from "vue";

import WidgetsBaseContent from "../../base/widgets-base-content.vue";
import type { Props } from "./config";

const props = withDefaults(defineProps<Props>(), {
    width: 40,
    height: 40,
    squares: () => [24, 24],
    text: "Interactive Grid Pattern",
    textSize: 16,
    textColor: "#000000",
    fontWeight: 500,
    showText: true,
    maskEffect: true,
    skewEffect: true,
    className: "",
    squaresClassName: "",
});

/**
 * 计算属性：水平方格数量
 */
const horizontal = computed(() => props.squares[0]);

/**
 * 计算属性：垂直方格数量
 */
const vertical = computed(() => props.squares[1]);

/**
 * 计算属性：总方格数量
 */
const totalSquares = computed(() => horizontal.value * vertical.value);

/**
 * 当前悬停的方格索引
 */
const hoveredSquare = ref<number | null>(null);

/**
 * 计算属性：网格总宽度
 */
const gridWidth = computed(() => props.width * horizontal.value);

/**
 * 计算属性：网格总高度
 */
const gridHeight = computed(() => props.height * vertical.value);

/**
 * 获取方格的X坐标
 * @param index 方格索引
 */
function getX(index: number) {
    return (index % horizontal.value) * props.width;
}

/**
 * 获取方格的Y坐标
 * @param index 方格索引
 */
function getY(index: number) {
    return Math.floor(index / horizontal.value) * props.height;
}

/**
 * 计算属性：SVG样式类名
 */
const svgClass = computed(() => {
    let baseClasses = "absolute inset-0 h-full w-full border border-gray-400/30";

    // 添加遮罩效果
    if (props.maskEffect) {
        baseClasses += " [mask-image:radial-gradient(350px_circle_at_center,white,transparent)]";
    }

    // 添加倾斜效果
    if (props.skewEffect) {
        baseClasses += " h-[200%] skew-y-12";
    }

    return props.className ? `${baseClasses} ${props.className}` : baseClasses;
});

/**
 * 获取方格的样式类名
 * @param index 方格索引
 */
function getRectClass(index: number) {
    const baseClasses =
        "stroke-gray-400/30 transition-all duration-100 ease-in-out [&:not(:hover)]:duration-1000";
    const hoverClass = hoveredSquare.value === index ? "fill-gray-300/30" : "fill-transparent";
    const customClass = props.squaresClassName || "";

    return `${baseClasses} ${hoverClass} ${customClass}`.trim();
}

/**
 * 处理鼠标进入方格事件
 * @param index 方格索引
 */
function handleMouseEnter(index: number) {
    hoveredSquare.value = index;
}

/**
 * 处理鼠标离开方格事件
 */
function handleMouseLeave() {
    hoveredSquare.value = null;
}

/**
 * 计算属性：文字样式
 */
const textStyle = computed(() => {
    return {
        color: props.textColor,
        fontWeight: props.fontWeight,
        fontSize: `${props.textSize}px`,
    };
});

/**
 * 计算属性：文字类名
 */
const textClass = computed(() => {
    return `z-10 whitespace-pre-wrap text-center tracking-tighter`;
});
</script>

<template>
    <WidgetsBaseContent
        :style="props.style"
        :override-bg-color="true"
        custom-class="grid-pattern-content"
    >
        <template #default="{ style }">
            <div
                class="grid-pattern-container relative grid h-full place-content-center overflow-hidden"
            >
                <!-- 文字层 -->
                <p v-if="props.showText" :class="textClass" :style="textStyle">
                    {{ props.text }}
                </p>

                <!-- 网格层 -->
                <svg :width="gridWidth" :height="gridHeight" :class="svgClass">
                    <rect
                        v-for="(_, index) in totalSquares"
                        :key="index"
                        :x="getX(index)"
                        :y="getY(index)"
                        :width="props.width"
                        :height="props.height"
                        :class="getRectClass(index)"
                        @mouseenter="handleMouseEnter(index)"
                        @mouseleave="handleMouseLeave"
                    />
                </svg>
            </div>
        </template>
    </WidgetsBaseContent>
</template>

<style lang="scss" scoped>
.grid-pattern-content {
    position: relative;
    overflow: hidden;
    min-height: 300px;

    .grid-pattern-container {
        width: 100%;
        height: 100%;
        position: relative;

        p {
            position: relative;
            z-index: 10;
        }

        svg {
            position: absolute;
            inset: 0;
        }
    }
}
</style>
