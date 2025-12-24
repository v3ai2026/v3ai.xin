<script lang="ts" setup>
/**
 * 网页组件
 * @description 带有设备外壳的网页展示组件，支持iPhone 16和浏览器外壳
 */
import { computed, type CSSProperties, ref } from "vue";

import WidgetsBaseContent from "../../base/widgets-base-content.vue";
import type { Props } from "./config";

const props = defineProps<Props>();

const isLoading = ref(true);

/**
 * 容器样式计算
 */
const containerStyle = computed<CSSProperties>(() => ({
    backgroundColor: props.style.bgColor,
    padding: `${props.style.paddingTop}px ${props.style.paddingRight}px ${props.style.paddingBottom}px ${props.style.paddingLeft}px`,
    height: "100%",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    gap: "16px",
}));

/**
 * 设备外壳样式
 */
const deviceFrameStyle = computed<CSSProperties>(() => {
    const baseStyle: CSSProperties = {
        position: "relative",
        borderRadius: props.deviceType === "mobile" ? "36px" : "12px",
        overflow: "hidden",
        boxShadow: "0 20px 40px rgba(0, 0, 0, 0.15), 0 10px 20px rgba(0, 0, 0, 0.1)",
    };

    if (props.deviceType === "mobile") {
        return {
            ...baseStyle,
            width: "300px",
            height: "650px",
            backgroundColor: props.deviceColor,
            padding: "8px",
        };
    } else {
        return {
            ...baseStyle,
            width: "100%",
            height: "100%",
            backgroundColor: "#f6f6f6",
            border: "1px solid #d1d1d1",
        };
    }
});

/**
 * 内容区域样式
 */
const contentAreaStyle = computed<CSSProperties>(() => {
    if (props.deviceType === "mobile") {
        return {
            width: "100%",
            height: "100%",
            borderRadius: "28px",
            overflow: "hidden",
            backgroundColor: "#000",
        };
    } else {
        return {
            width: "100%",
            height: "calc(100% - 70px)",
            marginTop: "70px",
            borderRadius: "0 0 8px 8px",
            overflow: "hidden",
        };
    }
});

/**
 * iframe样式
 */
const iframeStyle = computed<CSSProperties>(() => ({
    width: "100%",
    height: "100%",
    border: "none",
    transform: `scale(${props.scale})`,
    transformOrigin: "top left",
    pointerEvents: props.interactive ? "auto" : "none",
}));

/**
 * 处理iframe加载完成
 */
const handleIframeLoad = () => {
    isLoading.value = false;
};

/**
 * 处理iframe加载错误
 */
const handleIframeError = () => {
    isLoading.value = false;
};
</script>

<template>
    <WidgetsBaseContent
        :style="props.style"
        :override-bg-color="true"
        custom-class="webpage-content"
    >
        <template #default="{ style }">
            <div :style="containerStyle" class="webpage-container">
                <!-- 设备外壳 -->
                <div v-if="props.showFrame" :style="deviceFrameStyle" class="device-frame">
                    <!-- 移动设备外壳 -->
                    <template v-if="props.deviceType === 'mobile'">
                        <!-- iPhone 16 外壳 -->
                        <div class="mobile-frame">
                            <!-- 听筒和摄像头区域 -->
                            <div class="mobile-notch">
                                <svg width="100%" height="30" viewBox="0 0 300 30">
                                    <defs>
                                        <linearGradient
                                            id="notchGradient"
                                            x1="0%"
                                            y1="0%"
                                            x2="0%"
                                            y2="100%"
                                        >
                                            <stop offset="0%" style="stop-color: #3a3a3c" />
                                            <stop offset="100%" style="stop-color: #1d1d1f" />
                                        </linearGradient>
                                    </defs>
                                    <!-- 动态岛 - 调整高度 -->
                                    <rect
                                        x="100"
                                        y="6"
                                        width="100"
                                        height="18"
                                        rx="9"
                                        fill="url(#notchGradient)"
                                    />
                                </svg>
                            </div>

                            <!-- 屏幕内容区域 -->
                            <div :style="contentAreaStyle" class="mobile-screen">
                                <iframe
                                    v-if="props.url"
                                    :src="props.url"
                                    :style="iframeStyle"
                                    @load="handleIframeLoad"
                                    @error="handleIframeError"
                                    title="网页内容"
                                />

                                <!-- 加载状态 -->
                                <div v-if="isLoading" class="loading-overlay">
                                    <div class="loading-content">
                                        <UIcon
                                            name="i-lucide-refresh-cw"
                                            class="loading-icon animate-spin"
                                        />
                                        <span>{{ props.loadingText }}</span>
                                    </div>
                                </div>
                            </div>

                            <!-- Home Indicator -->
                            <div class="mobile-home-indicator">
                                <div class="home-bar"></div>
                            </div>
                        </div>
                    </template>

                    <!-- 桌面浏览器外壳 -->
                    <template v-else>
                        <!-- 浏览器标题栏 -->
                        <div class="browser-header">
                            <!-- 窗口控制按钮 -->
                            <div class="window-controls">
                                <div class="control-button close"></div>
                                <div class="control-button minimize"></div>
                                <div class="control-button maximize"></div>
                            </div>

                            <!-- 地址栏 - 延伸到右侧 -->
                            <div class="address-bar">
                                <div class="url-input">
                                    <UIcon name="i-lucide-lock" class="security-icon" />
                                    <span class="url-text">{{ props.url }}</span>
                                </div>
                            </div>

                            <!-- 右侧按钮区域 - 只保留刷新按钮 -->
                            <div class="browser-actions">
                                <UIcon name="i-lucide-rotate-ccw" class="action-icon" />
                            </div>
                        </div>

                        <!-- 浏览器内容区域 -->
                        <div :style="contentAreaStyle" class="browser-content">
                            <iframe
                                v-if="props.url"
                                :src="props.url"
                                :style="iframeStyle"
                                @load="handleIframeLoad"
                                @error="handleIframeError"
                                title="网页内容"
                            />

                            <!-- 加载状态 -->
                            <div v-if="isLoading" class="loading-overlay">
                                <div class="loading-content">
                                    <UIcon
                                        name="i-lucide-refresh-cw"
                                        class="loading-icon animate-spin"
                                    />
                                    <span>{{ props.loadingText }}</span>
                                </div>
                            </div>
                        </div>
                    </template>
                </div>

                <!-- 无外壳模式 - 直接显示iframe -->
                <div v-else class="direct-frame">
                    <iframe
                        v-if="props.url"
                        :src="props.url"
                        :style="iframeStyle"
                        @load="handleIframeLoad"
                        @error="handleIframeError"
                        title="网页内容"
                    />

                    <!-- 加载状态 -->
                    <div v-if="isLoading" class="loading-overlay">
                        <div class="loading-content">
                            <UIcon name="i-lucide-refresh-cw" class="loading-icon animate-spin" />
                            <span>{{ props.loadingText }}</span>
                        </div>
                    </div>
                </div>
            </div>
        </template>
    </WidgetsBaseContent>
</template>

<style lang="scss" scoped>
.webpage-content {
    height: 100%;

    .webpage-container {
        height: 100%;
        position: relative;
    }

    .device-frame {
        transition: all 0.3s ease;

        &:hover {
            transform: translateY(-2px);
            box-shadow:
                0 25px 50px rgba(0, 0, 0, 0.2),
                0 15px 30px rgba(0, 0, 0, 0.15);
        }
    }

    // 移动设备样式
    .mobile-frame {
        height: 100%;
        display: flex;
        flex-direction: column;
        position: relative;
    }

    .mobile-notch {
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        z-index: 10;
        display: flex;
        justify-content: center;
    }

    .mobile-screen {
        flex: 1;
        position: relative;
    }

    .mobile-home-indicator {
        position: absolute;
        bottom: 8px;
        left: 50%;
        transform: translateX(-50%);

        .home-bar {
            width: 134px;
            height: 5px;
            background-color: rgba(255, 255, 255, 0.3);
            border-radius: 2.5px;
        }
    }

    // 浏览器样式
    .browser-header {
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        height: 70px;
        background: linear-gradient(180deg, #f6f6f6 0%, #ebebeb 100%);
        border-bottom: 1px solid #d1d1d1;
        display: flex;
        align-items: center;
        padding: 0 12px;
        gap: 12px;
        z-index: 10;
    }

    .window-controls {
        display: flex;
        gap: 8px;

        .control-button {
            width: 12px;
            height: 12px;
            border-radius: 50%;
            cursor: pointer;
            transition: all 0.2s ease;

            &.close {
                background-color: #ff5f57;

                &:hover {
                    background-color: #ff4136;
                }
            }

            &.minimize {
                background-color: #ffbd2e;

                &:hover {
                    background-color: #ffab00;
                }
            }

            &.maximize {
                background-color: #28ca42;

                &:hover {
                    background-color: #1db954;
                }
            }
        }
    }

    .address-bar {
        flex: 1;

        .url-input {
            background-color: white;
            border: 1px solid #d1d1d1;
            border-radius: 6px;
            padding: 8px 12px;
            display: flex;
            align-items: center;
            gap: 8px;

            .security-icon {
                width: 14px;
                height: 14px;
                color: #22c55e;
            }

            .url-text {
                font-size: 13px;
                color: #374151;
                truncate: true;
            }
        }
    }

    .browser-actions {
        display: flex;
        gap: 8px;

        .action-icon {
            width: 16px;
            height: 16px;
            color: #6b7280;
            cursor: pointer;

            &:hover {
                color: #374151;
            }
        }
    }

    .browser-content {
        background-color: white;
    }

    // 加载状态
    .loading-overlay {
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background-color: rgba(255, 255, 255, 0.9);
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 20;

        .loading-content {
            display: flex;
            flex-direction: column;
            align-items: center;
            gap: 12px;

            .loading-icon {
                width: 24px;
                height: 24px;
                color: #3b82f6;
            }

            span {
                font-size: 14px;
                color: #6b7280;
            }
        }
    }

    // 直接模式
    .direct-frame {
        width: 100%;
        height: 100%;
        position: relative;
        border-radius: 8px;
        overflow: hidden;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
    }
}

// 深色模式支持
@media (prefers-color-scheme: dark) {
    .webpage-content {
        .browser-header {
            background: linear-gradient(180deg, #2d2d30 0%, #1e1e1e 100%);
            border-bottom-color: #404040;
        }

        .address-bar .url-input {
            background-color: #404040;
            border-color: #525252;
            color: #f3f4f6;
        }
    }
}
</style>
