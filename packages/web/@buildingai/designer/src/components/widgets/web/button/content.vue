<script lang="ts" setup>
/**
 * 按钮组件
 * @description 用于展示可点击按钮的组件，支持多种样式和交互配置
 */
import { computed, type CSSProperties } from "vue";

import { navigateToWeb } from "@/utils/helper";

import WidgetsBaseContent from "../../base/widgets-base-content.vue";
import type { Props } from "./config";

const props = defineProps<Props>();

/**
 * 按钮自定义样式计算
 */
const buttonStyle = computed<CSSProperties>(() => ({
    fontSize: `${props.fontSize}px`,
    fontWeight: props.fontWeight,
    color: props.textColor,
    borderWidth: `${props.borderWidth}px`,
    borderColor: props.borderColor,
}));
</script>

<template>
    <WidgetsBaseContent
        :style="props.style"
        :override-bg-color="true"
        custom-class="button-content"
    >
        <template #default="{ style }">
            <UButton
                :label="props.label"
                :color="props.color"
                :variant="props.variant"
                :size="props.buttonSize"
                :disabled="props.disabled"
                :block="props.block"
                :square="props.square"
                :leading-icon="props.leadingIcon || undefined"
                :trailing-icon="props.trailingIcon || undefined"
                :style="buttonStyle"
                class="button-widget"
                @click="!props.disabled && navigateToWeb(props.to)"
            />
        </template>
    </WidgetsBaseContent>
</template>

<style lang="scss" scoped>
.button-content {
    display: flex;
    align-items: center;
    justify-content: center;
    overflow: hidden;

    .button-widget {
        transition: all 0.2s ease-in-out;

        &:hover {
            transform: translateY(-1px);
            box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
        }

        &:active {
            transform: translateY(0);
        }

        &:disabled {
            cursor: not-allowed;
            opacity: 0.6;
            transform: none;
            box-shadow: none;
        }
    }
}
</style>
