<script lang="ts" setup>
/**
 * 折叠面板组件
 * @description 用于展示可折叠面板的组件，支持多种布局和交互配置
 */
import { computed, type CSSProperties, ref, watch } from "vue";

import WidgetsBaseContent from "../../base/widgets-base-content.vue";
import type { Props } from "./config";

const props = defineProps<Props>();

// 本地状态管理
const localValue = ref<string | string[]>(props.defaultValue || []);

// 监听 modelValue 变化
watch(
    () => props.modelValue,
    (newValue) => {
        if (newValue !== undefined) {
            localValue.value = newValue;
        }
    },
    { immediate: true },
);

/**
 * 计算处理后的折叠面板项目
 */
const processedItems = computed(() => {
    return props.items.map((item, index) => ({
        ...item,
        value: item.value || index.toString(),
        label: item.label || `面板 ${index + 1}`,
        content: item.content || "",
        disabled: item.disabled || false,
    }));
});

/**
 * 计算内容区域样式
 */
const contentStyle = computed<CSSProperties>(() => ({
    backgroundColor: props.style.contentBgColor || undefined,
    color: props.style.contentTextColor || undefined,
    paddingTop: `${props.style.contentPaddingTop}px`,
    paddingRight: `${props.style.contentPaddingRight}px`,
    paddingBottom: `${props.style.contentPaddingBottom}px`,
    paddingLeft: `${props.style.contentPaddingLeft}px`,
}));

/**
 * 处理面板展开/收起事件
 */
const handleValueChange = (newValue: string | string[] | undefined) => {
    if (newValue !== undefined) {
        localValue.value = newValue;
        // 触发自定义事件（设计器中可以监听）
        console.log("折叠面板状态变化", { value: newValue });
    }
};
</script>

<template>
    <WidgetsBaseContent
        :style="props.style"
        :override-bg-color="true"
        custom-class="accordion-content"
    >
        <template #default="{ style }">
            <UAccordion
                :items="processedItems"
                :trailing-icon="props.trailingIcon"
                :label-key="props.labelKey"
                :collapsible="props.collapsible"
                :default-value="props.defaultValue"
                :model-value="localValue"
                :type="props.type"
                :disabled="props.disabled"
                :unmount-on-hide="props.unmountOnHide"
                class="accordion-widget"
                @update:model-value="handleValueChange"
            >
                <template #content="{ item }">
                    <div class="accordion-item-content" :style="contentStyle">
                        <p v-if="item.content" class="text-sm leading-relaxed">
                            {{ item.content }}
                        </p>
                        <div v-else class="text-sm italic opacity-60">暂无内容</div>
                    </div>
                </template>
            </UAccordion>
        </template>
    </WidgetsBaseContent>
</template>
