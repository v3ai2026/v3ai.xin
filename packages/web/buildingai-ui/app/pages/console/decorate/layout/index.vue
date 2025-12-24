<script setup lang="ts">
const PreviewPanel = defineAsyncComponent(() => import("./components/preview-panel.vue"));
const PropertyPanel = defineAsyncComponent(() => import("./components/property-panel.vue"));
import { useLayoutStore } from "./stores/layout";

const layoutStore = useLayoutStore();
const { t } = useI18n();

/** Get current domain */
const currentDomain = ref("");
onMounted(() => {
    currentDomain.value = window.location.hostname;
});

/** 快速保存 */
const { lockFn: quickSave, isLock: saving } = useLockFn(async () => {
    try {
        await layoutStore.saveCurrentLayout();
        useMessage().success(t("decorate.layout.saveSuccess"), {
            description: t("decorate.layout.saveSuccessDescription"),
        });
    } catch (error) {
        console.error("保存失败:", error);
    }
});

/** 页面加载时从服务器获取配置 */
onMounted(() => layoutStore.loadLayoutFromServer());
</script>

<template>
    <div class="flex h-[calc(100vh-100px)] min-h-0 flex-col">
        <!-- 页面标题栏 -->
        <header class="bg-background pb-4">
            <div class="flex items-center justify-between">
                <div>
                    <h1 class="text-foreground text-2xl font-bold">
                        {{ t("decorate.layout.title") }}
                    </h1>
                </div>

                <div class="flex items-center space-x-3">
                    <UButton
                        icon="i-heroicons-cloud-arrow-up"
                        size="lg"
                        @click="quickSave"
                        :loading="saving"
                    >
                        {{ t("decorate.layout.saveConfig") }}
                    </UButton>
                </div>
            </div>
        </header>

        <!-- 编辑模式 -->
        <div class="flex h-full flex-1">
            <!-- 左侧配置面板 -->
            <PropertyPanel />

            <!-- 右侧预览面板 -->
            <SafariMockup :use-slot="true" :url="currentDomain" :height="'100%'">
                <PreviewPanel />
            </SafariMockup>
        </div>
    </div>
</template>
