<script lang="ts" setup>
import type {
    DatasetDocument,
    DatasetSegment,
    QuerySegmentParams,
} from "@buildingai/service/consoleapi/ai-datasets";
import {
    apiBatchSetSegmentEnabled,
    apiGetAllDocumentList,
    apiGetSegmentList,
    apiSetSegmentEnabled,
} from "@buildingai/service/consoleapi/ai-datasets";

import type { DropdownMenuItem } from "#ui/types";

import { useDocumentActions, useSegmentActions, useSelection } from "../useDatasets";

const router = useRouter();
const { t } = useI18n();
const { hasAccessByCodes } = useAccessControl();
const { params: URLQueryParams, query: URLQuery } = useRoute();

const datasetId = computed(() => (URLQueryParams as Record<string, string>).id);
const documentId = computed({
    get: () => (URLQuery as Record<string, string>).documentId,
    set: (value) => {
        router.replace({
            query: { documentId: value },
        });
        searchForm.documentId = value;
        getLists();
    },
});

const { deleteDocument, renameDocument } = useDocumentActions();
const { deleteSegments, createSegment, editSegment } = useSegmentActions();

const { data: documentLists, refresh: refreshDocumentLists } = await useAsyncData(() =>
    apiGetAllDocumentList(datasetId.value as string),
);

const searchForm = reactive<QuerySegmentParams>({
    keyword: "",
    documentId: documentId.value,
    datasetId: datasetId.value,
    status: undefined,
});

const isCollapsed = shallowRef(true);

const { paging, getLists } = usePaging<DatasetSegment>({
    fetchFun: apiGetSegmentList,
    params: searchForm,
});

const { start: startPolling, clear: stopPolling } = usePollingTask(
    async (stopFn) => {
        await getLists();

        if (!paging.needPolling) {
            stopFn();
        }
    },
    {
        interval: 1000,
    },
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

const {
    selected: selectedSegments,
    isAll: isAllSelected,
    isIndeterminate,
    toggle: toggleSegmentSelection,
    toggleAll: toggleAllSelection,
    clear: clearSelection,
} = useSelection(
    computed(() => (paging?.items as DatasetSegment[]) || []),
    (item: DatasetSegment) => item.id,
);

const statusMap = {
    processing: { label: t("console-common.processing"), color: "warning" },
    completed: { label: t("console-common.completed"), color: "success" },
    failed: { label: t("console-common.failed"), color: "error" },
    pending: { label: t("console-common.pending"), color: "neutral" },
} as const;

const statusOptions = [
    { label: t("console-common.all"), value: undefined },
    { label: t("console-common.processing"), value: "processing" },
    { label: t("console-common.completed"), value: "completed" },
    { label: t("console-common.failed"), value: "failed" },
    { label: t("console-common.pending"), value: "pending" },
];

watch(
    () => [searchForm.keyword, searchForm.documentId, searchForm.status],
    () => {
        useDebounceFn(() => {
            paging.page = 1;
            getLists();
        }, 300)();
    },
    { deep: false, immediate: false },
);

const handleDelete = async (ids: string | string[]) => {
    await deleteSegments(ids, getLists);
    clearSelection();
};

const handleCreate = async () => {
    await createSegment(searchForm.documentId as string, getLists);
};

const handleEdit = async (segment: DatasetSegment) => {
    await editSegment(segment, getLists);
};

const handleDocumentDelete = async () => {
    await deleteDocument(searchForm.documentId as string, getLists);
    router.back();
};

const handleRename = async () => {
    const document = documentLists.value?.find(
        (item) => item.id === searchForm.documentId,
    ) as DatasetDocument;
    await renameDocument(document, getLists);
    refreshDocumentLists();
};

async function handleToggleEnabled(segment: DatasetSegment) {
    await apiSetSegmentEnabled(segment.id, segment.enabled ? 0 : 1);
    getLists();
}

async function handleBatchSetEnabled(enabled: number) {
    await apiBatchSetSegmentEnabled(Array.from(selectedSegments.value), enabled);
    clearSelection();
    getLists();
}

const currentDocument = computed(() => {
    return documentLists.value?.find((item) => item.id === searchForm.documentId);
});

onMounted(() => getLists());

definePageMeta({ layout: "full-screen" });
</script>

<template>
    <div class="flex h-full w-full flex-col">
        <div class="flex items-center justify-between gap-1 p-4">
            <div class="flex w-full items-center">
                <UButton
                    variant="ghost"
                    color="neutral"
                    class="rounded-full"
                    leading-icon="i-lucide-chevron-left"
                    @click="router.replace(`/console/datasets/${datasetId}/documents`)"
                />

                <USelect
                    v-model="searchForm.documentId"
                    :items="
                        documentLists?.map((item) => ({
                            label: item.fileName,
                            value: item.id,
                        })) || []
                    "
                    label-key="label"
                    value-key="value"
                    variant="none"
                />
            </div>

            <div class="flex items-center gap-2">
                <UButton
                    color="primary"
                    variant="outline"
                    icon="i-lucide-plus"
                    :label="t('ai-datasets.backend.segments.createSegment')"
                    @click="handleCreate"
                />

                <UDropdownMenu
                    :items="
                        [
                            hasAccessByCodes(['ai-datasets-documents:rename'])
                                ? {
                                      label: t('ai-datasets.backend.segments.rename'),
                                      icon: 'i-lucide-pen-line',
                                      onClick: () => {
                                          handleRename();
                                      },
                                  }
                                : null,
                            hasAccessByCodes(['ai-datasets-documents:delete'])
                                ? {
                                      label: t('console-common.delete'),
                                      icon: 'i-lucide-trash',
                                      color: 'error',
                                      onSelect: () => {
                                          handleDocumentDelete();
                                      },
                                  }
                                : null,
                        ].filter(Boolean) as DropdownMenuItem[]
                    "
                >
                    <UButton icon="i-lucide-ellipsis-vertical" color="primary" variant="outline" />
                </UDropdownMenu>
            </div>
        </div>

        <div class="pl-4">
            <USeparator />
        </div>

        <div class="bg-background mb-2 flex w-full justify-between gap-4 p-4 pl-6">
            <div class="flex items-center gap-3">
                <UCheckbox
                    :model-value="isAllSelected"
                    :indeterminate="isIndeterminate"
                    @update:model-value="toggleAllSelection"
                />
                <span class="text-sm font-semibold"
                    >{{ paging.total }} {{ t("ai-datasets.backend.segments.segment") }}</span
                >

                <UButton
                    v-if="selectedSegments.size > 0"
                    color="error"
                    variant="subtle"
                    :label="t('console-common.batchDelete')"
                    icon="i-heroicons-trash"
                    @click="handleDelete(Array.from(selectedSegments))"
                >
                    <template #trailing>
                        <UKbd>{{ selectedSegments.size }}</UKbd>
                    </template>
                </UButton>
                <UButton
                    v-if="selectedSegments.size > 0"
                    color="success"
                    variant="subtle"
                    :label="t('console-common.batchEnable')"
                    icon="i-heroicons-arrow-up-tray"
                    @click="handleBatchSetEnabled(1)"
                />
                <UButton
                    v-if="selectedSegments.size > 0"
                    color="error"
                    variant="subtle"
                    :label="t('console-common.batchDisable')"
                    icon="i-heroicons-arrow-down-tray"
                    @click="handleBatchSetEnabled(0)"
                />
            </div>

            <div class="flex items-center gap-2 md:ml-auto">
                <USelectMenu
                    v-model="searchForm.status as string"
                    :items="statusOptions"
                    :placeholder="t('console-common.status')"
                    class="w-30"
                    value-key="value"
                />

                <UInput
                    v-model="searchForm.keyword"
                    :placeholder="t('ai-datasets.backend.segments.searchPlaceholder')"
                    class="w-50"
                    icon="i-lucide-search"
                />

                <USeparator orientation="vertical" class="h-5" />

                <UTooltip
                    :text="
                        isCollapsed
                            ? t('ai-datasets.backend.segments.expandAll')
                            : t('ai-datasets.backend.segments.collapseAll')
                    "
                    :delayDuration="0"
                >
                    <UButton
                        variant="soft"
                        :icon="isCollapsed ? 'i-lucide-list-plus' : 'i-lucide-list-x'"
                        @click="isCollapsed = !isCollapsed"
                    />
                </UTooltip>
            </div>
        </div>

        <ClientOnly>
            <div
                v-if="!paging.loading && paging.items.length === 0"
                class="bg-background flex h-full items-center justify-center"
            >
                <div class="text-center">
                    <UIcon
                        name="i-lucide-file-text"
                        class="text-muted-foreground mx-auto mb-4 h-12 w-12"
                    />
                    <p class="text-muted-foreground text-sm">
                        {{ t("ai-datasets.backend.segments.noData") }}
                    </p>
                </div>
            </div>
        </ClientOnly>

        <div class="flex h-full flex-1">
            <BdScrollArea class="table h-full w-full px-6">
                <div
                    v-for="segment in paging.items"
                    :key="segment.id"
                    class="group relative mb-2 flex items-stretch gap-4"
                >
                    <div class="pt-3">
                        <UCheckbox
                            :model-value="selectedSegments.has(segment.id)"
                            @update:model-value="() => toggleSegmentSelection(segment.id)"
                        />
                    </div>

                    <div
                        class="hover:bg-elevated/50 w-full rounded-lg p-3 transition-all duration-200"
                    >
                        <div class="mb-1 flex items-start justify-between">
                            <div class="flex items-center gap-2">
                                <div class="flex items-center gap-1 text-xs font-medium">
                                    <UIcon name="i-lucide-grip" class="size-3" />
                                    Chunks #{{ segment.chunkIndex + 1 }}
                                </div>
                                <div class="text-xs">{{ segment.contentLength }} character</div>
                                <template v-if="segment.status === 'failed'">
                                    <UTooltip :text="segment?.error" :delay-duration="0">
                                        <UBadge
                                            :color="statusMap[segment.status]?.color || 'neutral'"
                                            variant="subtle"
                                            size="sm"
                                        >
                                            {{ statusMap[segment.status]?.label || segment.status }}
                                        </UBadge>
                                    </UTooltip>
                                </template>
                                <template v-else>
                                    <UBadge
                                        :color="statusMap[segment.status]?.color || 'neutral'"
                                        variant="subtle"
                                        size="sm"
                                    >
                                        {{ statusMap[segment.status]?.label || segment.status }}
                                    </UBadge>
                                </template>
                            </div>

                            <div class="flex items-center gap-2">
                                <UButton
                                    icon="i-lucide-pen-line"
                                    color="neutral"
                                    variant="ghost"
                                    size="sm"
                                    class="opacity-0 transition-opacity group-hover:opacity-100"
                                    @click="handleEdit(segment)"
                                />
                                <UButton
                                    icon="i-lucide-trash"
                                    color="error"
                                    variant="ghost"
                                    size="sm"
                                    class="opacity-0 transition-opacity group-hover:opacity-100"
                                    @click="handleDelete(segment.id)"
                                />

                                <USwitch
                                    class="opacity-0 transition-opacity group-hover:opacity-100"
                                    :model-value="segment.enabled === 1"
                                    color="success"
                                    @update:model-value="() => handleToggleEnabled(segment)"
                                />

                                <div class="flex items-center gap-2">
                                    <UChip
                                        :color="segment.enabled === 0 ? 'error' : 'success'"
                                        standalone
                                        inset
                                    >
                                        <span class="mr-2 text-xs">
                                            {{
                                                segment.enabled === 0
                                                    ? t("ai-datasets.backend.common.disabled")
                                                    : t("ai-datasets.backend.common.enabled")
                                            }}
                                        </span>
                                    </UChip>
                                </div>
                            </div>
                        </div>

                        <div
                            class="text-foreground text-xs leading-normal tracking-wide whitespace-pre-wrap"
                            :class="{ 'line-clamp-2': isCollapsed }"
                        >
                            {{ segment.content }}
                        </div>
                    </div>
                </div>

                <div v-if="paging.loading && paging.items.length === 0" class="p-4">
                    <div v-for="item in 20" :key="item" class="mb-6">
                        <div class="mb-3 flex">
                            <USkeleton class="size-3" />
                            <USkeleton class="ml-1 h-3 w-12" />
                            <USkeleton class="ml-6 h-3 w-12" />
                        </div>
                        <div class="grid gap-2">
                            <USkeleton class="h-3 w-full" />
                            <USkeleton class="h-3 w-full" />
                        </div>
                    </div>
                </div>
            </BdScrollArea>

            <div class="w-100 overflow-hidden px-6" v-if="paging.items.length">
                <div class="mb-4">
                    <h3 class="text-foreground text-lg font-semibold">
                        {{ t("ai-datasets.backend.documents.table.fileName") }}
                    </h3>
                </div>

                <div v-if="currentDocument" class="space-y-4">
                    <div class="space-y-4">
                        <div class="items-centsr flex gap-2">
                            <UButton
                                icon="i-lucide-file-text"
                                color="neutral"
                                variant="outline"
                                size="sm"
                            />
                            <span class="text-foreground truncate font-medium">
                                {{ currentDocument.fileName }}
                            </span>
                        </div>

                        <div class="space-y-4 text-xs">
                            <div class="flex justify-between">
                                <span class="text-muted-foreground"
                                    >{{ t("ai-datasets.backend.documents.table.fileSize") }}:</span
                                >
                                <span class="text-foreground">
                                    {{ formatFileSize(currentDocument.fileSize) }}
                                </span>
                            </div>
                            <div class="flex justify-between">
                                <span class="text-muted-foreground">
                                    {{ t("ai-datasets.backend.documents.table.fileType") }}:
                                </span>
                                <span class="text-foreground">{{ currentDocument.fileType }}</span>
                            </div>
                            <div class="flex justify-between">
                                <span class="text-muted-foreground">
                                    {{ t("ai-datasets.backend.documents.table.chunkCount") }}:
                                </span>
                                <span class="text-foreground">
                                    {{ currentDocument.chunkCount }}
                                </span>
                            </div>
                            <div class="flex justify-between">
                                <span class="text-muted-foreground">
                                    {{ t("ai-datasets.backend.documents.table.characterCount") }}:
                                </span>
                                <span class="text-foreground">
                                    {{ formatCompactNumber(currentDocument.characterCount) }}
                                </span>
                            </div>
                            <div class="flex justify-between">
                                <span class="text-muted-foreground">
                                    {{ t("ai-datasets.backend.documents.table.createdAt") }}:
                                </span>
                                <span class="text-foreground">
                                    <TimeDisplay
                                        :datetime="currentDocument.createdAt"
                                        mode="datetime"
                                    />
                                </span>
                            </div>
                        </div>
                    </div>

                    <div class="flex items-center justify-between">
                        <h4 class="text-foreground text-xs font-medium">
                            {{ t("console-common.status") }}
                        </h4>
                        <div class="flex items-center gap-2">
                            <UBadge
                                :color="statusMap[currentDocument.status]?.color || 'neutral'"
                                variant="subtle"
                            >
                                {{
                                    statusMap[currentDocument.status]?.label ||
                                    currentDocument.status
                                }}
                            </UBadge>
                            <span
                                v-if="currentDocument.progress !== undefined"
                                class="text-muted-foreground text-sm"
                            >
                                {{ currentDocument.progress }}%
                            </span>
                        </div>
                    </div>

                    <div v-if="currentDocument.error" class="flex flex-col">
                        <h4 class="text-foreground text-xs font-medium">
                            {{ t("console-common.error") }}
                        </h4>
                        <div class="bg-muted mt-2 rounded-md p-3">
                            <p class="text-error text-xs">
                                {{ currentDocument.error || "-" }}
                            </p>
                        </div>
                    </div>

                    <div class="space-y-2">
                        <h4 class="text-foreground text-xs font-medium">文档 ID</h4>
                        <div class="bg-muted rounded-md p-2">
                            <p class="text-muted-foreground font-mono text-xs break-all">
                                {{ currentDocument.id }}
                            </p>
                        </div>
                    </div>
                </div>

                <div v-else class="flex items-center justify-center py-8">
                    <div class="text-center">
                        <UIcon
                            name="i-lucide-file-text"
                            class="text-muted-foreground mx-auto mb-2 h-8 w-8"
                        />
                        <p class="text-muted-foreground text-sm">
                            {{ t("console-common.noData") }}
                        </p>
                    </div>
                </div>
            </div>
        </div>

        <div class="flex items-center justify-end p-4">
            <BdPagination
                v-model:page="paging.page"
                v-model:size="paging.pageSize"
                :total="paging.total"
                @change="getLists"
            />
        </div>
    </div>
</template>
