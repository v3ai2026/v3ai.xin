<script setup lang="ts">
/**
 * 雪花背景组件
 * @description 用于展示雪花飘落背景效果的组件，支持自定义雪花数量、速度和大小
 */
import { useDevicePixelRatio } from "@vueuse/core";
import { computed, nextTick, onBeforeUnmount, onMounted, reactive, ref, watch } from "vue";

import WidgetsBaseContent from "../../base/widgets-base-content.vue";
import type { Props } from "./config";

type Snowflake = {
    x: number;
    y: number;
    size: number;
    alpha: number;
    dx: number; // 水平飘移
    dy: number; // 垂直下降速度
};

const props = withDefaults(defineProps<Props>(), {
    color: "#FFF",
    quantity: 100,
    speed: 1,
    maxRadius: 3,
    minRadius: 1,
    class: "",
});

const canvasRef = ref<HTMLCanvasElement | null>(null);
const canvasContainerRef = ref<HTMLDivElement | null>(null);
const context = ref<CanvasRenderingContext2D | null>(null);
const snowflakes = ref<Snowflake[]>([]);
const canvasSize = reactive<{ w: number; h: number }>({ w: 0, h: 0 });
const { pixelRatio } = useDevicePixelRatio();

// ResizeObserver 用于监听容器尺寸变化
let resizeObserver: ResizeObserver | null = null;

/**
 * 颜色转换计算
 * 将十六进制颜色转换为 RGB 格式
 */
const color = computed(() => {
    const hex = props.color.replace(/^#/, "").padStart(6, "0");
    const bigint = parseInt(hex, 16);
    const r = (bigint >> 16) & 255;
    const g = (bigint >> 8) & 255;
    const b = bigint & 255;
    return `${r} ${g} ${b}`;
});

onMounted(() => {
    if (canvasRef.value) {
        context.value = canvasRef.value.getContext("2d");
    }

    initCanvas();
    animate();
    window.addEventListener("resize", initCanvas);

    // 设置 ResizeObserver 监听容器尺寸变化
    if (canvasContainerRef.value) {
        resizeObserver = new ResizeObserver(() => {
            nextTick(() => {
                initCanvas();
            });
        });
        resizeObserver.observe(canvasContainerRef.value);
    }
});

onBeforeUnmount(() => {
    window.removeEventListener("resize", initCanvas);

    // 清理 ResizeObserver
    if (resizeObserver) {
        resizeObserver.disconnect();
        resizeObserver = null;
    }
});

// 监听组件尺寸变化
watch(
    () => props.style,
    () => {
        nextTick(() => {
            initCanvas();
        });
    },
    { deep: true },
);

// 监听雪花参数变化
watch(
    [() => props.quantity, () => props.speed, () => props.maxRadius, () => props.minRadius],
    () => {
        nextTick(() => {
            createSnowflakes();
        });
    },
);

/**
 * 初始化画布
 */
function initCanvas() {
    resizeCanvas();
    createSnowflakes();
}

/**
 * 调整画布尺寸
 */
function resizeCanvas() {
    if (canvasContainerRef.value && canvasRef.value && context.value) {
        snowflakes.value.length = 0;
        canvasSize.w = canvasContainerRef.value.offsetWidth;
        canvasSize.h = canvasContainerRef.value.offsetHeight;
        canvasRef.value.width = canvasSize.w * pixelRatio.value;
        canvasRef.value.height = canvasSize.h * pixelRatio.value;
        canvasRef.value.style.width = `${canvasSize.w}px`;
        canvasRef.value.style.height = `${canvasSize.h}px`;
        context.value.scale(pixelRatio.value, pixelRatio.value);
    }
}

/**
 * 创建雪花数组
 */
function createSnowflakes() {
    snowflakes.value = [];
    for (let i = 0; i < props.quantity; i++) {
        const snowflake = createSnowflake();
        snowflakes.value.push(snowflake);
    }
}

/**
 * 创建单个雪花
 */
function createSnowflake(): Snowflake {
    const x = Math.random() * canvasSize.w;
    const y = Math.random() * canvasSize.h;
    const size = Math.random() * (props.maxRadius - props.minRadius) + props.minRadius; // 随机大小
    const alpha = Math.random() * 0.5 + 0.5; // 透明度在 0.5 到 1 之间
    const dx = (Math.random() - 0.5) * 0.5; // 轻微的水平飘移
    const dy = Math.random() * 0.25 + props.speed; // 下降速度

    return { x, y, size, alpha, dx, dy };
}

/**
 * 绘制雪花
 */
function drawSnowflake(snowflake: Snowflake) {
    if (context.value) {
        const { x, y, size, alpha } = snowflake;
        context.value.beginPath();
        context.value.arc(x, y, size, 0, Math.PI * 2);
        context.value.fillStyle = `rgba(${color.value.split(" ").join(", ")}, ${alpha})`;
        context.value.fill();
    }
}

/**
 * 动画循环
 */
function animate() {
    if (context.value) {
        context.value.clearRect(0, 0, canvasSize.w, canvasSize.h);
    }

    snowflakes.value.forEach((snowflake) => {
        snowflake.x += snowflake.dx; // 水平飘移
        snowflake.y += snowflake.dy; // 向下飘落

        // 当雪花移出画布时重置位置
        if (snowflake.y > canvasSize.h) {
            snowflake.y = -snowflake.size; // 重置到顶部
            snowflake.x = Math.random() * canvasSize.w; // 随机水平位置
        }

        drawSnowflake(snowflake);
    });

    requestAnimationFrame(animate);
}
</script>

<template>
    <WidgetsBaseContent
        :style="props.style"
        :override-bg-color="true"
        custom-class="snowfall-bg-content"
    >
        <template #default="{ style }">
            <div
                ref="canvasContainerRef"
                :class="props.class"
                aria-hidden="true"
                class="snowfall-container"
            >
                <canvas ref="canvasRef"></canvas>
            </div>
        </template>
    </WidgetsBaseContent>
</template>

<style lang="scss" scoped>
.snowfall-bg-content {
    position: relative;
    overflow: hidden;

    .snowfall-container {
        width: 100%;
        height: 100%;
        position: relative;

        canvas {
            display: block;
            width: 100%;
            height: 100%;
        }
    }
}
</style>
