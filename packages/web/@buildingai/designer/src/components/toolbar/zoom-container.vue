<script setup lang="ts">
import type { CSSProperties } from "vue";
import { watch } from "vue";

import type { InteractionMode } from "../../hooks/use-panzoom";
import { usePanzoom } from "../../hooks/use-panzoom";

interface Props {
    maxZoom?: number;
    minZoom?: number;
    zoomSpeed?: number;
    containerStyle?: CSSProperties;
    contentStyle?: CSSProperties;
    modelValue?: InteractionMode;
}

const props = withDefaults(defineProps<Props>(), {
    maxZoom: 2,
    minZoom: 0.2,
    zoomSpeed: 0.1,
    modelValue: "mouse",
});

const emit = defineEmits<{
    (e: "update:modelValue", value: InteractionMode): void;
}>();

const {
    contentRef,
    containerRef,
    currentScale,
    zoomIn,
    zoomOut,
    resetZoom,
    focusContent,
    updateInteractionMode,
} = usePanzoom({
    maxZoom: props.maxZoom,
    minZoom: props.minZoom,
    zoomSpeed: props.zoomSpeed,
    modelValue: props.modelValue,
    onUpdateMode: (mode) => emit("update:modelValue", mode),
});

// 监听 props.modelValue 的变化以更新 panzoom 中的交互模式
watch(
    () => props.modelValue,
    (newMode: InteractionMode | undefined) => {
        if (newMode) {
            updateInteractionMode(newMode);
        }
    },
);

defineExpose({
    currentScale,
    zoomIn,
    zoomOut,
    resetZoom,
    focusContent,
    updateInteractionMode,
});
</script>

<template>
    <div ref="containerRef" class="zoom-container" :style="props.containerStyle">
        <div ref="contentRef" class="zoom-content" :style="props.contentStyle">
            <slot />
        </div>
    </div>
</template>

<style scoped>
.zoom-container {
    position: relative;
    width: 100%;
    height: 100%;
    outline: none;
}

.zoom-content {
    position: absolute;
    transform-origin: 0 0;
}
</style>
