<script setup lang="ts" generic="T = any">
/**
 * Widgets 基础内容组件
 * @description 为所有widget组件提供统一的样式处理和内容包装
 */
import { computed, type CSSProperties } from "vue";

export interface BaseWidgetStyle {
    /** 背景颜色 */
    bgColor?: string;
    /** 根容器背景颜色 */
    rootBgColor?: string;
    /** 上圆角 */
    borderRadiusTop?: number;
    /** 下圆角 */
    borderRadiusBottom?: number;
    /** 内边距-上 */
    paddingTop?: number;
    /** 内边距-右 */
    paddingRight?: number;
    /** 内边距-下 */
    paddingBottom?: number;
    /** 内边距-左 */
    paddingLeft?: number;
    [key: string]: any;
}

interface Props {
    /** 组件样式配置 */
    style: BaseWidgetStyle;
    /** 是否使用style.bgColor覆盖背景色 */
    overrideBgColor?: boolean;
    /** 自定义额外样式 */
    customStyles?: CSSProperties;
    /** 自定义CSS类名 */
    customClass?: string;
}

const props = withDefaults(defineProps<Props>(), {
    overrideBgColor: false,
    customStyles: () => ({}),
    customClass: "",
});

const contentRef = ref<HTMLElement>();

/**
 * 🎨 计算外层容器样式（根背景 + padding）
 */
const rootStyles = computed<CSSProperties>(() => {
    return {
        backgroundColor: props.style.rootBgColor || "transparent",
        paddingTop: props.style.paddingTop ? `${props.style.paddingTop}px` : "0",
        paddingRight: props.style.paddingRight ? `${props.style.paddingRight}px` : "0",
        paddingBottom: props.style.paddingBottom ? `${props.style.paddingBottom}px` : "0",
        paddingLeft: props.style.paddingLeft ? `${props.style.paddingLeft}px` : "0",
        ...props.customStyles,
    };
});

/**
 * 🎨 计算内层容器样式（组件背景 + 圆角）
 */
const contentStyles = computed<CSSProperties>(() => {
    return {
        backgroundColor: props.style.bgColor || "transparent",
        borderTopLeftRadius: props.style.borderRadiusTop ? `${props.style.borderRadiusTop}px` : "0",
        borderTopRightRadius: props.style.borderRadiusTop
            ? `${props.style.borderRadiusTop}px`
            : "0",
        borderBottomLeftRadius: props.style.borderRadiusBottom
            ? `${props.style.borderRadiusBottom}px`
            : "0",
        borderBottomRightRadius: props.style.borderRadiusBottom
            ? `${props.style.borderRadiusBottom}px`
            : "0",
    };
});

/**
 * 🔧 工具函数 - 提供给子组件使用
 */
const getSpacing = (value?: number) => (value ? `${value}px` : "0");
const getBorderRadius = (radius?: number) => (radius ? `${radius}px` : "0");

// 暴露工具函数给子组件
defineExpose({
    getSpacing,
    getBorderRadius,
    style: props.style,
});
</script>

<template>
    <div class="widgets-base-root h-full w-full" :class="customClass" :style="rootStyles">
        <div ref="contentRef" class="widgets-base-content h-full w-full" :style="contentStyles">
            <slot :get-spacing="getSpacing" :get-border-radius="getBorderRadius" :style="style" />
        </div>
    </div>
</template>

<style scoped>
.widgets-base-root {
    box-sizing: border-box;
    position: relative;
}

.widgets-base-content {
    box-sizing: border-box;
    position: relative;
}
</style>
