<script lang="ts" setup>
/**
 * 段落组件
 * @description 富文本段落组件，支持HTML标签和样式混排，提供完整的文本格式化功能
 */
import { computed, type CSSProperties } from "vue";

import WidgetsBaseContent from "../../base/widgets-base-content.vue";
import type { Props } from "./config";

const props = defineProps<Props>();

/**
 * 段落容器样式计算
 */
const paragraphStyle = computed<CSSProperties>(() => ({
    fontSize: `${props.fontSize}px`,
    color: props.color,
    fontWeight: props.fontWeight,
    fontStyle: props.fontStyle,
    textDecoration: props.textDecoration,
    fontFamily: props.fontFamily,
    textAlign: props.textAlign,
    lineHeight: props.lineHeight,
    textIndent: `${props.textIndent}px`,
    marginBottom: `${props.marginBottom}px`,
    wordWrap: "break-word",
    wordBreak: "break-word",
    // 处理最大行数限制
    ...(props.maxLines > 0 && {
        display: "-webkit-box",
        WebkitLineClamp: props.maxLines,
        WebkitBoxOrient: "vertical",
        overflow: "hidden",
    }),
    // 处理超出隐藏
    ...(props.overflow === "hidden" &&
        props.maxLines === 0 && {
            overflow: "hidden",
        }),
    ...(props.overflow === "ellipsis" &&
        props.maxLines === 0 && {
            overflow: "hidden",
            textOverflow: "ellipsis",
            whiteSpace: "nowrap",
        }),
}));
</script>

<template>
    <WidgetsBaseContent
        :style="props.style"
        :override-bg-color="true"
        custom-class="paragraph-content"
    >
        <template #default="{ style }">
            <div :style="paragraphStyle" class="paragraph-wrapper">
                <BdMarkdown :content="props.content" />
            </div>
        </template>
    </WidgetsBaseContent>
</template>
