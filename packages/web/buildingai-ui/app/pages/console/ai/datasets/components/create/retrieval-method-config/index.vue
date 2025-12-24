<script lang="ts" setup>
import type { RetrievalConfig } from "@buildingai/service/consoleapi/ai-datasets";

const OptionCard = defineAsyncComponent(() => import("../option-card/index.vue"));
const RetrievalParamConfig = defineAsyncComponent(() => import("./retrieval-param.vue"));

const props = defineProps<{
    modelValue: RetrievalConfig;
}>();

const emit = defineEmits<{
    "update:modelValue": [value: RetrievalConfig];
}>();

const retrievalConfig = useVModel(props, "modelValue", emit);

function handleModeChange(mode: "vector" | "fullText" | "hybrid") {
    const currentStrategy = retrievalConfig.value.strategy;
    retrievalConfig.value.retrievalMode = mode;

    if (currentStrategy && mode !== "hybrid") {
        retrievalConfig.value.strategy = currentStrategy;
    }

    if (mode === "hybrid" && !retrievalConfig.value.strategy) {
        retrievalConfig.value.strategy = "weighted_score";
    }
}
</script>

<template>
    <div class="space-y-3">
        <!-- 向量检索 -->
        <OptionCard
            :title="$t('ai-datasets.backend.retrieval.vector')"
            :description="$t('ai-datasets.backend.retrieval.vectorDesc')"
            icon="i-heroicons-squares-2x2"
            icon-class="text-purple-500"
            selected-header-class="!to-muted !from-purple-50"
            :selected="retrievalConfig.retrievalMode === 'vector'"
            @click="handleModeChange('vector')"
        >
            <RetrievalParamConfig v-model="retrievalConfig" />
        </OptionCard>

        <!-- 全文检索 -->
        <OptionCard
            :title="$t('ai-datasets.backend.retrieval.fullText')"
            :description="$t('ai-datasets.backend.retrieval.fullTextDesc')"
            icon="i-heroicons-document-text"
            icon-class="text-blue-500"
            selected-header-class="!to-muted !from-blue-50"
            :selected="retrievalConfig.retrievalMode === 'fullText'"
            @click="handleModeChange('fullText')"
        >
            <RetrievalParamConfig v-model="retrievalConfig" />
        </OptionCard>

        <!-- 混合检索 -->
        <OptionCard
            :title="$t('ai-datasets.backend.retrieval.hybrid')"
            :description="$t('ai-datasets.backend.retrieval.hybridDesc')"
            icon="i-heroicons-squares-2x2"
            icon-class="text-indigo-500"
            selected-header-class="!to-muted !from-indigo-50"
            :selected="retrievalConfig.retrievalMode === 'hybrid'"
            @click="handleModeChange('hybrid')"
        >
            <RetrievalParamConfig v-model="retrievalConfig" />
        </OptionCard>
    </div>
</template>
