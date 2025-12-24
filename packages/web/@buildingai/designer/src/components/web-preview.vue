<script setup lang="ts">
/**
 * 网页设计预览组件
 * @description 专门用于预览设计结果，模拟真实网页显示效果
 */
import { useColorMode } from "@vueuse/core";
import {
    computed,
    type CSSProperties,
    defineAsyncComponent,
    onMounted,
    onUnmounted,
    ref,
} from "vue";
import { useRouter } from "vue-router";

import { DESIGN_CONFIG } from "../config/design";
import { useDesignStore } from "../stores/design";
// 避免一次性注册所有组件，按需加载
const contentModules = import.meta.glob("../components/widgets/**/content.vue", { eager: false });

const router = useRouter();
const colorMode = useColorMode();
const designStore = useDesignStore();

const props = withDefaults(
    defineProps<{
        terminal?: DecorateScene;
        data?: ComponentConfig[];
        configs?: PageMateConfig | null;
        showToolbar?: boolean;
    }>(),
    {
        terminal: "web",
        data: () => [],
        configs: null,
        showToolbar: true,
    },
);

// 响应式窗口宽度
const windowWidth = ref(typeof window !== "undefined" ? window.innerWidth : 1920);

function resolveComponent(type: string) {
    const entry = Object.entries(contentModules).find(([path]) =>
        path.includes(`/${type}/content.vue`),
    );
    if (!entry) return null;
    const loader = entry[1] as any;
    return defineAsyncComponent(loader);
}

// 使用配置中的设计尺寸
const designWidth = computed(() => DESIGN_CONFIG.value.DEFAULT_WIDTH);
const designHeight = computed(() => DESIGN_CONFIG.value.DEFAULT_HEIGHT);
const centerZoneWidth = computed(() => DESIGN_CONFIG.value.SAFE_AREA_WIDTH);

// 居中区域定义
const centerZone = computed(() => ({
    left: (designWidth.value - centerZoneWidth.value) / 2,
    right: (designWidth.value - centerZoneWidth.value) / 2 + centerZoneWidth.value,
}));

/**
 * 判断组件是否在居中安全区域内
 */
function isInCenterZone(component: any) {
    const { position, size } = component;
    console.log(position, size);

    const componentLeft = position.x;
    const componentRight = position.x + size.width;

    // 组件完全在居中安全区域内
    return componentLeft >= centerZone.value.left && componentRight <= centerZone.value.right;
}

/**
 * 分类组件
 */
const categorizedComponents = computed(() => {
    const centerComponents: any[] = [];
    const outsideComponents: any[] = [];

    designStore.components.forEach((component: any) => {
        if (isInCenterZone(component)) {
            centerComponents.push(component);
        } else {
            outsideComponents.push(component);
        }
    });

    return { centerComponents, outsideComponents };
});

/**
 * 预览画布样式 - 全宽背景
 */
const canvasStyle = computed(() => {
    const configs = designStore.configs;

    const style: Record<string, any> = {
        width: "100%",
        minHeight: `${configs.pageHeight || designHeight.value}px`,
        backgroundColor: "#ffffff",
        position: "relative" as const,
    };

    // 背景设置
    if (configs.backgroundType === "solid") {
        style.backgroundColor =
            colorMode.value === "dark" ? configs.backgroundDarkColor : configs.backgroundColor;
    }
    if (configs.backgroundType === "image" && configs.backgroundImage) {
        style.backgroundImage = `url(${configs.backgroundImage})`;
        style.backgroundSize = "cover";
        style.backgroundPosition = "center";
        style.backgroundRepeat = "no-repeat";
    }

    return style;
});

/**
 * 居中内容区样式 - 始终mx-auto
 */
const centerContentStyle = computed<CSSProperties>(() => {
    const configs = designStore.configs;

    return {
        width: "100%",
        maxWidth: `${centerZoneWidth.value}px`,
        margin: "0 auto",
        position: "relative" as const,
        minHeight: `${configs.pageHeight || designHeight.value}px`,
        pointerEvents: "none",
    };
});

/**
 * 获取居中区域组件样式
 */
function getCenterComponentStyle(component: any) {
    // 映射到居中容器内，保持原尺寸
    const relativeX = component.position.x - centerZone.value.left;

    return {
        position: "absolute" as const,
        left: `${relativeX}px`,
        top: `${component.position.y}px`,
        width: `${component.size.width}px`,
        height: `${component.size.height}px`,
        zIndex: component.zIndex || 0,
        opacity: component.isHidden ? 0 : 1,
        pointerEvents: component.isHidden ? ("none" as const) : ("auto" as const),
        // 防止内容被拉伸
        overflow: "hidden",
        flexShrink: "0",
        flexGrow: "0",
    };
}

const webPreviewRef = ref<HTMLElement>();
const webPreviewWidth = ref(0);

/**
 * 获取区域外组件样式 - 简单的边距固定方案
 */
function getOutsideComponentStyle(component: any) {
    const currentScreenWidth = webPreviewWidth.value;

    let finalLeft: number;

    if (component.position.x < centerZone.value.left) {
        // 左侧组件：保持距离左边缘的固定距离
        finalLeft = component.position.x;
    } else {
        // 右侧组件：保持距离右边缘的固定距离
        const distanceFromRight = designWidth.value - component.position.x;
        finalLeft = currentScreenWidth - distanceFromRight;
    }

    return {
        position: "absolute" as const,
        left: `${finalLeft}px`,
        top: `${component.position.y}px`,
        width: `${component.size.width}px`,
        height: `${component.size.height}px`,
        zIndex: component.zIndex || 0,
        opacity: component.isHidden ? 0 : 1,
        pointerEvents: component.isHidden ? ("none" as const) : ("auto" as const),
        overflow: "hidden",
        flexShrink: "0",
        flexGrow: "0",
    };
}

const getWebPreviewWidth = () => {
    webPreviewWidth.value = webPreviewRef.value?.offsetWidth || 0;
};

onMounted(async () => {
    if (props.data && props.data.length > 0) {
        designStore.components = props.data;
        designStore.configs = props.configs || ({} as PageMateConfig);
    }
    webPreviewWidth.value = webPreviewRef.value?.offsetWidth || 0;

    // 监听窗口大小变化
    if (typeof window !== "undefined") {
        const handleResize = () => {
            windowWidth.value = window.innerWidth;
            getWebPreviewWidth();
        };

        window.addEventListener("resize", handleResize);

        // 清理监听器
        onUnmounted(() => {
            window.removeEventListener("resize", handleResize);
        });
    }
});
</script>

<template>
    <div ref="webPreviewRef" class="web-preview">
        <!-- 顶部工具栏 -->
        <div
            v-if="showToolbar"
            class="fixed top-4 left-4 z-50 rounded-lg border border-gray-200 bg-white/80 px-3 py-2 shadow-lg backdrop-blur-sm dark:bg-black/40"
        >
            <button
                type="button"
                class="inline-flex items-center gap-2 rounded-md px-2 py-1 text-sm hover:bg-gray-100 dark:hover:bg-gray-800"
                @click="router.back()"
            >
                <span aria-hidden>←</span>
                返回编辑
            </button>
        </div>

        <!-- 预览画布 - 正常网页效果 -->
        <div class="preview-canvas" :style="canvasStyle">
            <!-- 区域外组件 - 自适应定位在全屏画布上 -->
            <div
                v-for="component in categorizedComponents.outsideComponents"
                :key="`outside-${component.id}`"
                class="design-component"
                :style="getOutsideComponentStyle(component)"
            >
                <component :is="resolveComponent(component.type)" v-bind="component.props" />
            </div>

            <!-- 居中内容区 - 始终mx-auto -->
            <div class="content-container" :style="centerContentStyle">
                <!-- 渲染居中区域组件 -->
                <div
                    v-for="component in categorizedComponents.centerComponents"
                    :key="component.id"
                    class="design-component"
                    :style="getCenterComponentStyle(component)"
                >
                    <component :is="resolveComponent(component.type)" v-bind="component.props" />
                </div>

                <!-- 空状态 -->
                <!-- <div
                    v-if="categorizedComponents.centerComponents.length === 0"
                    class="flex h-screen w-full items-center justify-center"
                >
                    <div class="text-center">
                        <UIcon
                            name="i-lucide-layout-template"
                            class="mb-4 h-16 w-16 text-gray-400"
                        />
                        <h3 class="mb-2 text-lg font-semibold text-gray-800">暂无设计内容</h3>
                        <p class="text-accent-foreground mb-4">返回编辑器添加组件开始设计</p>
                        <UButton v-if="showToolbar" variant="outline" @click="router.back()">
                            返回编辑器
                        </UButton>
                    </div>
                </div> -->
            </div>
        </div>
    </div>
</template>

<style scoped>
.web-preview {
    overflow: auto;
    margin: 0;
    padding: 0;
    width: 100%;
    min-height: 100vh;
}

.preview-canvas {
    position: relative;
}

.design-component {
    /* 防止组件内容被拉伸变形 */
    flex-shrink: 0;
    flex-grow: 0;
    box-sizing: border-box;
}
</style>
