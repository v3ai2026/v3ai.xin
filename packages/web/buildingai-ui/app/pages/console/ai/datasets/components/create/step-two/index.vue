<script lang="ts" setup>
import type {
    IndexingConfig,
    IndexingSegmentsResponse,
    RetrievalConfig as RetrievalConfigType,
} from "@buildingai/service/consoleapi/ai-datasets";
import { apiIndexingSegments } from "@buildingai/service/consoleapi/ai-datasets";

const RetrievalMethodConfig = defineAsyncComponent(
    () => import("../retrieval-method-config/index.vue"),
);
const SegmentMethodConfig = defineAsyncComponent(
    () => import("../segment-method-config/index.vue"),
);
const SegmentPreview = defineAsyncComponent(() => import("../segment-preview/index.vue"));

const props = defineProps<{
    indexingConfig: IndexingConfig;
    retrievalConfig: RetrievalConfigType;
    disabled: boolean;
}>();
const emits = defineEmits<{
    (e: "update:retrievalConfig", v: RetrievalConfigType): void;
    (e: "onStepChange", v: number): void;
    (e: "onCreate", v: void): void;
    (e: "update:indexingConfig", v: IndexingConfig): void;
}>();

const indexingConfig = useVModel(props, "indexingConfig", emits);
const retrievalConfig = useVModel(props, "retrievalConfig", emits);

const segmentResults = reactive<IndexingSegmentsResponse>({
    totalSegments: 0,
    fileResults: [],
    processingTime: 0,
    processedFiles: 0,
});

const { lockFn: handlePreview, isLock } = useLockFn(async () => {
    try {
        const data = await apiIndexingSegments(indexingConfig.value);
        segmentResults.totalSegments = data.totalSegments;
        segmentResults.fileResults = data.fileResults;
        segmentResults.processingTime = data.processingTime;
        segmentResults.processedFiles = data.processedFiles;
    } catch (error) {
        console.error("预览失败:", error);
    }
});
</script>

<template>
    <div class="segmentation-configurator mx-auto h-full max-w-7xl">
        <div class="grid h-full grid-cols-1 gap-8 lg:grid-cols-2">
            <!-- 左侧：配置区域 -->
            <BdScrollArea class="table h-full pr-2" :shadow="false">
                <!-- 分段设置 -->
                <section class="space-y-2">
                    <h5 class="text-foreground text-sm font-medium">
                        {{ $t("ai-datasets.backend.create.stepTwo.segmentation") }}
                    </h5>
                    <SegmentMethodConfig
                        v-model="indexingConfig"
                        :is-previewing="isLock"
                        :on-preview-segments="handlePreview"
                    />
                </section>

                <!-- 检索设置 -->
                <section class="mt-4 space-y-4" :class="{ 'cursor-not-allowed': disabled }">
                    <h5 class="text-foreground text-sm font-medium">
                        {{ $t("ai-datasets.backend.settings.retrievalMethod") }}
                    </h5>
                    <RetrievalMethodConfig
                        v-model="retrievalConfig"
                        :class="{ 'pointer-events-none opacity-70': disabled }"
                    />
                </section>

                <!-- 创建按钮 -->
                <section class="flex justify-end gap-4 py-4">
                    <UButton size="lg" variant="outline" @click="emits('onStepChange', -1)">
                        {{ $t("ai-datasets.backend.create.previousStep") }}
                    </UButton>
                    <UButton size="lg" @click="emits('onCreate')">
                        {{ $t("ai-datasets.backend.create.saveAndCreate") }}
                    </UButton>
                </section>
            </BdScrollArea>

            <!-- 右侧：预览区域 -->
            <SegmentPreview :is-previewing="isLock" :results="segmentResults" />
        </div>
    </div>
</template>
