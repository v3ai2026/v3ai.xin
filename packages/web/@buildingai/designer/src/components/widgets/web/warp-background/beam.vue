<script lang="ts" setup>
/**
 * 光束组件
 * @description 用于渲染动态光束效果的组件，支持随机颜色和纵横比
 */
import { Motion } from "motion-v";
import { computed } from "vue";

/**
 * 光束组件属性
 */
interface Props {
    /** 光束宽度 */
    width: string | number;
    /** 光束X坐标位置 */
    x: string | number;
    /** 动画延迟时间 */
    delay: number;
    /** 动画持续时间 */
    duration: number;
}

const props = defineProps<Props>();

/**
 * 计算属性：随机色调值 (0-360)
 */
const hue = computed(() => Math.floor(Math.random() * 360));

/**
 * 计算属性：随机纵横比 (1-10)
 */
const ar = computed(() => Math.floor(Math.random() * 10) + 1);
</script>

<template>
    <Motion
        :style="{
            '--x': `${props.x}`,
            '--width': `${props.width}`,
            '--aspect-ratio': `${ar}`,
            '--background': `linear-gradient(hsl(${hue} 80% 60%), transparent)`,
        }"
        class="absolute top-0 left-[var(--x)] [aspect-ratio:1/var(--aspect-ratio)] [width:var(--width)] [background:var(--background)]"
        :initial="{
            x: '-50%',
            y: '100cqmax',
        }"
        :animate="{
            x: '-50%',
            y: '-100%',
        }"
        :transition="{
            duration: props.duration,
            delay: props.delay,
            repeat: Infinity,
            ease: 'linear',
        }"
    ></Motion>
</template>
