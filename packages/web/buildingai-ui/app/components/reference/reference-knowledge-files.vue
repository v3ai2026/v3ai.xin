<script setup lang="ts">
const { t } = useI18n();

interface KnowledgeChunk {
    id: string;
    content: string;
    score: number;
    fileName?: string;
    chunkIndex?: number;
    documentId: string;
    metadata?: Record<string, unknown>;
    datasetName?: string;
}

interface KnowledgeReference {
    datasetId: string;
    datasetName: string;
    userContent: string;
    retrievalMode?: string;
    duration?: number;
    chunks: KnowledgeChunk[];
}

interface Props {
    references?: KnowledgeReference[];
}

withDefaults(defineProps<Props>(), {
    references: () => [],
});

const router = useRouter();
function formatScore(score: number): string {
    return (score * 100).toFixed(0);
}

function openKnowledgeBase(datasetId: string, documentId: string) {
    router.push({
        path: useRoutePath("ai-datasets:detail", { id: datasetId }),
        query: {
            documentId: documentId,
        },
    });
}
</script>

<template>
    <div v-if="references && references.length > 0" class="space-y-3">
        <UPopover
            v-for="(ref, refIdx) in references"
            :key="refIdx"
            :ui="{ content: 'flex flex-col' }"
        >
            <UButton
                :label="ref?.chunks?.[0]?.fileName || ref?.chunks?.[0]?.datasetName"
                color="neutral"
                variant="ghost"
                class="w-full"
            />

            <template #content>
                <div
                    v-for="(chunk, idx) in ref.chunks"
                    :key="chunk.id"
                    class="group m-3 inline-block cursor-pointer space-y-2 rounded-lg text-xs"
                >
                    <!-- File header information -->
                    <div class="relative flex items-center justify-between gap-4">
                        <span
                            v-if="chunk.chunkIndex !== undefined"
                            class="text-muted-foreground ml-1"
                        >
                            #chunk {{ chunk.chunkIndex + 1 }}
                        </span>
                        <UButton
                            size="xs"
                            color="primary"
                            variant="soft"
                            icon="i-lucide-external-link"
                            class="top0 absolute right-0 hidden group-hover:flex"
                            @click="openKnowledgeBase(ref.datasetId, chunk.documentId)"
                        >
                            {{ t("common.reference.goToKnowledgeBase") }}
                        </UButton>
                    </div>

                    <!-- Content preview -->
                    <div class="bg-muted text-muted-foreground w-xs rounded p-2">
                        {{ chunk.content }}
                    </div>

                    <!-- Progress bar -->
                    <div class="flex items-center gap-4">
                        <span class="text-muted-foreground text-xs">
                            {{ chunk.content.length }} {{ t("common.reference.characters") }}
                        </span>
                        <div class="bg-accent h-2 w-20 rounded">
                            <div
                                class="bg-primary h-2 rounded transition-all duration-300"
                                :style="{ width: formatScore(chunk.score) + '%' }"
                            ></div>
                        </div>
                        <span class="text-muted-foreground text-xs">
                            {{ chunk.score.toFixed(3) }}
                        </span>
                    </div>

                    <USeparator v-if="idx !== ref.chunks.length - 1" />
                </div>
            </template>
        </UPopover>
    </div>
</template>
