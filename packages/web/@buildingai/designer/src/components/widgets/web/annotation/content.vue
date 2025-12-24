<script lang="ts" setup>
/**
 * 批注组件
 * @description 支持多种类型的批注提示，包括信息、成功、警告、错误等
 */
import { computed, type CSSProperties, ref } from "vue";

import WidgetsBaseContent from "../../base/widgets-base-content.vue";
import type { Props } from "./config";

const props = defineProps<Props>();

/**
 * 组件可见状态
 */
const visible = ref(true);

/**
 * 批注类型对应的默认配置
 */
const typeConfig = computed(() => {
    const configs = {
        info: {
            bgColor: "#eff6ff",
            borderColor: "#3b82f6",
            textColor: "#1e40af",
            icon: "i-heroicons-information-circle",
        },
        success: {
            bgColor: "#f0fdf4",
            borderColor: "#22c55e",
            textColor: "#15803d",
            icon: "i-heroicons-check-circle",
        },
        warning: {
            bgColor: "#fffbeb",
            borderColor: "#f59e0b",
            textColor: "#d97706",
            icon: "i-heroicons-exclamation-triangle",
        },
        error: {
            bgColor: "#fef2f2",
            borderColor: "#ef4444",
            textColor: "#dc2626",
            icon: "i-heroicons-x-circle",
        },
        note: {
            bgColor: "#f8fafc",
            borderColor: "#64748b",
            textColor: "#475569",
            icon: "i-heroicons-document-text",
        },
    };
    return configs[props.type] || configs.info;
});

/**
 * 批注容器样式计算
 */
const annotationStyle = computed<CSSProperties>(() => {
    const config = typeConfig.value;

    // 根据variant确定样式
    let backgroundColor = props.style.bgColor || config.bgColor;
    let borderColor = props.style.borderColor || config.borderColor;
    let textColor = props.style.textColor || config.textColor;

    if (props.variant === "solid") {
        backgroundColor = borderColor;
        textColor = "#ffffff";
    } else if (props.variant === "soft") {
        backgroundColor = backgroundColor;
        borderColor = "transparent";
    } else if (props.variant === "subtle") {
        backgroundColor = "transparent";
        borderColor = "transparent";
    }

    return {
        backgroundColor,
        borderColor,
        color: textColor,
        borderWidth: props.variant === "outline" ? "1px" : "0",
        borderStyle: "solid",
        borderRadius: `${props.borderRadius}px`,
        padding: `${props.style.paddingTop}px ${props.style.paddingRight}px ${props.style.paddingBottom}px ${props.style.paddingLeft}px`,
        position: "relative",
        display: "flex",
        alignItems: "flex-start",
        gap: "12px",
        ...(props.shadow !== "none" && {
            boxShadow: {
                sm: "0 1px 2px 0 rgb(0 0 0 / 0.05)",
                md: "0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)",
                lg: "0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)",
            }[props.shadow],
        }),
    };
});

/**
 * 图标样式
 */
const iconStyle = computed<CSSProperties>(() => ({
    color: "inherit",
    flexShrink: 0,
    marginTop: "2px",
}));

/**
 * 内容区域样式
 */
const contentAreaStyle = computed<CSSProperties>(() => ({
    flex: 1,
    minWidth: 0,
}));

/**
 * 标题样式
 */
const titleStyle = computed<CSSProperties>(() => ({
    fontWeight: "600",
    fontSize: "14px",
    lineHeight: "1.4",
    marginBottom: props.content ? "8px" : "0",
    color: "inherit",
}));

/**
 * 内容文字样式
 */
const textStyle = computed<CSSProperties>(() => ({
    fontSize: "14px",
    lineHeight: "1.5",
    color: "inherit",
    opacity: 0.9,
}));

/**
 * 关闭按钮样式
 */
const closeButtonStyle = computed<CSSProperties>(() => ({
    position: "absolute",
    top: `${props.style.paddingTop}px`,
    right: `${props.style.paddingRight}px`,
    color: "inherit",
    opacity: 0.6,
    cursor: "pointer",
    transition: "opacity 0.2s ease",
}));

/**
 * 处理关闭操作
 */
const handleClose = () => {
    visible.value = false;
};

/**
 * 获取显示的图标
 */
const displayIcon = computed(() => {
    return props.icon || typeConfig.value.icon;
});
</script>

<template>
    <WidgetsBaseContent
        v-if="visible"
        :style="props.style"
        :override-bg-color="true"
        custom-class="annotation-content"
    >
        <template #default="{ style }">
            <div :style="annotationStyle" class="annotation-wrapper">
                <!-- 图标 -->
                <div v-if="props.showIcon" :style="iconStyle" class="annotation-icon">
                    <UIcon :name="displayIcon" class="h-5 w-5" />
                </div>

                <!-- 内容区域 -->
                <div :style="contentAreaStyle" class="annotation-body">
                    <!-- 标题 -->
                    <div v-if="props.title" :style="titleStyle" class="annotation-title">
                        {{ props.title }}
                    </div>

                    <!-- 内容 -->
                    <div v-if="props.content" :style="textStyle" class="annotation-text">
                        {{ props.content }}
                    </div>
                </div>

                <!-- 关闭按钮 -->
                <div
                    v-if="props.closable"
                    :style="closeButtonStyle"
                    class="annotation-close"
                    @click="handleClose"
                    @mouseover="
                        (e) => {
                            const target = e.target as HTMLElement;
                            if (target) {
                                target.style.opacity = '1';
                            }
                        }
                    "
                    @mouseleave="
                        (e) => {
                            const target = e.target as HTMLElement;
                            if (target) {
                                target.style.opacity = '0.6';
                            }
                        }
                    "
                >
                    <UIcon name="i-heroicons-x-mark" class="h-4 w-4" />
                </div>
            </div>
        </template>
    </WidgetsBaseContent>
</template>

<style lang="scss" scoped>
.annotation-content {
    .annotation-wrapper {
        transition: all 0.2s ease;
        width: 100%;
        box-sizing: border-box;
    }

    .annotation-icon {
        display: flex;
        align-items: center;
        justify-content: center;
    }

    .annotation-body {
        word-wrap: break-word;
        overflow-wrap: break-word;
    }

    .annotation-title {
        margin: 0;
    }

    .annotation-text {
        margin: 0;
    }

    .annotation-close {
        &:hover {
            opacity: 1 !important;
        }
    }
}
</style>
