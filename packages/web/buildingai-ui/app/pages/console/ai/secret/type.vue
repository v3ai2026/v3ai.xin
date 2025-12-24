<script setup lang="ts">
import type {
    SecretTemplateFormData,
    SecretTemplateRequest,
} from "@buildingai/service/consoleapi/secret-template";
import {
    createSecretTemplate,
    deleteSecretTemplate,
    getSecretTemplateList,
    importSecretTemplate,
    updateSecretTemplate,
    updateSecretTemplateStatus,
} from "@buildingai/service/consoleapi/secret-template";
import type { Row } from "@tanstack/table-core";

import type { DropdownMenuItem } from "#ui/types";

const ApiEdit = defineAsyncComponent(() => import("./components/type-edit.vue"));

const TimeDisplay = resolveComponent("TimeDisplay");

const { t } = useI18n();
const toast = useMessage();
const overlay = useOverlay();

const searchForm = shallowReactive({
    name: "",
});

const { paging, getLists } = usePaging({
    fetchFun: getSecretTemplateList,
    params: searchForm,
});

const columns = computed(() => [
    { accessorKey: "icon", header: t("ai-secret.backend.type.form.icon") },
    { accessorKey: "name", header: t("ai-secret.backend.type.form.name") },
    { accessorKey: "isActived", header: t("ai-secret.backend.type.form.isActived") },
    {
        accessorKey: "createdAt",
        header: t("console-common.createAt"),
        cell: ({ row }: { row: Row<SecretTemplateRequest> }) => {
            const createdAt = row.getValue("createdAt") as string;
            return h(TimeDisplay, {
                datetime: createdAt,
                mode: "datetime",
            });
        },
    },
    { accessorKey: "action", header: t("console-common.operation") },
]);

const getRowItems = (row: Row<SecretTemplateRequest>): DropdownMenuItem[] => {
    const items: DropdownMenuItem[] = [];

    items.push({
        label: t("ai-secret.backend.type.form.edit"),
        icon: "i-lucide-edit",
        onClick: () => {
            mountApiEditModal(row.original.id);
        },
    });

    items.push({
        label: t("ai-secret.backend.type.form.delete"),
        icon: "i-lucide-trash",
        color: "error",
        onSelect() {
            if (!row.original.id) {
                console.error("Row data missing ID");
                return;
            }
            handleDelete(row.original.id);
        },
    });

    return items;
};

const handleSwitchChange = async (row: Row<SecretTemplateRequest>) => {
    if (!row.original.id) {
        console.error("行数据缺少 ID");
        return;
    }
    try {
        await updateSecretTemplateStatus(row.original.id, { isEnabled: row.original.isEnabled });
        toast.success(
            !row.original.isEnabled
                ? t("ai-secret.backend.type.disableSuccess")
                : t("ai-secret.backend.type.enableSuccess"),
        );
        getLists();
    } catch (error) {
        console.error("更新状态失败:", error);
    }
};

const handleSubmit = async (value: SecretTemplateFormData, id?: string) => {
    try {
        if (id) {
            await updateSecretTemplate(id, value);
        } else {
            await createSecretTemplate(value);
        }
        toast.success(t("ai-secret.backend.type.edit.submitSuccess"));
        getLists();
    } catch (error) {
        console.error("表单提交失败:", error);
    }
};

const jsonSubmitForm = async (value: string) => {
    try {
        await importSecretTemplate({ jsonData: value });
        toast.success(t("ai-secret.backend.type.edit.submitSuccess"));
        getLists();
    } catch (error) {
        console.error("JSON导入失败:", error);
    }
};

const handleDelete = async (id: string) => {
    try {
        await deleteSecretTemplate(id);
        toast.success(t("ai-secret.backend.type.deleteSuccess"));
        getLists();
    } catch (error) {
        console.error("删除失败:", error);
    }
};

const mountApiEditModal = (keyId?: string, jsonImportMode: boolean = false): void => {
    const modal = overlay.create(ApiEdit);

    modal.open({
        id: keyId,
        isJsonImport: jsonImportMode,

        onSubmit: (value: SecretTemplateFormData, id?: string) => {
            handleSubmit(value, id);
        },
        "onJson-submit": (value: string) => {
            jsonSubmitForm(value);
        },
    });
};

const handleOpenEdit = (isImport: boolean = false) => {
    mountApiEditModal(undefined, isImport);
};

onMounted(() => getLists());
</script>
<template>
    <div class="flex h-full flex-col gap-4">
        <!-- 顶部控制区域 -->
        <div class="flex items-center justify-between">
            <UInput v-model="searchForm.name" placeholder="请输入名称..." @change="getLists" />
            <UDropdownMenu
                size="lg"
                :items="[
                    {
                        label: t('ai-mcp.backend.quickCreateTitle'),
                        icon: 'i-heroicons-plus',
                        color: 'primary',
                        onSelect: () => handleOpenEdit(),
                    },
                    {
                        label: t('ai-mcp.backend.importTitle'),
                        icon: 'i-lucide-file-json-2',
                        color: 'primary',
                        onSelect: () => handleOpenEdit(true),
                    },
                ]"
            >
                <UButton color="primary" icon="i-lucide-plus">
                    {{ t("ai-secret.backend.type.addType") }}
                </UButton>
            </UDropdownMenu>
        </div>
        <!-- 列表 -->
        <div class="flex-1 overflow-y-auto">
            <UTable
                sticky
                class="h-full"
                :columns="columns"
                :data="paging.items"
                :ui="{
                    base: 'table-fixed border-separate border-spacing-0',
                    thead: '[&>tr]:bg-elevated/50 [&>tr]:after:content-none',
                    tbody: '[&>tr]:last:[&>td]:border-b-0',
                    th: 'py-2 first:rounded-l-lg last:rounded-r-lg border-y border-default first:border-l last:border-r',
                    td: 'border-b border-default',
                    tr: '[&:has(>td[colspan])]:hidden',
                }"
            >
                <template #icon-cell="{ row }">
                    <UAvatar
                        :src="row.original.icon"
                        :alt="row.original.name"
                        size="md"
                        :ui="{ image: 'rounded-lg', fallback: 'text-inverted font-medium' }"
                        :class="[row.original.icon ? '' : 'bg-primary']"
                    />
                </template>
                <template #type-cell="{ row }">
                    {{
                        row.original.type === "system"
                            ? t("ai-secret.backend.type.form.system")
                            : t("ai-secret.backend.type.form.custom")
                    }}
                </template>
                <template #isActived-cell="{ row }">
                    <USwitch
                        :model-value="Boolean(row.original.isEnabled)"
                        @update:model-value="(value) => (row.original.isEnabled = value ? 1 : 0)"
                        @change="handleSwitchChange(row)"
                    />
                </template>
                <template #action-cell="{ row }">
                    <UDropdownMenu :items="getRowItems(row)">
                        <UButton
                            icon="i-lucide-ellipsis-vertical"
                            color="neutral"
                            variant="ghost"
                        />
                    </UDropdownMenu>
                </template>
            </UTable>
        </div>

        <!-- 分页 -->
        <div class="bg-background flex items-center justify-end gap-3 py-4">
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
