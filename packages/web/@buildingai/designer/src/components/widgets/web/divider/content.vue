<script lang="ts" setup>
/**
 * 辅助线组件
 * @description 用于展示水平分割线，支持多种线条样式和颜色自定义
 */
import { computed, type CSSProperties } from "vue";

import WidgetsBaseContent from "../../base/widgets-base-content.vue";
import type { Props } from "./config";

const props = defineProps<Props>();

/**
 * 计算容器样式
 */
const containerStyle = computed<CSSProperties>(() => ({
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
}));

/**
 * 计算分割线样式
 */
const dividerStyle = computed<CSSProperties>(() => ({
    borderTop: `${props.lineWidth}px ${props.lineStyle} ${props.lineColor}`,
    width: "100%",
}));
</script>

<template>
    <WidgetsBaseContent :style="props.style">
        <div class="divider-content" :style="containerStyle">
            <div class="divider-line" :style="dividerStyle" />
        </div>
    </WidgetsBaseContent>
</template>

<style lang="scss" scoped>
.divider-content {
    width: 100%;
    height: 100%;
    overflow: hidden;

    .divider-line {
        flex: 1;
    }
}
</style>
