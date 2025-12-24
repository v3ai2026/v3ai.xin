<script lang="ts" setup>
/**
 * 二维码组件
 * @description 现代化的二维码组件，支持logo显示、标题显示等功能
 */
import QrcodeVue from "qrcode.vue";
import { computed, type CSSProperties } from "vue";

import WidgetsBaseContent from "../../base/widgets-base-content.vue";
import type { Props } from "./config";

const props = defineProps<Props>();

/**
 * 二维码容器样式计算
 */
const qrcodeStyle = computed<CSSProperties>(() => ({
    borderRadius: `${props.borderRadius}px`,
    backgroundColor: props.style.bgColor,
    padding: `${props.style.paddingTop}px ${props.style.paddingRight}px ${props.style.paddingBottom}px ${props.style.paddingLeft}px`,
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    gap: "16px",
    height: "100%",
    overflow: "hidden",
}));

/**
 * 二维码内容区域样式
 */
const qrcodeContentStyle = computed<CSSProperties>(() => ({
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: "12px",
    flex: 1,
    justifyContent: "center",
}));

/**
 * 标题样式
 */
const titleStyle = computed<CSSProperties>(() => ({
    fontSize: "16px",
    fontWeight: "600",
    color: "#1f2937",
    textAlign: "center",
    margin: "0",
    lineHeight: "1.4",
}));

/**
 * Logo设置计算属性
 */
const imageSettings = computed(() => {
    if (!props.showLogo || !props.logoSrc) {
        return undefined;
    }

    return {
        src: props.logoSrc,
        width: props.logoSize,
        height: props.logoSize,
        excavate: true, // 挖掘logo周围区域
    };
});

/**
 * 二维码有效内容检查
 */
const hasValidContent = computed(() => {
    return props.content && props.content.trim().length > 0;
});

/**
 * 占位符样式
 */
const placeholderStyle = computed<CSSProperties>(() => ({
    width: `${props.qrcodeSize}px`,
    height: `${props.qrcodeSize}px`,
    backgroundColor: "#f9fafb",
    border: "2px dashed #d1d5db",
    borderRadius: `${Math.min(props.borderRadius, 12)}px`,
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    gap: "8px",
    color: "#9ca3af",
}));
</script>

<template>
    <WidgetsBaseContent
        :style="props.style"
        :override-bg-color="true"
        custom-class="qrcode-content"
    >
        <template #default="{ style }">
            <div :style="qrcodeStyle" class="qrcode-wrapper">
                <div :style="qrcodeContentStyle" class="qrcode-content-area">
                    <!-- 标题 -->
                    <div
                        v-if="props.showTitle && props.title"
                        :style="titleStyle"
                        class="qrcode-title"
                    >
                        {{ props.title }}
                    </div>

                    <!-- 二维码内容 -->
                    <div class="qrcode-display">
                        <!-- 使用qrcode.vue组件 -->
                        <QrcodeVue
                            v-if="hasValidContent"
                            :value="props.content"
                            :size="props.qrcodeSize"
                            :margin="props.margin"
                            render-as="canvas"
                            :level="props.level"
                            :background="props.backgroundColor"
                            :foreground="props.foregroundColor"
                            :image-settings="imageSettings"
                            class="qrcode-component"
                        />

                        <!-- 占位符 -->
                        <div v-else :style="placeholderStyle" class="qrcode-placeholder">
                            <UIcon name="i-heroicons-qr-code" class="qrcode-placeholder-icon" />
                            <span class="qrcode-placeholder-text">请输入二维码内容</span>
                        </div>
                    </div>
                </div>
            </div>
        </template>
    </WidgetsBaseContent>
</template>

<style lang="scss" scoped>
.qrcode-content {
    height: 100%;

    .qrcode-wrapper {
        transition: all 0.3s ease;
        height: 100%;
        box-sizing: border-box;
    }

    .qrcode-content-area {
        width: 100%;
        height: 100%;
    }

    .qrcode-display {
        display: flex;
        justify-content: center;
        align-items: center;
    }

    .qrcode-component {
        border-radius: 8px;
        box-shadow:
            0 1px 3px 0 rgb(0 0 0 / 0.1),
            0 1px 2px -1px rgb(0 0 0 / 0.1);
        transition: all 0.2s ease;

        &:hover {
            box-shadow:
                0 4px 6px -1px rgb(0 0 0 / 0.1),
                0 2px 4px -2px rgb(0 0 0 / 0.1);
            transform: translateY(-1px);
        }
    }

    .qrcode-placeholder {
        transition: all 0.2s ease;

        &:hover {
            border-color: #9ca3af;
            background-color: #f3f4f6;
        }

        .qrcode-placeholder-icon {
            width: 40px;
            height: 40px;
            opacity: 0.6;
        }

        .qrcode-placeholder-text {
            font-size: 14px;
            font-weight: 500;
            text-align: center;
        }
    }

    .qrcode-title {
        word-wrap: break-word;
        overflow-wrap: break-word;
        max-width: 100%;
    }
}

// 深色模式支持
@media (prefers-color-scheme: dark) {
    .qrcode-content {
        .qrcode-title {
            color: #f9fafb;
        }

        .qrcode-placeholder {
            background-color: #374151;
            border-color: #6b7280;
            color: #d1d5db;

            &:hover {
                background-color: #4b5563;
                border-color: #9ca3af;
            }
        }
    }
}
</style>
