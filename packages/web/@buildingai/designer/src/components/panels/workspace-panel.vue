<script lang="ts" setup>
import { computed, ref } from "vue";

import type { InteractionMode } from "../../hooks/use-panzoom";
import CanvasPageInfo from "../canvas/canvas-page-info.vue";
import CanvasWorkspace from "../canvas/canvas-workspace.vue";
import ZoomContainer from "../toolbar/zoom-container.vue";
import ZoomControls from "../toolbar/zoom-controls.vue";

const zoomRef = ref<InstanceType<typeof ZoomContainer> | null>(null);
const interactionMode = ref<InteractionMode>("touchpad");
const zoomScale = computed(() => zoomRef.value?.currentScale ?? 1);
</script>

<template>
    <div class="workspace flex min-w-0 flex-1 justify-center overflow-hidden rounded-lg p-5">
        <!-- 缩放变焦面板 -->
        <ZoomContainer ref="zoomRef" v-model="interactionMode">
            <div class="relative h-full w-full">
                <CanvasPageInfo :zoom-scale="zoomScale" />
                <CanvasWorkspace :zoom-scale="zoomScale" />
            </div>
        </ZoomContainer>
        <!-- 缩放控制器 -->
        <ZoomControls
            v-model="interactionMode"
            :scale="zoomScale"
            @reset="zoomRef?.resetZoom()"
            @zoom-in="zoomRef?.zoomIn()"
            @zoom-out="zoomRef?.zoomOut()"
            @focus="zoomRef?.focusContent()"
        />
    </div>
</template>

<style lang="scss" scoped>
.workspace {
    background-color: rgba(6, 7, 9, 0.03);
}

.dark .workspace {
    background-color: #363535;
}
</style>
