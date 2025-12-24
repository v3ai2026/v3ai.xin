<script lang="ts" setup>
import type { MicropageFormData } from "@buildingai/service/consoleapi/decorate";
import {
    apiBatchDeleteMicropage,
    apiDeleteMicropage,
    apiGetMicropageList,
} from "@buildingai/service/consoleapi/decorate";

import { type TableColumn } from "#ui/types";

const PopEdit = defineAsyncComponent(() => import("./edit.vue"));

const UCheckbox = resolveComponent("UCheckbox");
const UButton = resolveComponent("UButton");
const TimeDisplay = resolveComponent("TimeDisplay");

const toast = useMessage();
const { t } = useI18n();
const router = useRouter();
const { hasAccessByCodes } = useAccessControl();
const overlay = useOverlay();

const table = useTemplateRef("table");
const micropageList = shallowRef<MicropageFormData[]>([]);

const selectedRowsCount = computed((): number => {
    if (!table.value?.tableApi) return 0;
    const selectedModel = table.value.tableApi.getSelectedRowModel() as {
        flatRows?: { length: number };
    };
    return selectedModel?.flatRows?.length || 0;
});

const getSelectedIds = (): string[] => {
    if (!table.value?.tableApi) return [];
    const selectedModel = table.value.tableApi.getSelectedRowModel();
    return (
        selectedModel?.flatRows?.map((row: { original: { id: string } }) => row.original.id) || []
    );
};

const columnLabels = computed<Record<string, string>>(() => ({
    select: t("console-common.select"),
    name: t("decorate.micropage.list.columns.name"),
    createdAt: t("console-common.createAt"),
    actions: t("console-common.operation"),
}));

const columns: TableColumn<MicropageFormData>[] = [
    {
        id: "select",
        header: ({ table }) =>
            h(UCheckbox, {
                modelValue: table.getIsSomePageRowsSelected()
                    ? "indeterminate"
                    : table.getIsAllPageRowsSelected(),
                "onUpdate:modelValue": (value: boolean | "indeterminate") => {
                    table.toggleAllPageRowsSelected(!!value);
                },
                ariaLabel: "Select all",
            }),
        cell: ({ row }) =>
            h(UCheckbox, {
                modelValue: row.getIsSelected(),
                "onUpdate:modelValue": (value: boolean | "indeterminate") => {
                    row.toggleSelected(!!value);
                },
                ariaLabel: "Select row",
            }),
    },
    {
        accessorKey: "name",
        header: () => h("p", { class: "" }, `${columnLabels.value.name}`),
        cell: ({ row }) => {
            return h("div", { class: "flex items-center" }, [
                h("span", { class: "truncate font-medium" }, row.original.name),
            ]);
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
        size: 120, // 固定宽度，增加一些空间给多个按钮
        enableSorting: false,
        enableHiding: false,
        cell: ({ row }) => {
            return h(
                "div",
                { class: "flex items-center gap-1" },
                [
                    hasAccessByCodes(["decorate-micropage:detail"])
                        ? h(UButton, {
                              icon: "i-lucide-brush",
                              color: "primary",
                              variant: "ghost",
                              size: "xs",
                              label: t("decorate.micropage.list.actions.design"),
                              onClick: () => {
                                  router.push({
                                      path: useRoutePath("decorate-micropage:detail"),
                                      query: { id: row.original.id as string },
                                  });
                              },
                          })
                        : null,
                    hasAccessByCodes(["decorate-micropage:update"])
                        ? h(UButton, {
                              icon: "i-lucide-pen-line",
                              color: "primary",
                              variant: "ghost",
                              size: "xs",
                              label: t("console-common.edit"),
                              onClick: () => {
                                  mountPopEditModal(row.original.id);
                              },
                          })
                        : null,
                    hasAccessByCodes(["decorate-micropage:delete"])
                        ? h(UButton, {
                              icon: "i-lucide-trash",
                              color: "error",
                              variant: "ghost",
                              size: "xs",
                              label: t("console-common.delete"),
                              onClick: () => {
                                  handleDelete(row.original.id as string);
                              },
                          })
                        : null,
                ].filter(Boolean),
            );
        },
    },
];

const { lockFn: fetchMicropageList, isLock } = useLockFn(async () => {
    try {
        const result = await apiGetMicropageList();
        micropageList.value = result || [];
    } catch (error) {
        console.log("get micropage-list api error --->", error);
    }
});

const mountPopEditModal = async (id: string | null) => {
    const modal = overlay.create(PopEdit);

    const instance = modal.open({ id: id });
    const shouldRefresh = await instance.result;
    if (shouldRefresh) {
        fetchMicropageList();
    }
};

/** 删除数据 */
const handleDelete = async (id: string | string[]) => {
    try {
        await useModal({
            title: t("console-common.confirm"),
            description: Array.isArray(id)
                ? t("decorate.micropage.list.batchDeleteMessage")
                : t("decorate.micropage.list.confirmDeleteMessage"),
            color: "error",
            confirmText: t("console-common.delete"),
            cancelText: t("console-common.cancel"),
        });

        let data: { success: boolean; message: string } | undefined;
        if (Array.isArray(id)) {
            // 批量删除
            data = await apiBatchDeleteMicropage({ ids: id });
        } else {
            // 单个删除
            data = await apiDeleteMicropage(id);
        }

        if (data?.success) {
            fetchMicropageList();
            table.value?.tableApi?.resetRowSelection();
            toast.success(t("console-common.messages.success"));
        } else {
            toast.error(data?.message || t("console-common.messages.failed"));
        }
    } catch (error) {
        console.error("删除失败:", error);
    }
};

// 初始化
onMounted(() => fetchMicropageList());
</script>

<template>
    <div class="micropage-list-container pb-5">
        <!-- 搜索区域 -->
        <div class="bg-background sticky top-0 z-10 flex flex-wrap gap-4 pb-4">
            <div class="itemc-end flex justify-end"></div>

            <div class="flex items-end gap-2 md:ml-auto">
                <AccessControl :codes="['decorate-micropage:delete']">
                    <UButton
                        color="error"
                        variant="subtle"
                        :label="t('console-common.batchDelete')"
                        icon="i-heroicons-trash"
                        :disabled="!selectedRowsCount"
                        @click="
                            () => {
                                const selectedIds = getSelectedIds();
                                if (selectedIds && selectedIds.length > 0) {
                                    handleDelete(selectedIds);
                                }
                            }
                        "
                    >
                        <template #trailing>
                            <UKbd>
                                {{ selectedRowsCount }}
                            </UKbd>
                        </template>
                    </UButton>
                </AccessControl>

                <UDropdownMenu
                    :items="
                        table?.tableApi
                            ?.getAllColumns()
                            .filter((column: any) => column.getCanHide())
                            .map((column: any) => ({
                                label: columnLabels[column?.id] || column.columnDef.header,
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

                <AccessControl :codes="['decorate-micropage:create']">
                    <UButton
                        icon="i-heroicons-plus"
                        color="primary"
                        @click="mountPopEditModal(null)"
                    >
                        {{ t("decorate.micropage.list.addMicropage") }}
                    </UButton>
                </AccessControl>
            </div>
        </div>

        <!-- 表格区域 -->
        <UTable
            :loading="isLock"
            :data="micropageList"
            :columns="columns"
            class="shrink-0"
            ref="table"
            selectable
            :ui="{
                base: 'table-fixed border-separate border-spacing-0',
                thead: '[&>tr]:bg-elevated/50 [&>tr]:after:content-none',
                tbody: '[&>tr]:last:[&>td]:border-b-0',
                th: 'py-2 first:rounded-l-lg last:rounded-r-lg border-y border-default first:border-l last:border-r',
                td: 'border-b border-default',
            }"
        />
    </div>
</template>
