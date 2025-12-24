<script lang="ts" setup>
/**
 * 文本组件
 * @description 用于展示文本内容的组件，支持文字样式和布局自定义
 */
import { computed, type CSSProperties } from "vue";

import WidgetsBaseContent from "../../base/widgets-base-content.vue";
import type { Props } from "./config";

const props = defineProps<Props>();

/**
 * 文本样式计算
 */
const textStyle = computed<CSSProperties>(() => ({
    fontSize: `${props.fontSize}px`,
    fontWeight: props.fontWeight,
    color: props.color,
    lineHeight: `${props.lineHeight}px`,
    textAlign: props.textAlign,
}));
</script>

<template>
    <WidgetsBaseContent :style="props.style" :override-bg-color="true" custom-class="text-content">
        <template #default="{ style }">
            <div class="text" :style="textStyle" v-html="props.content" />
        </template>
    </WidgetsBaseContent>
</template>

<style lang="scss" scoped>
.text-content {
    display: flex;
    align-items: center;
    overflow: hidden;

    .text {
        width: 100%;
        flex: 1;
        word-wrap: break-word;
        word-break: break-word;
    }
}
</style>
