<script setup lang="ts">
import { defineAsyncComponent, onMounted, ref } from "vue";

import { setDesignConfig } from "../config/design";
import { useDesignStore } from "../stores/design";
import DesignerSkeleton from "./designer-skeleton.vue";
const ComponentPanel = defineAsyncComponent(() => import("./panels/component-panel.vue"));
const PropertyPanel = defineAsyncComponent(() => import("./panels/property-panel.vue"));
const WorkspacePanel = defineAsyncComponent(() => import("./panels/workspace-panel.vue"));

const design = useDesignStore();

// 加载状态
const isLoading = ref(true);

const props = withDefaults(
    defineProps<{
        designId: string;
        terminal?: DecorateScene;
    }>(),
    {
        designId: "",
        terminal: "web",
    },
);

onMounted(async () => {
    try {
        // 初始化设计面板数据为 PC，不指定场景类型（默认为普通页面）
        setDesignConfig(props.terminal as DecorateScene);
        if (design.components.length > 0) {
            return;
        }
        await design.getPages(props.designId);
    } catch (error) {
        console.error("设计器初始化失败:", error);
    } finally {
        isLoading.value = false;
    }
});

/**
 * 在组件卸载前重置所有状态
 * 确保离开页面时清空所有状态数据
 */
// onBeforeUnmount(() => {
//   route.name !== 'PCPreview' && design.resetState()
// })
</script>

<template>
    <!-- 骨架屏 -->
    <DesignerSkeleton v-if="isLoading" />

    <!-- 主要设计器内容 -->
    <template v-else>
        <!-- 左侧组件菜单 -->
        <ComponentPanel />

        <!-- 中心画布区域 -->
        <WorkspacePanel />

        <!-- 右侧属性面板 -->
        <PropertyPanel />
    </template>
</template>
