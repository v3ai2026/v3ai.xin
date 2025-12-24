<script lang="ts" setup>
import type {
    DatasetDocument,
    QueryDocumentParams,
} from "@buildingai/service/consoleapi/ai-datasets";
import { apiGetDocumentList } from "@buildingai/service/consoleapi/ai-datasets";
import { type Row } from "@tanstack/table-core";

import type { DropdownMenuItem, TableColumn, TableRow } from "#ui/types";

import { useDocumentActions } from "../useDatasets";

const UButton = resolveComponent("UButton");
const UBadge = resolveComponent("UBadge");
const UDropdownMenu = resolveComponent("UDropdownMenu");
const UIcon = resolveComponent("UIcon");
const UInput = resolveComponent("UInput");
const TimeDisplay = resolveComponent("TimeDisplay");

const { params: URLQueryParams } = useRoute();
const router = useRouter();
const { t } = useI18n();
const { hasAccessByCodes } = useAccessControl();
const table = useTemplateRef("table");

const { deleteDocument, renameDocument, retryDocument, toggleDocumentEnabled } =
    useDocumentActions();

const datasetId = computed(() => (URLQueryParams as Record<string, string>).id);

const searchForm = shallowReactive<QueryDocumentParams>({
    keyword: "",
    fileType: "",
    datasetId: datasetId.value,
});

const columnLabels = computed(() => ({
    select: t("console-common.select"),
    fileName: t("ai-datasets.backend.documents.table.fileName"),
    fileSize: t("ai-datasets.backend.documents.table.fileSize"),
    status: t("console-common.status"),
    process: t("ai-datasets.backend.documents.table.progress"),
    enabled: t("console-common.status"),
    characterCount: t("ai-datasets.backend.documents.table.characterCount"),
    chunkCount: t("ai-datasets.backend.documents.table.chunkCount"),
    createdAt: t("ai-datasets.backend.documents.table.createdAt"),
    actions: t("console-common.operation"),
}));

const { paging, getLists } = usePaging<DatasetDocument>({
    fetchFun: apiGetDocumentList,
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

const statusMap = {
    processing: { label: t("console-common.processing"), color: "warning" as const },
    completed: { label: t("console-common.completed"), color: "success" as const },
    failed: { label: t("console-common.failed"), color: "error" as const },
    pending: { label: t("console-common.pending"), color: "neutral" as const },
    error: { label: t("ai-datasets.backend.documents.error"), color: "error" as const },
} as const;

const fileTypeIcons = {
    pdf: "i-lucide-file-text",
    doc: "i-lucide-file-text",
    docx: "i-lucide-file-text",
    txt: "i-lucide-file-text",
    md: "i-lucide-file-text",
    csv: "i-lucide-file-spreadsheet",
    xlsx: "i-lucide-file-spreadsheet",
    xls: "i-lucide-file-spreadsheet",
    default: "i-lucide-file",
};

const columns: TableColumn<DatasetDocument>[] = [
    {
        accessorKey: "fileName",
        header: () => h("p", { class: "whitespace-nowrap" }, `${columnLabels.value.fileName}`),
        cell: ({ row }) => {
            return h("div", { class: "flex items-center gap-3" }, [
                h(UIcon, {
                    name:
                        fileTypeIcons[row.original.fileType as keyof typeof fileTypeIcons] ||
                        fileTypeIcons.default,
                    class: "text-primary size-5",
                }),
                h("div", { class: "flex-1 grid" }, [
                    h(
                        "p",
                        { class: "font-medium text-highlighted truncate" },
                        row.original.fileName,
                    ),
                ]),
            ]);
        },
    },
    {
        accessorKey: "fileSize",
        header: () => h("p", { class: "" }, `${columnLabels.value.fileSize}`),
        cell: ({ row }) => {
            const fileSize = row.getValue("fileSize") as number;
            return h("span", { class: "text-sm" }, formatFileSize(fileSize));
        },
    },
    {
        accessorKey: "enabled",
        header: () => h("p", { class: "" }, `${columnLabels.value.enabled}`),
        cell: ({ row }) => {
            const enabled = row.getValue("enabled") as boolean;
            const statusInfo = enabled
                ? { label: t("console-common.enabled"), color: "success" as const }
                : { label: t("console-common.disabled"), color: "error" as const };
            return h(
                UBadge,
                { color: statusInfo.color, variant: "subtle" },
                () => statusInfo.label,
            );
        },
    },
    {
        accessorKey: "characterCount",
        header: () =>
            h("p", { class: "whitespace-nowrap" }, `${columnLabels.value.characterCount}`),
        cell: ({ row }) => {
            const characterCount = row.original.characterCount || 0;

            return h(
                "span",
                { class: "text-sm text-primary" },
                `${formatCompactNumber(characterCount)}`,
            );
        },
    },
    {
        accessorKey: "chunkCount",
        header: () => h("p", { class: "whitespace-nowrap" }, `${columnLabels.value.chunkCount}`),
        cell: ({ row }) => {
            const chunkCount = row.getValue("chunkCount") as number;
            return h(UBadge, { color: "primary", variant: "subtle" }, () => chunkCount.toString());
        },
    },
    {
        accessorKey: "status",
        header: () => h("p", { class: "" }, `${columnLabels.value.status}`),
        cell: ({ row }) => {
            const status = row.getValue("status") as keyof typeof statusMap;
            const statusInfo = statusMap[status];
            if (status === "failed") {
                return h(
                    resolveComponent("UTooltip"),
                    {
                        text: row.original?.error,
                        delayDuration: 0,
                    },
                    {
                        default: () =>
                            h(
                                UBadge,
                                { color: statusInfo.color, variant: "subtle" },
                                () => statusInfo.label,
                            ),
                    },
                );
            }
            return h(
                UBadge,
                { color: statusInfo.color, variant: "subtle" },
                () => statusInfo.label,
            );
        },
    },
    {
        accessorKey: "progress",
        header: () => h("p", { class: "whitespace-nowrap" }, `${columnLabels.value.process}`),
        cell: ({ row }) => {
            const progress = row.original.progress || 0;

            return h("span", { class: "text-sm text-primary" }, `${progress}%`);
        },
    },
    {
        accessorKey: "createdAt",
        header: ({ column }) => {
            const isSorted = column.getIsSorted();

            return h(UButton, {
                color: "neutral",
                variant: "ghost",
                label: columnLabels.value.createdAt,
                icon: isSorted
                    ? isSorted === "asc"
                        ? "i-lucide-arrow-up-narrow-wide"
                        : "i-lucide-arrow-down-wide-narrow"
                    : "i-lucide-arrow-up-down",
                class: "-mx-2.5",
                onClick: () => column.toggleSorting(column.getIsSorted() === "asc"),
            });
        },
        cell: ({ row }) => {
            const createdAt = row.getValue("createdAt") as string;
            return h(TimeDisplay, {
                datetime: createdAt,
                mode: "datetime",
            });
        },
    },
    {
        id: "actions",
        header: () => h("p", { class: "" }, `${columnLabels.value.actions}`),
        size: 80,
        enableSorting: false,
        enableHiding: false,
        cell: ({ row }) => {
            return h(UDropdownMenu, { items: getRowItems(row) }, () => {
                return h(
                    UButton,
                    {
                        icon: "i-lucide-ellipsis-vertical",
                        color: "neutral",
                        variant: "ghost",
                        class: "ml-auto",
                    },
                    () => "",
                );
            });
        },
    },
];

function getRowItems(row: Row<DatasetDocument>) {
    const document = row.original;
    const isEnabled = document.enabled;

    return [
        hasAccessByCodes(["ai-datasets-segments:list"])
            ? {
                  label: t("ai-datasets.backend.documents.viewSegments"),
                  icon: "i-lucide-list",
                  onClick: () => {
                      if (!hasAccessByCodes(["ai-datasets-segments:list"])) return;
                      router.push({
                          path: `/console/datasets/${datasetId.value}/documents/segments`,
                          query: {
                              documentId: document.id,
                          },
                      });
                  },
              }
            : null,
        hasAccessByCodes(["ai-datasets-documents:rename"])
            ? {
                  label: t("ai-datasets.backend.documents.renameModal.title"),
                  icon: "i-lucide-pen-line",
                  onClick: () => handleRename(document),
              }
            : null,
        hasAccessByCodes(["ai-datasets-documents:set-enabled"])
            ? {
                  label: isEnabled
                      ? t("ai-datasets.backend.documents.disable.title")
                      : t("ai-datasets.backend.documents.enable.title"),
                  icon: isEnabled ? "i-lucide-eye-off" : "i-lucide-eye",
                  color: isEnabled ? "warning" : "primary",
                  onClick: () => toggleDocumentEnabled(document.id, !isEnabled, getLists),
              }
            : null,
        hasAccessByCodes(["ai-datasets-documents:retry"])
            ? {
                  label: t("ai-datasets.backend.documents.retry.title"),
                  icon: "i-lucide-rotate-ccw",
                  color: "warning",
                  onClick: () => retryDocument(document.id, getLists),
              }
            : null,
        hasAccessByCodes(["ai-datasets-documents:delete"])
            ? {
                  label: t("console-common.delete"),
                  icon: "i-lucide-trash",
                  color: "error",
                  onSelect: () => handleDelete(document.id),
              }
            : null,
    ].filter(Boolean) as DropdownMenuItem[];
}

watch(
    () => [searchForm.keyword, searchForm.fileType],
    () => {
        useDebounceFn(() => {
            paging.page = 1;
            getLists();
        }, 300)();
    },
    { deep: true },
);

const handleDelete = async (id: string) => {
    await deleteDocument(id, getLists);
};

const handleAddFile = () => {
    router.push(useRoutePath("ai-datasets-documents:create", { id: datasetId.value as string }));
};

const handleRename = async (document: DatasetDocument) => {
    await renameDocument(document, getLists);
};

const handleRowClick = (row: TableRow<DatasetDocument>) => {
    if (!hasAccessByCodes(["ai-datasets-segments:list"])) return;
    router.push({
        path: `/console/datasets/${datasetId.value}/documents/segments`,
        query: {
            documentId: row.original.id,
        },
    });
};

onMounted(() => getLists());

definePageMeta({ layout: "full-screen" });
</script>

<template>
    <div class="flex h-full w-full flex-col px-6">
        <div class="flex flex-col justify-center gap-1 pt-4">
            <h1 class="text-lg! font-bold">{{ t("ai-datasets.backend.documents.title") }}</h1>
            <p class="text-muted-foreground text-sm">
                {{ t("ai-datasets.backend.documents.description") }}
            </p>
        </div>

        <div class="flex w-full justify-between gap-4 py-6 backdrop-blur-sm">
            <UInput
                v-model="searchForm.keyword"
                :placeholder="t('ai-datasets.backend.documents.searchPlaceholder')"
                class="w-80"
                icon="i-lucide-search"
            />

            <div class="flex items-center gap-2 md:ml-auto">
                <UDropdownMenu
                    :items="
                        table?.tableApi
                            ?.getAllColumns()
                            .filter((column) => column.getCanHide())
                            .map((column) => ({
                                label:
                                    columnLabels[column.id as keyof typeof columnLabels] ||
                                    column.columnDef.header,
                                type: 'checkbox' as const,
                                checked: column.getIsVisible(),
                                onUpdateChecked(checked: boolean) {
                                    table?.tableApi
                                        ?.getColumn(column.id)
                                        ?.toggleVisibility(!!checked);
                                },
                                onSelect(e?: Event) {
                                    e?.preventDefault();
                                },
                            }))
                    "
                    :content="{ align: 'end' }"
                >
                    <UButton
                        :label="t('console-common.showColumns')"
                        color="neutral"
                        variant="outline"
                        trailing-icon="i-lucide-chevron-down"
                    />
                </UDropdownMenu>

                <AccessControl :codes="['ai-datasets-documents:create']">
                    <UButton
                        :label="t('ai-datasets.backend.documents.addFile')"
                        leading-icon="i-lucide-plus"
                        color="primary"
                        @click="handleAddFile"
                    />
                </AccessControl>
            </div>
        </div>

        <div class="flex h-full flex-col">
            <div class="table h-full">
                <UTable
                    :loading="paging.loading"
                    :data="paging.items"
                    :columns="columns"
                    class="h-full shrink-0"
                    ref="table"
                    selectable
                    sticky
                    :ui="{
                        base: 'table-fixed border-separate border-spacing-0',
                        thead: '[&>tr]:bg-elevated/50 [&>tr]:after:content-none',
                        tbody: '[&>tr]:last:[&>td]:border-b-0',
                        th: 'py-2 first:rounded-l-lg last:rounded-r-lg border-y border-default first:border-l last:border-r',
                        td: 'border-b border-default ',
                        tr: 'hover:bg-elevated/50',
                    }"
                    :onSelect="handleRowClick"
                />
            </div>
        </div>

        <div class="flex items-center justify-end gap-3 py-4">
            <div class="flex items-center gap-1.5">
                <BdPagination
                    v-model:page="paging.page"
                    v-model:size="paging.pageSize"
                    :total="paging.total"
                    @change="getLists"
                />
            </div>
        </div>
    </div>
</template>
