<script setup lang="ts">
/**
 * 扭曲背景组件
 * @description 用于展示具有动态光束效果的3D扭曲背景组件，支持自定义标题和描述文字
 */
import { computed, nextTick, onMounted, ref } from "vue";

import WidgetsBaseContent from "../../base/widgets-base-content.vue";
import Beam from "./beam.vue";
import type { Props } from "./config";

const props = withDefaults(defineProps<Props>(), {
    title: "扭曲背景效果",
    description: "一个具有动态光束效果的3D扭曲背景组件",
    perspective: 100,
    beamsPerSide: 3,
    beamSize: 5,
    beamDelayMax: 3,
    beamDelayMin: 0,
    beamDuration: 3,
    gridColor: "hsl(var(--border))",
    titleSize: 32,
    titleColor: "#ffffff",
    titleWeight: 700,
    descSize: 16,
    descColor: "#a1a1aa",
    descWeight: 400,
    className: "",
});

/**
 * 组件容器引用
 */
const containerRef = ref<HTMLElement>();

/**
 * 计算属性：光束持续时间
 */
const beamDuration = computed(() => props.beamDuration);

/**
 * 计算属性：光束最大延迟
 */
const beamDelayMax = computed(() => props.beamDelayMax);

/**
 * 计算属性：光束最小延迟
 */
const beamDelayMin = computed(() => props.beamDelayMin);

/**
 * 生成光束配置数据
 * @returns 光束配置数组
 */
function generateBeams() {
    const beams = [];
    const cellsPerSide = Math.floor(100 / props.beamSize);
    const step = cellsPerSide / props.beamsPerSide;

    for (let i = 0; i < props.beamsPerSide; i++) {
        const x = Math.floor(i * step);
        const delay =
            Math.random() * (beamDelayMax.value - beamDelayMin.value) + beamDelayMin.value;
        beams.push({ x, delay });
    }
    return beams;
}

/**
 * 各个方向的光束配置
 */
const topBeams = generateBeams();
const bottomBeams = generateBeams();
const leftBeams = generateBeams();
const rightBeams = generateBeams();

/**
 * 计算属性：容器样式类名
 */
const containerClass = computed(() => {
    let baseClasses = "relative rounded border md:p-20";
    return props.className ? `${baseClasses} ${props.className}` : baseClasses;
});

/**
 * 计算属性：标题样式
 */
const titleStyle = computed(() => {
    return {
        color: props.titleColor,
        fontSize: `${props.titleSize}px`,
        fontWeight: props.titleWeight,
    };
});

/**
 * 计算属性：描述样式
 */
const descStyle = computed(() => {
    return {
        color: props.descColor,
        fontSize: `${props.descSize}px`,
        fontWeight: props.descWeight,
    };
});

/**
 * 计算属性：标题类名
 */
const titleClass = computed(() => {
    return "mb-4 text-center font-bold leading-tight";
});

/**
 * 计算属性：描述类名
 */
const descClass = computed(() => {
    return "text-center leading-relaxed";
});

/**
 * 组件挂载时的初始化
 */
onMounted(async () => {
    await nextTick();
    // 可以在这里添加其他初始化逻辑
});
</script>

<template>
    <WidgetsBaseContent
        :style="props.style"
        :override-bg-color="true"
        custom-class="warp-background-content"
    >
        <template #default="{ style }">
            <div ref="containerRef" :class="containerClass">
                <!-- 3D 扭曲背景效果 -->
                <div
                    :style="{
                        '--perspective': `${props.perspective}px`,
                        '--grid-color': props.gridColor,
                        '--beam-size': `${props.beamSize}%`,
                    }"
                    class="[container-type:size] pointer-events-none absolute top-0 left-0 size-full overflow-hidden [clip-path:inset(0)] [perspective:var(--perspective)] [transform-style:preserve-3d]"
                >
                    <!-- 顶部光束 -->
                    <div
                        class="[container-type:inline-size] absolute [height:100cqmax] [width:100cqi] [transform-origin:50%_0%] [transform:rotateX(-90deg)] [background-size:var(--beam-size)_var(--beam-size)] [background:linear-gradient(var(--grid-color)_0_1px,_transparent_1px_var(--beam-size))_50%_-0.5px_/var(--beam-size)_var(--beam-size),linear-gradient(90deg,_var(--grid-color)_0_1px,_transparent_1px_var(--beam-size))_50%_50%_/var(--beam-size)_var(--beam-size)] [transform-style:preserve-3d]"
                    >
                        <Beam
                            v-for="(beam, index) in topBeams"
                            :key="`top-${index}`"
                            :width="`${props.beamSize}%`"
                            :x="`${beam.x * props.beamSize}%`"
                            :delay="beam.delay"
                            :duration="beamDuration"
                        />
                    </div>

                    <!-- 底部光束 -->
                    <div
                        class="[container-type:inline-size] absolute top-full [height:100cqmax] [width:100cqi] [transform-origin:50%_0%] [transform:rotateX(-90deg)] [background-size:var(--beam-size)_var(--beam-size)] [background:linear-gradient(var(--grid-color)_0_1px,_transparent_1px_var(--beam-size))_50%_-0.5px_/var(--beam-size)_var(--beam-size),linear-gradient(90deg,_var(--grid-color)_0_1px,_transparent_1px_var(--beam-size))_50%_50%_/var(--beam-size)_var(--beam-size)] [transform-style:preserve-3d]"
                    >
                        <Beam
                            v-for="(beam, index) in bottomBeams"
                            :key="`bottom-${index}`"
                            :width="`${props.beamSize}%`"
                            :x="`${beam.x * props.beamSize}%`"
                            :delay="beam.delay"
                            :duration="beamDuration"
                        />
                    </div>

                    <!-- 左侧光束 -->
                    <div
                        class="[container-type:inline-size] absolute top-0 left-0 [height:100cqmax] [width:100cqh] [transform-origin:0%_0%] [transform:rotate(90deg)_rotateX(-90deg)] [background-size:var(--beam-size)_var(--beam-size)] [background:linear-gradient(var(--grid-color)_0_1px,_transparent_1px_var(--beam-size))_50%_-0.5px_/var(--beam-size)_var(--beam-size),linear-gradient(90deg,_var(--grid-color)_0_1px,_transparent_1px_var(--beam-size))_50%_50%_/var(--beam-size)_var(--beam-size)] [transform-style:preserve-3d]"
                    >
                        <Beam
                            v-for="(beam, index) in leftBeams"
                            :key="`left-${index}`"
                            :width="`${props.beamSize}%`"
                            :x="`${beam.x * props.beamSize}%`"
                            :delay="beam.delay"
                            :duration="beamDuration"
                        />
                    </div>

                    <!-- 右侧光束 -->
                    <div
                        class="[container-type:inline-size] absolute top-0 right-0 [height:100cqmax] [width:100cqh] [transform-origin:100%_0%] [transform:rotate(-90deg)_rotateX(-90deg)] [background-size:var(--beam-size)_var(--beam-size)] [background:linear-gradient(var(--grid-color)_0_1px,_transparent_1px_var(--beam-size))_50%_-0.5px_/var(--beam-size)_var(--beam-size),linear-gradient(90deg,_var(--grid-color)_0_1px,_transparent_1px_var(--beam-size))_50%_50%_/var(--beam-size)_var(--beam-size)] [transform-style:preserve-3d]"
                    >
                        <Beam
                            v-for="(beam, index) in rightBeams"
                            :key="`right-${index}`"
                            :width="`${props.beamSize}%`"
                            :x="`${beam.x * props.beamSize}%`"
                            :delay="beam.delay"
                            :duration="beamDuration"
                        />
                    </div>
                </div>

                <!-- 内容层 -->
                <div
                    class="relative z-10 flex h-full flex-col items-center justify-center text-center"
                >
                    <!-- 标题 -->
                    <h1 :class="titleClass" :style="titleStyle">
                        {{ props.title }}
                    </h1>

                    <!-- 描述 -->
                    <p :class="descClass" :style="descStyle">
                        {{ props.description }}
                    </p>
                </div>
            </div>
        </template>
    </WidgetsBaseContent>
</template>

<style lang="scss" scoped>
.warp-background-content {
    position: relative;
    overflow: hidden;
    min-height: 400px;

    .relative {
        width: 100%;
        height: 100%;
    }

    // 确保光束动画能够正常运行
    .pointer-events-none {
        pointer-events: none;
    }

    // 文字层确保在最上层
    .relative.z-10 {
        z-index: 10;
    }
}
</style>
