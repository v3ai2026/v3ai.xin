<script setup lang="ts">
/**
 * 闪烁网格组件
 * @description 用于展示闪烁网格背景效果的组件，支持自定义方格大小、间隙和闪烁效果
 */
import { computed, nextTick, onBeforeUnmount, onMounted, reactive, ref, toRefs, watch } from "vue";

import WidgetsBaseContent from "../../base/widgets-base-content.vue";
import type { Props } from "./config";

const props = withDefaults(defineProps<Props>(), {
    squareSize: 4,
    gridGap: 6,
    flickerChance: 0.3,
    color: "rgb(0, 0, 0)",
    maxOpacity: 0.2,
    class: "",
});

const { squareSize, gridGap, flickerChance, color, maxOpacity } = toRefs(props);

const containerRef = ref<HTMLDivElement>();
const canvasRef = ref<HTMLCanvasElement>();
const context = ref<CanvasRenderingContext2D>();

const isInView = ref(false);
const canvasSize = reactive({ width: 0, height: 0 });

// ResizeObserver 和 IntersectionObserver 实例
let resizeObserver: ResizeObserver | null = null;
let intersectionObserver: IntersectionObserver | null = null;
let animationFrameId: number | undefined;
let lastTime = 0;

/**
 * 颜色转换计算
 * 将颜色字符串转换为 RGBA 前缀格式
 */
const computedColor = computed(() => {
    if (!context.value) return "rgba(0, 0, 0,";

    // 如果已经是 rgb 格式，直接转换为 rgba
    if (color.value.startsWith("rgb(")) {
        return color.value.replace("rgb(", "rgba(").replace(")", ",");
    }

    // 如果是十六进制格式，转换为 rgba
    const hex = color.value.replace(/^#/, "");
    const bigint = Number.parseInt(hex, 16);
    const r = (bigint >> 16) & 255;
    const g = (bigint >> 8) & 255;
    const b = bigint & 255;
    return `rgba(${r}, ${g}, ${b},`;
});

/**
 * 网格参数类型
 */
interface GridParams {
    cols: number;
    rows: number;
    squares: Float32Array;
    dpr: number;
}

const gridParams = ref<GridParams>();

/**
 * 设置画布参数
 */
function setupCanvas(canvas: HTMLCanvasElement, width: number, height: number): GridParams {
    const dpr = window.devicePixelRatio || 1;
    canvas.width = width * dpr;
    canvas.height = height * dpr;
    canvas.style.width = `${width}px`;
    canvas.style.height = `${height}px`;

    const cols = Math.floor(width / (squareSize.value + gridGap.value));
    const rows = Math.floor(height / (squareSize.value + gridGap.value));

    const squares = new Float32Array(cols * rows);
    for (let i = 0; i < squares.length; i++) {
        squares[i] = Math.random() * maxOpacity.value;
    }

    return { cols, rows, squares, dpr };
}

/**
 * 更新方格透明度
 */
function updateSquares(squares: Float32Array, deltaTime: number) {
    for (let i = 0; i < squares.length; i++) {
        if (Math.random() < flickerChance.value * deltaTime) {
            squares[i] = Math.random() * maxOpacity.value;
        }
    }
}

/**
 * 绘制网格
 */
function drawGrid(
    ctx: CanvasRenderingContext2D,
    width: number,
    height: number,
    cols: number,
    rows: number,
    squares: Float32Array,
    dpr: number,
) {
    ctx.clearRect(0, 0, width, height);
    ctx.fillStyle = "transparent";
    ctx.fillRect(0, 0, width, height);

    for (let i = 0; i < cols; i++) {
        for (let j = 0; j < rows; j++) {
            const opacity = squares[i * rows + j];
            ctx.fillStyle = `${computedColor.value}${opacity})`;
            ctx.fillRect(
                i * (squareSize.value + gridGap.value) * dpr,
                j * (squareSize.value + gridGap.value) * dpr,
                squareSize.value * dpr,
                squareSize.value * dpr,
            );
        }
    }
}

/**
 * 更新画布尺寸
 */
function updateCanvasSize() {
    if (!containerRef.value || !canvasRef.value) return;

    const newWidth = containerRef.value.clientWidth;
    const newHeight = containerRef.value.clientHeight;

    canvasSize.width = newWidth;
    canvasSize.height = newHeight;

    if (newWidth > 0 && newHeight > 0) {
        gridParams.value = setupCanvas(canvasRef.value, newWidth, newHeight);
    }
}

/**
 * 动画循环
 */
function animate(time: number) {
    if (!isInView.value || !gridParams.value || !context.value || !canvasRef.value) return;

    const deltaTime = (time - lastTime) / 1000;
    lastTime = time;

    updateSquares(gridParams.value.squares, deltaTime);
    drawGrid(
        context.value,
        canvasRef.value.width,
        canvasRef.value.height,
        gridParams.value.cols,
        gridParams.value.rows,
        gridParams.value.squares,
        gridParams.value.dpr,
    );

    animationFrameId = requestAnimationFrame(animate);
}

/**
 * 启动动画
 */
function startAnimation() {
    if (animationFrameId) {
        cancelAnimationFrame(animationFrameId);
    }
    lastTime = performance.now();
    animationFrameId = requestAnimationFrame(animate);
}

onMounted(() => {
    if (!canvasRef.value || !containerRef.value) return;

    context.value = canvasRef.value.getContext("2d") || undefined;
    if (!context.value) return;

    updateCanvasSize();

    // 设置 ResizeObserver 监听容器尺寸变化
    resizeObserver = new ResizeObserver(() => {
        nextTick(() => {
            updateCanvasSize();
        });
    });

    // 设置 IntersectionObserver 监听元素是否在视窗内
    intersectionObserver = new IntersectionObserver(
        ([entry]) => {
            if (entry) {
                isInView.value = entry.isIntersecting;
                if (entry.isIntersecting) {
                    startAnimation();
                }
            }
        },
        { threshold: 0 },
    );

    resizeObserver.observe(containerRef.value);
    intersectionObserver.observe(canvasRef.value);
});

onBeforeUnmount(() => {
    if (animationFrameId) {
        cancelAnimationFrame(animationFrameId);
        animationFrameId = undefined;
    }

    // 清理观察器
    if (resizeObserver) {
        resizeObserver.disconnect();
        resizeObserver = null;
    }

    if (intersectionObserver) {
        intersectionObserver.disconnect();
        intersectionObserver = null;
    }
});

// 监听组件尺寸变化
watch(
    () => props.style,
    () => {
        nextTick(() => {
            updateCanvasSize();
        });
    },
    { deep: true },
);

// 监听网格参数变化
watch([squareSize, gridGap, flickerChance, maxOpacity], () => {
    nextTick(() => {
        updateCanvasSize();
    });
});
</script>

<template>
    <WidgetsBaseContent
        :style="props.style"
        :override-bg-color="true"
        custom-class="flickering-grid-content"
    >
        <template #default="{ style }">
            <div ref="containerRef" :class="props.class" class="flickering-grid-container">
                <canvas
                    ref="canvasRef"
                    class="pointer-events-none"
                    :width="canvasSize.width"
                    :height="canvasSize.height"
                />
            </div>
        </template>
    </WidgetsBaseContent>
</template>

<style lang="scss" scoped>
.flickering-grid-content {
    position: relative;
    overflow: hidden;

    .flickering-grid-container {
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
