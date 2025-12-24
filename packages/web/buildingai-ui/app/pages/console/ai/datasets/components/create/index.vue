<script lang="ts" setup>
import type { CreateDatasetParams, Dataset } from "@buildingai/service/consoleapi/ai-datasets";
import {
    apiCreateDataset,
    apiCreateDocument,
    apiCreateEmptyDataset,
} from "@buildingai/service/consoleapi/ai-datasets";

import { useStep } from "./useStep";

const TopBar = defineAsyncComponent(() => import("./top-bar/index.vue"));
const StepOne = defineAsyncComponent(() => import("./step-one/index.vue"));
const StepTwo = defineAsyncComponent(() => import("./step-two/index.vue"));
const StepThree = defineAsyncComponent(() => import("./step-three/index.vue"));

const props = defineProps<{
    /** 知识库 Id */
    id?: string;
    /** 知识库详情 */
    datasetsDetail?: Dataset;
}>();

const toast = useMessage();
const router = useRouter();
const { t } = useI18n();
const { step, STEPS, nextStep, changeStep } = useStep();

const datasets = reactive<CreateDatasetParams>({
    // 分段配置
    indexingConfig: {
        documentMode: "normal",
        parentContextMode: "paragraph",
        segmentation: {
            segmentIdentifier: "\\n\\n",
            maxSegmentLength: 1024,
            segmentOverlap: 50,
        },
        subSegmentation: {
            segmentIdentifier: "\\n",
            maxSegmentLength: 512,
        },
        preprocessingRules: {
            replaceConsecutiveWhitespace: false,
            removeUrlsAndEmails: false,
        },
        fileIds: [],
    },
    name: "",
    description: "",
    // 嵌入模型
    embeddingModelId: "",
    // 检索配置
    retrievalConfig: {
        retrievalMode: "hybrid",
        strategy: "weighted_score",
        topK: 3,
        scoreThreshold: 0.5,
        scoreThresholdEnabled: false,
        weightConfig: {
            semanticWeight: 0.7,
            keywordWeight: 0.3,
        },
        rerankConfig: {
            enabled: false,
            modelId: "",
        },
    },
});
const datasetsId = ref<string>(props.id ?? "");

const { lockFn: handleCreate } = useLockFn(async () => {
    try {
        // if create documents or create dataset 判断是否创建文档或者创建知识库
        if (props.id) {
            const { indexingConfig } = datasets;
            const params = {
                indexingConfig,
                datasetId: props.id,
                embeddingModelId: datasets.embeddingModelId,
            };
            await apiCreateDocument(params);
            refreshNuxtData(`dataset-detail-${props.id}`);
        } else {
            const result = await apiCreateDataset(datasets);
            datasetsId.value = result.id as string;
        }
        nextStep();
    } catch (error) {
        console.log("创建错误 => ", error);
    }
});

const handleCreateEmpty = async () => {
    if (!datasets.name || !datasets.name.trim()) {
        toast.error(t("ai-datasets.backend.settings.nameInput"));
        return;
    }
    if (!datasets.description || !datasets.description.trim()) {
        toast.error(t("ai-datasets.backend.settings.descriptionInput"));
        return;
    }
    if (!datasets.embeddingModelId) {
        toast.error(t("ai-datasets.backend.settings.embeddingModelInput"));
        return;
    }
    try {
        const result = await apiCreateEmptyDataset({
            name: datasets.name,
            description: datasets.description,
            embeddingModelId: datasets.embeddingModelId,
        });
        router.replace(useRoutePath("ai-datasets-documents:list", { id: result.id as string }));
    } catch (error) {
        console.error("创建空知识库失败", error);
    }
};

onMounted(() => {
    if (!props.id && !props.datasetsDetail?.id) {
        return false;
    }
    const datasetsDetail = props.datasetsDetail;
    (Reflect.ownKeys(datasets) as Array<keyof CreateDatasetParams>).forEach((key) => {
        if (datasetsDetail && Object.prototype.hasOwnProperty.call(datasetsDetail, key)) {
            datasets[key] = (datasetsDetail?.[key] as never) ?? datasets[key];
        }
    });
    datasets.indexingConfig.fileIds = [];
});
</script>

<template>
    <div class="create-dataset-container flex h-full flex-col">
        <div class="bg-background sticky top-0 z-10 flex">
            <UButton
                class="absolute top-1/2 -translate-y-[50%]"
                variant="link"
                color="neutral"
                :label="$t('ai-datasets.backend.dataset.title')"
                leading-icon="i-lucide-chevron-left"
                @click="
                    router.replace(
                        !!props.id
                            ? useRoutePath('ai-datasets-documents:list', { id: props.id })
                            : useRoutePath('ai-datasets:list'),
                    )
                "
            />
            <TopBar :steps="STEPS" :activeIndex="step" />
        </div>

        <div class="container mx-auto h-full pb-6">
            <!-- 步骤1 选择知识库数据 -->
            <div v-show="step === 1" class="flex h-full min-h-0 w-full">
                <StepOne
                    v-model:fileIds="datasets.indexingConfig.fileIds"
                    v-model:name="datasets.name"
                    v-model:description="datasets.description"
                    v-model:embeddingModelId="datasets.embeddingModelId"
                    :disabled="!!props.id"
                    @onStepChange="nextStep"
                    @createEmpty="handleCreateEmpty"
                />
            </div>
            <!-- 步骤2 分段与配置模型 -->
            <div v-show="step === 2" class="flex h-full min-h-0 w-full">
                <StepTwo
                    v-model:indexingConfig="datasets.indexingConfig"
                    v-model:retrievalConfig="datasets.retrievalConfig"
                    :disabled="!!props.datasetsDetail?.documentCount"
                    @onStepChange="changeStep"
                    @onCreate="handleCreate"
                />
            </div>
            <!-- 步骤3 完成知识库创建 -->
            <div v-if="step === 3" class="flex h-full min-h-0 w-full">
                <StepThree
                    :datasetsId="datasetsId"
                    :createData="datasets"
                    :isAddDocument="!!props.id"
                    :fileIds="datasets.indexingConfig.fileIds"
                />
            </div>
        </div>
    </div>
</template>
