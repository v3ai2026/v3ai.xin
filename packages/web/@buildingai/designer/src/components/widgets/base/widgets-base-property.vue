<script setup lang="ts">
/**
 * Widgets 基础属性编辑器组件
 * @description 为所有widget组件提供统一的属性编辑面板结构
 */
import { computed, ref, watch } from "vue";
import { useI18n } from "vue-i18n";

import LayersPanel from "../../panels/layers-panel.vue";

interface Tab {
    label: string;
    value: string;
    icon?: string;
}

interface Props {
    /** 自定义标签页 (Custom tabs) */
    customTabs?: Tab[];
    /** 默认激活的标签页 (Default active tab) */
    defaultTab?: string;
    /** 是否显示图层标签页 (Whether to show layers tab) */
    showLayers?: boolean;
}

const { t } = useI18n();

const props = withDefaults(defineProps<Props>(), {
    customTabs: () => [],
    defaultTab: "content",
    showLayers: true,
});

// 默认标签页（使用国际化）
const defaultTabs = computed(() => [
    { label: t("console-widgets.propertyPanel.content"), value: "content" },
    { label: t("console-widgets.propertyPanel.style"), value: "style" },
]);

// 计算所有标签页
const allTabs = computed(() => {
    // 如果没有自定义标签页，使用默认的国际化标签页
    const tabs = props.customTabs.length > 0 ? [...props.customTabs] : [...defaultTabs.value];
    if (props.showLayers) {
        tabs.push({ label: t("console-widgets.propertyPanel.layers"), value: "layers" });
    }
    return tabs;
});

const globalActiveTab = (() => {
    if (typeof window !== "undefined") {
        if (!window.__DESIGNER_WIDGET_ACTIVE_TAB) {
            window.__DESIGNER_WIDGET_ACTIVE_TAB = props.defaultTab;
        }
        return window.__DESIGNER_WIDGET_ACTIVE_TAB;
    }
    return props.defaultTab;
})();

const activeTab = ref<string>(globalActiveTab);

watch(activeTab, (newTab) => {
    if (typeof window !== "undefined") {
        window.__DESIGNER_WIDGET_ACTIVE_TAB = newTab;
    }
});

watch(allTabs, (newTabs) => {
    const currentTabExists = newTabs.some((tab) => tab.value === activeTab.value);
    if (!currentTabExists) {
        activeTab.value = props.defaultTab;
    }
});

declare global {
    interface Window {
        __DESIGNER_WIDGET_ACTIVE_TAB?: string;
    }
}
</script>

<template>
    <div class="widgets-base-property relative h-full min-h-0 flex-1 overflow-auto">
        <!-- 标签页导航 -->
        <div class="bg-background sticky top-0 left-0 z-10 px-2 pt-2">
            <UTabs v-model="activeTab" :items="allTabs" size="md" />
        </div>

        <!-- 内容区域 -->
        <div class="relative h-[calc(100vh-180px)] px-0">
            <Transition name="slide" mode="out-in">
                <!-- 内容标签页 -->
                <template v-if="activeTab === 'content'" key="content">
                    <slot name="content" />
                </template>

                <!-- 样式标签页 -->
                <template v-else-if="activeTab === 'style'" key="style">
                    <slot name="style" />
                </template>

                <!-- 图层标签页 -->
                <div v-else-if="activeTab === 'layers'" key="layers" class="px-2">
                    <LayersPanel />
                </div>

                <!-- 自定义标签页 -->
                <template v-else :key="activeTab">
                    <slot :name="activeTab" />
                </template>
            </Transition>
        </div>
    </div>
</template>

<style lang="scss" scoped>
.widgets-base-property {
    background-color: var(--background, #ffffff);
    border-radius: 8px;
}

/* 切换动画 */
.slide-enter-active {
    transition:
        transform 0.2s ease-in-out,
        opacity 0.2s ease-in-out;
    will-change: transform, opacity;
}

.slide-enter-from {
    transform: translateY(20px);
    opacity: 0;
}

.slide-enter-to {
    transform: translateY(0);
    opacity: 1;
}
</style>
