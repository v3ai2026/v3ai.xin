<script setup lang="ts">
/**
 * 侧边栏折叠/展开触发器组件
 */
defineProps<{
    /** 侧边栏是否折叠 */
    collapsed?: boolean;
}>();

const emit = defineEmits<{
    /** 折叠状态变化事件 */
    (e: "toggle"): void;
    /** 打开移动端菜单事件 */
    (e: "open-mobile-menu"): void;
}>();

/** 切换侧边栏状态 */
function toggleSidebar() {
    emit("toggle");
}
</script>

<template>
    <UTooltip :text="collapsed ? '展开菜单' : '收起菜单'" :delay-duration="0">
        <UButton
            data-sidebar="trigger"
            variant="ghost"
            color="neutral"
            size="xs"
            :ui="{ base: 'py-2' }"
            @click="toggleSidebar"
        >
            <template v-if="!collapsed">
                <UIcon name="i-lucide-panel-left-close" class="hidden size-4 md:flex" />
                <UIcon name="i-lucide-panel-left-open" class="size-4 md:hidden" />
            </template>
            <template v-else>
                <UIcon name="i-lucide-panel-left-open" class="size-4" />
            </template>
            <span class="sr-only">侧边栏切换</span>
        </UButton>
    </UTooltip>
</template>
