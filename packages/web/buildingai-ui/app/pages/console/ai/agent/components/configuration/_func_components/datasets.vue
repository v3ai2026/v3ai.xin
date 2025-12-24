<script setup lang="ts">
import type { Dataset } from "@buildingai/service/consoleapi/ai-datasets";
import { apiGetDatasetList } from "@buildingai/service/consoleapi/ai-datasets";

const props = defineProps<{
    modelValue: string[];
}>();

const emit = defineEmits<{
    (e: "update:modelValue", value: string[]): void;
}>();

const datasets = useVModel(props, "modelValue", emit);

const { t } = useI18n();
const isOpen = shallowRef<boolean>(false);

const datasetList = shallowRef<Dataset[]>([]);
const overview = shallowRef<Dataset[]>([]);
const selectedDataset = ref<Dataset[]>([]);

const retrievalModeLabels = {
    vector: { value: t("ai-datasets.backend.retrieval.vector"), color: "primary" },
    fullText: { value: t("ai-datasets.backend.retrieval.fullText"), color: "success" },
    hybrid: { value: t("ai-datasets.backend.retrieval.hybrid"), color: "warning" },
} as const;
type RetrievalMode = keyof typeof retrievalModeLabels;

const isSelected = computed(() => {
    return (dataset: Dataset) => {
        return selectedDataset.value.findIndex((item) => item.id === dataset.id) !== -1;
    };
});

const selectDataset = (dataset: Dataset) => {
    if (isSelected.value(dataset)) {
        const index = selectedDataset.value.findIndex((item) => item.id === dataset.id);
        selectedDataset.value.splice(index, 1);
        return;
    }
    selectedDataset.value.push(dataset);
};

const removeDataset = (index: number) => {
    selectedDataset.value.splice(index, 1);
    overview.value.splice(index, 1);
    datasets.value = selectedDataset.value.map((item) => item.id);
};

const handleSave = () => {
    datasets.value = selectedDataset.value.map((item) => item.id);
    overview.value = selectedDataset.value.map((item) => item);
    handleClose();
};

const handleOpen = () => {
    isOpen.value = true;
};

const handleClose = () => {
    isOpen.value = false;
};

const { lockFn: fetchDatasetList, isLock: loading } = useLockFn(async () => {
    try {
        const response = await apiGetDatasetList({ page: 1, pageSize: 9999 });
        datasetList.value = response.items || [];

        selectedDataset.value = datasetList.value.filter((dataset) =>
            datasets.value.includes(dataset.id),
        );
        overview.value = JSON.parse(JSON.stringify(selectedDataset.value));
    } catch (error) {
        console.error("get dataset list failed:", error);
    }
});

onMounted(() => fetchDatasetList());
</script>

<template>
    <div>
        <div class="bg-muted rounded-lg p-3">
            <div class="flex items-center justify-between">
                <div class="text-foreground flex items-center gap-1 text-sm font-medium">
                    {{ $t("ai-agent.backend.configuration.datasets") }}
                    <UTooltip :delay-duration="0" :ui="{ content: 'w-xs h-auto' }">
                        <UIcon name="i-lucide-circle-help" />
                        <template #content>
                            <div class="text-background text-xs">
                                {{ $t("ai-agent.backend.configuration.datasetsDesc") }}
                                <br />
                                {{ $t("ai-agent.backend.configuration.datasetsDesc2") }}
                            </div>
                        </template>
                    </UTooltip>
                </div>

                <UButton
                    size="sm"
                    color="primary"
                    variant="ghost"
                    class="flex items-center"
                    @click="handleOpen"
                >
                    <UIcon name="i-lucide-plus" />
                    <span>{{ $t("console-common.add") }}</span>
                </UButton>
            </div>

            <div class="space-y-3">
                <div
                    v-for="(item, index) in overview"
                    :key="index"
                    class="group bg-background mt-2 flex items-center gap-2 rounded-lg px-3 py-2"
                >
                    <div class="flex flex-1 items-center gap-2">
                        <div class="bg-primary-50 border-default flex rounded-lg border p-2">
                            <UIcon name="i-lucide-folder" class="text-primary size-4" />
                        </div>
                        <div class="text-foreground flex text-sm font-medium">
                            {{ item.name }}
                        </div>
                    </div>

                    <div class="flex items-center group-hover:hidden">
                        <UChip
                            :color="retrievalModeLabels[item.retrievalMode as RetrievalMode].color"
                            size="sm"
                        />
                        <span class="ml-3 text-xs">
                            {{ retrievalModeLabels[item.retrievalMode as RetrievalMode].value }}
                        </span>
                    </div>
                    <div class="hidden items-center group-hover:flex">
                        <UButton
                            size="xs"
                            color="error"
                            variant="ghost"
                            icon="i-lucide-trash"
                            @click="removeDataset(index)"
                        />
                    </div>
                </div>
            </div>
        </div>

        <!-- 添加知识库弹窗 -->
        <BdModal
            v-model:open="isOpen"
            :title="t('ai-agent.backend.configuration.datasetsTitle')"
            :description="t('ai-agent.backend.configuration.datasetsDesc')"
            :ui="{ content: 'max-w-md' }"
            @close="handleClose"
        >
            <!-- 加载中 -->
            <div class="flex h-90 flex-col items-center justify-center" v-if="loading">
                <UIcon name="i-lucide-loader-circle" class="animate-spin" />
                <span class="text-sm">{{ $t("common.loading") }}</span>
            </div>
            <div class="h-90" v-else-if="datasetList.length">
                <BdScrollArea class="h-full pr-3" :shadow="false">
                    <div
                        v-for="(item, index) in datasetList"
                        :key="index"
                        class="bg-background border-default mt-2 mb-2 flex cursor-pointer items-center gap-2 rounded-lg border px-3 py-2"
                        :class="{ 'bg-primary-50! border-primary!': isSelected(item) }"
                        @click="selectDataset(item)"
                    >
                        <div class="flex flex-1 items-center gap-2">
                            <div class="bg-muted border-default flex rounded-lg border p-2">
                                <UIcon name="i-lucide-folder" class="text-primary size-5" />
                            </div>
                            <div class="text-foreground flex text-sm font-medium">
                                {{ item.name }}
                            </div>
                        </div>

                        <div class="flex items-center group-hover:hidden">
                            <UChip
                                :color="
                                    retrievalModeLabels[item.retrievalMode as RetrievalMode].color
                                "
                                size="sm"
                            />
                            <span class="ml-3 text-xs">
                                {{ retrievalModeLabels[item.retrievalMode as RetrievalMode].value }}
                            </span>
                        </div>
                    </div>
                </BdScrollArea>
            </div>
            <div
                v-else
                class="text-muted-foreground flex flex-col items-center justify-center py-12"
            >
                <UIcon name="i-lucide-database" class="mb-3 h-8 w-8 opacity-50" />
                <span class="text-sm font-medium">
                    {{ $t("console-common.empty") }}
                </span>
            </div>
            <div class="mt-6 flex justify-end gap-2">
                <UButton color="neutral" variant="soft" size="lg" @click="handleClose">
                    {{ $t("console-common.cancel") }}
                </UButton>
                <UButton
                    color="primary"
                    size="lg"
                    type="submit"
                    :disabled="loading"
                    @click="handleSave"
                >
                    {{ $t("console-common.save") }}
                </UButton>
            </div>
        </BdModal>
    </div>
</template>
