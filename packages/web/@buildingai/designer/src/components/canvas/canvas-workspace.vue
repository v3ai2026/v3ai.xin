<script lang="ts" setup>
import { useColorMode } from "@vueuse/core";
import { computed, onMounted, onUnmounted, useTemplateRef } from "vue";

import { DESIGN_CONFIG } from "../../config/design";
import { useCanvasMetrics } from "../../hooks/use-canvas-metrics";
import { useDesignSystem } from "../../hooks/use-design-system";
import { useDesignStore } from "../../stores/design";
import ComponentContainer from "./component-viewport.vue";
import GuideLines from "./guide-lines.vue";
import HighlightArea from "./highlight-area.vue";

const props = withDefaults(
    defineProps<{
        zoomScale?: number;
    }>(),
    {
        zoomScale: 1,
    },
);

// 容器引用
const designContainerRefs = useTemplateRef<HTMLElement>("designContainerRefs");
const design = useDesignStore();
const colorMode = useColorMode();

// 将 zoomScale 转换为 ref 传给 use-canvas-metrics
const currentScale = computed(() => props.zoomScale);

// 使用 designSize hook
const { designStyle, handleSizeDragStart } = useCanvasMetrics(currentScale);

// 使用 design hook
const {
    components,
    highlightArea,
    guideLines,
    hasCollision,
    isDragging,
    draggingComponentId,
    activeComponentId,
    handleDragOver,
    handleDragLeave,
    handleDrop,
    handleComponentMouseDown,
    handleResizeStart,
} = useDesignSystem(designContainerRefs);

/**
 * 处理画布点击事件
 */
function handleCanvasClick(e: MouseEvent) {
    // 只有点击的是画布本身才选中
    if (e.target === designContainerRefs.value) {
        design.isCanvasSelected = true;
        design.setActiveComponent(null);
    } else {
        // 点击的是画布内的其他元素，取消选中
        design.isCanvasSelected = false;
    }
}

/**
 * 全局点击处理，检查是否点击了画布以外的区域
 */
function handleGlobalClick(e: MouseEvent) {
    // 检查点击的元素是否在画布容器内
    const has1 = (e.target as HTMLElement).classList.contains("workspace");
    const has2 = (e.target as HTMLElement).classList.contains("zoom-container");

    if (has1 || has2) {
        // 点击了画布以外的区域，取消选中
        design.isCanvasSelected = false;
        design.setActiveComponent(null);
    }
}

defineShortcuts({
    delete: () => {
        if (activeComponentId.value) {
            design.removeComponent(activeComponentId.value);
        }
    },
});

onMounted(() => {
    // 添加全局点击监听
    document.addEventListener("click", handleGlobalClick);
});

onUnmounted(() => {
    // 移除全局点击监听
    document.removeEventListener("click", handleGlobalClick);
});
</script>

<template>
    <div
        class="relative h-full w-full"
        :class="{ 'no-repeat bg-cover bg-center': design.configs.backgroundType !== 'solid' }"
        :style="
            design.configs.backgroundType === 'solid'
                ? {
                      backgroundColor:
                          colorMode === 'light'
                              ? design.configs.backgroundColor
                              : design.configs.backgroundDarkColor,
                  }
                : { backgroundImage: `url(${design.configs.backgroundImage})` }
        "
    >
        <div
            ref="designContainerRefs"
            class="design-container relative"
            :class="{ 'canvas-selected': design.isCanvasSelected }"
            :style="designStyle"
            @click.stop="handleCanvasClick"
            @dragover.prevent="handleDragOver"
            @dragleave.prevent="handleDragLeave"
            @drop.prevent="handleDrop"
        >
            <!-- 高亮区域 -->
            <HighlightArea :area="highlightArea" :has-collision="hasCollision" />

            <!-- 辅助线 -->
            <GuideLines :lines="guideLines" />

            <!-- 组件列表 -->
            <ComponentContainer
                v-for="component in components"
                :key="component.id"
                :component="component"
                :is-active="component.id === activeComponentId"
                :is-dragging="isDragging && component.id === draggingComponentId"
                :has-collision="hasCollision && component.id === draggingComponentId"
                @mousedown="(e: MouseEvent) => handleComponentMouseDown(component, e)"
                @resize-start="
                    (direction: string, e: MouseEvent) => handleResizeStart(component, direction, e)
                "
            />

            <!-- 安全区域标记 -->
            <template v-if="DESIGN_CONFIG.DEFAULT_WIDTH === 1920 && design.showSafeArea">
                <div
                    class="safe-area-marker h-full"
                    :style="{
                        left: `${(DESIGN_CONFIG.DEFAULT_WIDTH - DESIGN_CONFIG.SAFE_AREA_WIDTH) / 2}px`,
                    }"
                >
                    <div class="safe-area-marker-line" />
                </div>

                <div
                    class="safe-area-marker h-full"
                    :style="{
                        right: `${(DESIGN_CONFIG.DEFAULT_WIDTH - DESIGN_CONFIG.SAFE_AREA_WIDTH) / 2}px`,
                    }"
                >
                    <div class="safe-area-marker-line" />
                </div>
            </template>

            <!-- 画布边框线条，只在选中画布时显示 -->
            <template v-if="design.isCanvasSelected">
                <!-- 顶部线条（仅显示，不可拖拽） -->
                <div class="canvas-border-line canvas-border-top" />

                <!-- 右侧线条（仅显示，不可拖拽） -->
                <div class="canvas-border-line canvas-border-right" />

                <!-- 底部拖拽线条（可拖拽调整高度） -->
                <div
                    class="canvas-resize-line canvas-resize-bottom"
                    @mousedown.stop="handleSizeDragStart"
                />

                <!-- 左侧线条（仅显示，不可拖拽） -->
                <div class="canvas-border-line canvas-border-left" />

                <!-- 尺寸显示 -->
                <div class="canvas-size-display">
                    {{ designStyle.width }} × {{ designStyle.height }}
                </div>
            </template>
        </div>
    </div>
</template>

<style lang="scss" scoped>
.screen-marker {
    position: absolute;
    left: 0;
    display: flex;
    align-items: center;
    pointer-events: none;
    z-index: 10;

    &-line {
        width: 100%;
        height: 1px;
        background-color: #f56c6c;
    }

    &-label {
        position: absolute;
        right: 0;
        top: -20px;
        padding: 2px 6px;
        background-color: #f56c6c;
        color: #fff;
        font-size: 12px;
        border-radius: 4px;
    }
}

.safe-area-marker {
    position: absolute;
    top: 0;
    display: flex;
    align-items: center;
    pointer-events: none;
    z-index: 10;

    &-line {
        height: 100%;
        width: 1px;
        background: linear-gradient(to bottom, #c3c3c3 50%, transparent 50%);
        background-size: 2px 10px;
    }
}

// 画布边框线条样式（仅显示，不可拖拽）
.canvas-border-line {
    position: absolute;
    background-color: var(--color-primary-500);
    z-index: 20;
    pointer-events: none;
    border-radius: 2px;
}

// 画布拖拽线条样式（可拖拽）
.canvas-resize-line {
    position: absolute;
    background-color: var(--color-primary-500);
    z-index: 21;
    cursor: s-resize;
    border-radius: 2px;

    &:hover {
        background-color: #40a9ff;
        box-shadow: 0 0 4px rgba(64, 169, 255, 0.5);
    }
}

// 顶部边框线
.canvas-border-top {
    top: -2px;
    left: 0;
    right: 0;
    height: 4px;
}

// 右侧边框线
.canvas-border-right {
    top: 0;
    bottom: 0;
    right: -2px;
    width: 4px;
}

// 底部拖拽线（可拖拽调整高度）
.canvas-resize-bottom {
    bottom: -2px;
    left: 0;
    right: 0;
    height: 4px;

    // 添加一个更明显的拖拽指示器
    &::before {
        content: "";
        position: absolute;
        left: 50%;
        top: 50%;
        transform: translate(-50%, -50%);
        width: 20px;
        height: 2px;
        background-color: rgba(255, 255, 255, 0.8);
        border-radius: 1px;
        transition: all 0.2s ease;
    }

    &:hover::before {
        width: 30px;
        background-color: white;
    }
}

// 左侧边框线
.canvas-border-left {
    top: 0;
    bottom: 0;
    left: -2px;
    width: 4px;
}

// 尺寸显示
.canvas-size-display {
    position: absolute;
    top: -30px;
    left: 50%;
    transform: translateX(-50%);
    background: var(--color-primary-500);
    color: white;
    padding: 4px 8px;
    border-radius: 4px;
    font-size: 12px;
    white-space: nowrap;
    pointer-events: none;
    z-index: 22;

    &::after {
        content: "";
        position: absolute;
        top: 100%;
        left: 50%;
        transform: translateX(-50%);
        border: 4px solid transparent;
        border-top-color: var(--color-primary-500);
    }
}

// 画布选中状态样式
.canvas-selected {
    outline: 2px solid var(--color-primary-500);
    outline-offset: -2px;
}
</style>
