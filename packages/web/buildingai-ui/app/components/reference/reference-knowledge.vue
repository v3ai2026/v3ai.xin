<script setup lang="ts">
import { formatDuration } from "@//utils/helper";

const { t } = useI18n();

interface KnowledgeReference {
    datasetId: string;
    datasetName: string;
    userContent: string;
    retrievalMode?: string;
    duration?: number;
    chunks: Array<{
        id: string;
        content: string;
        score: number;
        metadata?: Record<string, unknown>;
        fileName?: string;
        chunkIndex?: number;
    }>;
}

interface Props {
    references?: KnowledgeReference[];
}

withDefaults(defineProps<Props>(), {
    references: () => [],
});

// Retrieval mode mapping
const retrievalModeMap = {
    vector: t("common.datasets.retrieval.vector"),
    fullText: t("common.datasets.retrieval.fullText"),
    hybrid: t("common.datasets.retrieval.hybrid"),
} as const;
</script>

<template>
    <div v-if="references && references.length > 0" class="bg-muted mb-2 rounded-lg p-2">
        <UCollapsible
            class="group"
            v-for="(ref, index) in references"
            :key="index"
            :unmountOnHide="false"
        >
            <div
                class="flex w-full cursor-pointer flex-wrap items-center gap-2 text-xs select-none"
            >
                <UIcon name="i-lucide-hammer" class="text-primary size-4" />

                <div class="flex min-w-0 flex-1 flex-wrap items-center gap-2">
                    <div class="shrink-0">
                        {{ t("common.chat.knowledgeCall.start") }}
                        {{ t("common.chat.knowledgeCall.from") }}
                    </div>

                    <div
                        name="knowledge"
                        class="bg-primary/15 text-primary max-w-[50vw] truncate rounded px-2 py-1 text-xs sm:max-w-[20rem]"
                        :title="ref.datasetName"
                    >
                        {{ ref.datasetName }}
                    </div>

                    <div class="text-md shrink-0">
                        {{ t("common.chat.knowledgeCall.call") }}
                    </div>

                    <div
                        v-if="ref.retrievalMode"
                        name="knowledge"
                        class="bg-primary/15 text-primary max-w-[40vw] truncate rounded px-2 py-1 text-xs sm:max-w-[16rem]"
                        :title="
                            retrievalModeMap[ref.retrievalMode as keyof typeof retrievalModeMap]
                        "
                    >
                        {{ retrievalModeMap[ref.retrievalMode as keyof typeof retrievalModeMap] }}
                    </div>

                    <div class="shrink-0">
                        {{ t("common.chat.knowledgeCall.finished") }}
                    </div>

                    <div
                        v-if="ref.duration"
                        class="bg-secondary shrink-0 rounded px-2 py-1 text-xs"
                    >
                        {{ t("common.chat.toolCall.duration") }}
                        {{ formatDuration(ref.duration) }}
                    </div>
                </div>

                <UIcon
                    name="i-lucide-chevron-down"
                    class="ml-auto rotate-270 transition-transform duration-200 group-data-[state=open]:rotate-360"
                />
            </div>

            <template #content>
                <div class="mt-3 space-y-3">
                    <!-- Request section -->
                    <div class="bg-background rounded p-3">
                        <div class="text-foreground mb-2 text-xs font-medium">
                            {{ t("common.reference.request") }}
                        </div>
                        <div class="text-sm text-gray-800">
                            {{ ref?.userContent }}
                        </div>
                    </div>

                    <!-- Response section -->
                    <div class="bg-background rounded p-3">
                        <div class="text-foreground mb-2 text-xs font-medium">
                            {{ t("common.reference.response") }}
                        </div>
                        <div class="text-muted-foreground flex flex-col gap-2 text-sm">
                            <template v-for="(chunk, index) in ref?.chunks" :key="index">
                                <div>
                                    <span class="text-foreground font-bold">
                                        #chunk-{{ index + 1 }}:
                                    </span>
                                    {{ chunk.content }}
                                </div>
                            </template>
                        </div>
                    </div>
                </div>
            </template>
        </UCollapsible>
    </div>
</template>
