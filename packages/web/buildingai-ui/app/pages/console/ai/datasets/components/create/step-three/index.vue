<script setup lang="ts">
import type {
    CreateDatasetParams,
    DatasetDocument,
    QueryDocumentParams,
} from "@buildingai/service/consoleapi/ai-datasets";
import { apiGetDocumentList } from "@buildingai/service/consoleapi/ai-datasets";

const props = defineProps<{
    /** 创建知识库的数据 */
    createData: CreateDatasetParams;
    /** 知识库 Id */
    datasetsId: string;
    /** 是否为添加文档模式 */
    isAddDocument?: boolean;
    /** 文件ID列表（用于筛选本次新增的文档） */
    fileIds?: string[];
}>();
const router = useRouter();
const { t } = useI18n();

const isAddDocumentMode = computed(() => props.isAddDocument && !!props.datasetsId);

const pageTitle = computed(() =>
    isAddDocumentMode.value
        ? t("ai-datasets.backend.create.stepThree.dataTitle")
        : t("ai-datasets.backend.create.stepThree.createTitle"),
);

const pageDescription = computed(() =>
    isAddDocumentMode.value
        ? t("ai-datasets.backend.create.stepThree.dataDesc")
        : t("ai-datasets.backend.create.stepThree.createDesc"),
);

const documentStatusTitle = computed(() =>
    paging.needPolling
        ? t("ai-datasets.backend.create.stepThree.documentEmbedding")
        : t("ai-datasets.backend.create.stepThree.documentEmbeddingSuccess"),
);

const queryParams = computed<QueryDocumentParams>(() => ({
    datasetId: props.datasetsId,
    page: 1,
    pageSize: 999,
    ...(isAddDocumentMode.value &&
        props.fileIds &&
        props.fileIds.length > 0 && {
            fileIds: props.fileIds.join(","),
        }),
}));

const { paging, getLists } = usePaging<DatasetDocument>({
    fetchFun: apiGetDocumentList,
    params: queryParams.value,
});

const { start: startPolling, clear: stopPolling } = usePollingTask(
    async (stopFn) => {
        await getLists();
        if (!paging.needPolling) {
            stopFn();
        }
    },
    { interval: 500 },
);

const getDocumentStatusColor = (status: string): string => {
    const colorMap = {
        processing: "text-warning",
        completed: "text-success",
        failed: "text-error",
        pending: "text-muted-foreground",
    };
    return colorMap[status as keyof typeof colorMap] || "text-muted-foreground";
};

const getStatusIcon = (status: string): string => {
    const iconMap = {
        processing: "i-lucide-loader-2 animate-spin",
        completed: "i-heroicons-check-circle",
        failed: "i-heroicons-x-circle",
        pending: "i-lucide-clock",
    };
    return iconMap[status as keyof typeof iconMap] || "i-lucide-help-circle";
};

const segmentModeText = computed(() => {
    const { documentMode } = props.createData.indexingConfig;
    const modeMap = {
        normal: t("ai-datasets.backend.create.segment.general"),
        hierarchical: t("ai-datasets.backend.create.segment.hierarchical"),
    };
    return (
        modeMap[documentMode as keyof typeof modeMap] ||
        t("ai-datasets.backend.create.segment.general")
    );
});

const preprocessingRulesText = computed(() => {
    const { preprocessingRules } = props.createData.indexingConfig;
    if (!preprocessingRules) return t("ai-datasets.backend.create.stepThree.no");

    const rules = [];
    if (preprocessingRules.replaceConsecutiveWhitespace) {
        rules.push(t("ai-datasets.backend.create.segment.replaceConsecutiveWhitespace"));
    }
    if (preprocessingRules.removeUrlsAndEmails) {
        rules.push(t("ai-datasets.backend.create.segment.removeUrlsAndEmails"));
    }
    return rules.length > 0 ? rules.join("、") : t("ai-datasets.backend.create.stepThree.no");
});

const retrievalModeText = computed(() => {
    const { retrievalMode } = props.createData.retrievalConfig;
    const modeMap = {
        vector: t("ai-datasets.backend.retrieval.vector"),
        fullText: t("ai-datasets.backend.retrieval.fullText"),
        hybrid: t("ai-datasets.backend.retrieval.hybrid"),
    };
    return (
        modeMap[retrievalMode as keyof typeof modeMap] || t("ai-datasets.backend.retrieval.vector")
    );
});

const retrievalSettingsText = computed(() => {
    const { retrievalConfig } = props.createData;
    const { weightConfig } = retrievalConfig;

    if (!weightConfig) return t("ai-datasets.backend.create.stepThree.default");

    const settings = [];
    if (retrievalConfig.topK) {
        settings.push(
            `${t("ai-datasets.backend.create.stepThree.returnCount")}: ${retrievalConfig.topK}`,
        );
    }
    if (retrievalConfig.scoreThreshold) {
        settings.push(
            `${t("ai-datasets.backend.retrieval.scoreThreshold")}: ${retrievalConfig.scoreThreshold}`,
        );
    }
    if (retrievalConfig.retrievalMode === "hybrid") {
        if (weightConfig.semanticWeight) {
            settings.push(
                `${t("ai-datasets.backend.retrieval.semanticWeight")}: ${weightConfig.semanticWeight}`,
            );
        }
        if (weightConfig.keywordWeight) {
            settings.push(
                `${t("ai-datasets.backend.retrieval.keywordWeight")}: ${weightConfig.keywordWeight}`,
            );
        }
    }

    return settings.length > 0
        ? settings.join("、")
        : t("ai-datasets.backend.create.stepThree.default");
});

watch(
    () => props.datasetsId,
    async () => {
        await nextTick();
        await getLists();
    },
    { immediate: true },
);

watch(
    () => paging.needPolling,
    (needPolling) => {
        if (needPolling) {
            startPolling();
        } else {
            stopPolling();
        }
    },
    { immediate: true },
);

onUnmounted(() => stopPolling());
</script>

<template>
    <div class="mx-auto inline-block w-3xl pt-10">
        <!-- 页面标题 -->
        <div class="mb-8">
            <h1 class="text-foreground text-xl font-semibold">{{ pageTitle }}</h1>
            <p class="text-muted-foreground">{{ pageDescription }}</p>
        </div>

        <!-- 知识库信息卡片 -->
        <div class="mb-8" v-if="!isAddDocumentMode">
            <div class="flex items-center gap-3">
                <div class="bg-primary-50 flex size-12 items-center justify-center rounded-lg">
                    <UIcon name="i-heroicons-book-open" class="text-primary h-6 w-6" />
                </div>
                <div class="flex-1">
                    <h3 class="text-foreground font-medium">{{ createData.name }}</h3>
                    <p class="text-muted-foreground">{{ createData.description }}</p>
                </div>
            </div>
        </div>

        <!-- 文档嵌入状态 -->
        <div class="mb-8">
            <h2 class="text-foreground mb-4 text-lg font-medium">{{ documentStatusTitle }}</h2>

            <!-- 文档处理状态 -->
            <div class="space-y-2">
                <div
                    class="bg-primary-50 flex items-center justify-between rounded-lg p-2"
                    v-for="document in paging.items"
                    :key="document.id"
                >
                    <div class="flex items-center gap-1">
                        <UIcon name="i-heroicons-document-text" class="text-primary size-5" />
                        <div class="flex flex-col">
                            <span class="text-foreground text-sm">
                                {{ document.fileName }}
                            </span>
                        </div>
                    </div>

                    <div class="flex items-center gap-3">
                        <!-- 状态图标和文本 -->
                        <div class="flex items-center gap-1">
                            <UIcon
                                :name="getStatusIcon(document.status) as string"
                                :class="`h-4 w-4 ${getDocumentStatusColor(document.status)}`"
                            />
                            <span class="text-primary text-xs">{{ document.progress || 0 }}%</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <USeparator />

        <!-- 配置详情 -->
        <div class="mt-4 space-y-4">
            <!-- 分段模式 -->
            <div class="flex justify-between py-2">
                <span class="text-muted-foreground">
                    {{ $t("ai-datasets.backend.create.stepThree.segmentMode") }}
                </span>
                <span class="text-foreground text-sm font-medium">{{ segmentModeText }}</span>
            </div>

            <!-- 最大分段长度 -->
            <div class="flex justify-between py-2">
                <span class="text-muted-foreground">
                    {{ $t("ai-datasets.backend.create.segment.maxSegmentLength") }}
                </span>
                <span class="text-foreground text-sm font-medium">
                    {{ createData.indexingConfig.segmentation?.maxSegmentLength || "默认" }}
                </span>
            </div>

            <!-- 文本预处理规则 -->
            <div class="flex justify-between py-2">
                <span class="text-muted-foreground">
                    {{ $t("ai-datasets.backend.create.segment.preprocessingRules") }}
                </span>
                <span class="text-foreground text-sm font-medium">
                    {{ preprocessingRulesText }}
                </span>
            </div>

            <!-- 检索模式 -->
            <div class="flex justify-between py-2">
                <span class="text-muted-foreground">{{
                    $t("ai-datasets.backend.common.retrievalMode")
                }}</span>
                <div class="flex items-center gap-2">
                    <UIcon name="i-heroicons-sparkles" class="h-4 w-4 text-purple-500" />
                    <span class="text-foreground text-sm font-medium">{{ retrievalModeText }}</span>
                </div>
            </div>

            <!-- 检索设置 -->
            <div class="flex justify-between py-2">
                <span class="text-muted-foreground">
                    {{ $t("ai-datasets.backend.settings.retrievalMethod") }}
                </span>
                <div class="flex items-center gap-2">
                    <UIcon name="i-heroicons-adjustments-horizontal" class="text-primary h-4 w-4" />
                    <span class="text-foreground text-sm font-medium">
                        {{ retrievalSettingsText }}
                    </span>
                </div>
            </div>

            <div class="flex justify-end">
                <UButton
                    trailing-icon="i-lucide-arrow-right"
                    :label="$t('ai-datasets.backend.create.goToDetail')"
                    size="lg"
                    @click="router.replace(`/console/datasets/${datasetsId}/documents`)"
                />
            </div>
        </div>
    </div>
</template>
