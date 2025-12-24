<script lang="ts" setup>
import type { Permission, PermissionGroup } from "@buildingai/service/consoleapi/permission";
import {
    apiCleanupDeprecatedPermissions,
    apiGetPermissionList,
    apiSyncApiPermissions,
} from "@buildingai/service/consoleapi/permission";
import type { ExpandedState, Row } from "@tanstack/table-core";

import type { TableColumn } from "#ui/types";

const PermissionEdit = defineAsyncComponent(() => import("./edit.vue"));

const UButton = resolveComponent("UButton");
const UBadge = resolveComponent("UBadge");
const UDropdownMenu = resolveComponent("UDropdownMenu");
const UIcon = resolveComponent("UIcon");
const TimeDisplay = resolveComponent("TimeDisplay");

const toast = useMessage();
const { t } = useI18n();
const { hasAccessByCodes } = useAccessControl();
const overlay = useOverlay();

// 表格实例 Refs
const table = useTemplateRef("table");
// 列表查询参数
const searchForm = shallowReactive({
    code: "",
    name: "",
    group: "",
});

// 展开状态管理
const expanded = shallowRef<ExpandedState>({});

// 树形数据接口
interface TreePermission extends Permission {
    children?: TreePermission[];
    isGroup?: boolean;
    groupName?: string;
}

// 列ID到中文名称的映射
const columnLabels = computed<Record<string, string>>(() => ({
    code: t("system-perms.permission.code"),
    name: t("system-perms.permission.name"),
    description: t("system-perms.permission.describe"),
    group: t("system-perms.permission.group"),
    isDeprecated: t("system-perms.permission.isDeprecated"),
    createdAt: t("console-common.createAt"),
    actions: t("console-common.operation"),
}));

// 定义表格列
const columns: TableColumn<TreePermission>[] = [
    {
        id: "expander",
        header: ({ table }) => {
            return h(UButton, {
                variant: "ghost",
                color: "neutral",
                icon: table.getExpandedDepth() ? "i-lucide-minus-square" : "i-lucide-plus-square",
                size: "xs",
                onClick: (e: MouseEvent) => {
                    e.stopPropagation();
                    table.toggleAllRowsExpanded(!table.getExpandedDepth());
                },
            });
        },
        enableHiding: false,
        cell: ({ row }) => {
            return row.getCanExpand()
                ? h(UButton, {
                      variant: "ghost",
                      color: "neutral",
                      icon: row.getIsExpanded() ? "i-lucide-minus" : "i-lucide-plus",
                      size: "xs",
                      onClick: (e: MouseEvent) => {
                          e.stopPropagation();
                          row.toggleExpanded();
                      },
                  })
                : null;
        },
    },
    {
        accessorKey: "name",
        header: () => h("p", { class: "" }, `${columnLabels.value.name}`),
        cell: ({ row }) => {
            const _depth = row.depth;
            const isGroup = row.original.isGroup;

            const indentElements = [];

            // 如果是分组，添加分组图标
            if (isGroup) {
                indentElements.push(
                    h(UIcon, {
                        name: "i-lucide-folder",
                        class: "text-primary size-5 flex-none mr-2",
                    }),
                );
            }

            const displayName = isGroup ? row.original.groupName : `@${row.original.name}`;
            indentElements.push(h("span", { class: "truncate" }, displayName));

            return h("div", { class: "flex items-center" }, indentElements);
        },
    },
    {
        accessorKey: "description",
        header: () => h("p", { class: "" }, `${columnLabels.value.description}`),
        cell: ({ row }) => {
            const description = row.getValue("description") as string;
            if (row.original.isGroup) {
                return h("div", { class: "text-muted-foreground" }, "-");
            }
            return h("div", { class: "max-w-xs truncate" }, description || "-");
        },
    },
    {
        accessorKey: "group",
        header: () => h("p", { class: "" }, `${columnLabels.value.group}`),
        cell: ({ row }) => {
            if (row.original.isGroup) {
                return h("div", { class: "text-muted-foreground" }, "-");
            }
            const group = row.getValue("group") as string;
            return h("div", { class: "" }, [
                h(UBadge, { color: "primary", variant: "subtle" }, () => group),
            ]);
        },
    },
    {
        accessorKey: "isDeprecated",
        header: () => h("p", { class: "" }, `${columnLabels.value.isDeprecated}`),
        cell: ({ row }) => {
            if (row.original.isGroup) {
                return h("div", { class: "text-muted-foreground" }, "-");
            }
            const isDeprecated = row.getValue("isDeprecated") as boolean;

            return h("div", { class: "" }, [
                isDeprecated
                    ? h(UBadge, { color: "error", variant: "subtle" }, () =>
                          t("system-perms.permission.yes"),
                      )
                    : h(UBadge, { color: "success", variant: "subtle" }, () =>
                          t("system-perms.permission.no"),
                      ),
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
            if (row.original.isGroup) {
                return h("div", { class: "text-muted-foreground" }, "-");
            }
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
        size: 80, // 固定宽度
        enableSorting: false,
        enableHiding: false,
        cell: ({ row }) => {
            if (row.original.isGroup) {
                return h("div", { class: "text-muted-foreground" }, "-");
            }
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

// 操作栏
function getRowItems(row: Row<TreePermission>) {
    return [
        hasAccessByCodes(["permission:info"])
            ? {
                  label: t("console-common.check"),
                  icon: "i-lucide-eye",
                  onSelect() {
                      mountPermissionEditModal(row.original.code);
                  },
              }
            : null,
    ].filter(Boolean);
}

/** 获取权限列表数据 */
const permissions = ref<TreePermission[]>([]);
const permissionGroups = ref<PermissionGroup[]>([]);

/** 是否显示分组视图 */
const showGroupedView = ref(true);

// 将分组数据转换为树形结构
const transformToTreeData = (groups: PermissionGroup[]): TreePermission[] => {
    return groups.map((group) => ({
        id: `group-${group.code}`,
        code: group.code,
        name: group.name,
        groupName: group.name,
        description: "",
        group: group.code,
        isGroup: true,
        createdAt: "",
        updatedAt: "",
        children: group.permissions.map((permission) => ({
            ...permission,
            isGroup: false,
            groupName: group.name,
        })),
    }));
};

/** 获取权限列表 */
const { lockFn: getPermissions, isLock: listLoading } = useLockFn(async () => {
    try {
        const params = {
            keyword: searchForm.name || undefined,
            group: searchForm.group || undefined,
            isGrouped: showGroupedView.value,
        };

        const result = await apiGetPermissionList(params);

        if (Array.isArray(result)) {
            // 非分组结果
            if (result.length > 0 && result[0] && "permissions" in result[0]) {
                // 分组结果
                permissionGroups.value = result as PermissionGroup[];
                permissions.value = transformToTreeData(permissionGroups.value);
            } else {
                // 平铺结果
                permissions.value = (result as Permission[]).map((permission) => ({
                    ...permission,
                    isGroup: false,
                }));
                permissionGroups.value = [];
            }
        } else {
            // 分组结果
            permissionGroups.value = [result] as PermissionGroup[];
            permissions.value = transformToTreeData(permissionGroups.value);
        }
    } catch (error) {
        console.error("获取权限列表失败:", error);
    }
});

/** 同步API权限 */
const { lockFn: syncPermissions, isLock: syncLoading } = useLockFn(async () => {
    try {
        const result = await apiSyncApiPermissions();
        toast.success(
            t("system-perms.permission.syncSuccess", {
                added: result.added,
                updated: result.updated,
                isDeprecated: result.deprecated,
                total: result.total,
            }),
        );
        // 刷新列表
        await getPermissions();
    } catch (error) {
        console.error("同步权限失败:", error);
    }
});

/** 清理废弃权限 */
const { lockFn: cleanupPermissions, isLock: cleanupLoading } = useLockFn(async () => {
    try {
        const result = await apiCleanupDeprecatedPermissions();
        toast.success(
            t("system-perms.permission.cleanupSuccess", {
                removed: result.removed,
            }),
        );
        // 刷新列表
        await getPermissions();
    } catch (error) {
        console.error("清理权限失败:", error);
    }
});

const mountPermissionEditModal = (code: string) => {
    const modal = overlay.create(PermissionEdit);

    modal.open({ code: code });
};

onMounted(() => getPermissions());
</script>

<template>
    <div class="permission-list-container pb-5">
        <!-- 搜索区域 -->
        <div class="bg-background sticky top-0 z-10 flex flex-wrap gap-4 pb-4">
            <UInput
                v-model="searchForm.name"
                :placeholder="t('system-perms.permission.nameInput')"
                @change="getPermissions"
            />

            <UInput
                v-model="searchForm.group"
                :placeholder="t('system-perms.permission.groupInput')"
                :ui="{ root: 'max-w-xs w-full' }"
                @change="getPermissions"
            />

            <div class="flex items-end gap-2 md:ml-auto">
                <AccessControl :codes="['permission:sync']">
                    <UButton
                        color="info"
                        variant="outline"
                        :label="t('system-perms.permission.sync')"
                        icon="i-lucide-refresh-cw"
                        :loading="syncLoading"
                        @click="syncPermissions"
                    />
                </AccessControl>

                <AccessControl :codes="['permission:cleanup']">
                    <UButton
                        color="warning"
                        variant="outline"
                        :label="t('system-perms.permission.cleanup')"
                        icon="i-lucide-trash-2"
                        :loading="cleanupLoading"
                        @click="cleanupPermissions"
                    />
                </AccessControl>

                <UDropdownMenu
                    :items="
                        table?.tableApi
                            ?.getAllColumns()
                            .filter((column) => column.getCanHide())
                            .map((column) => ({
                                label: columnLabels[column.id] || column.columnDef.header,
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
                        :label="$t('console-common.showColumns')"
                        color="neutral"
                        variant="outline"
                        trailing-icon="i-lucide-chevron-down"
                    />
                </UDropdownMenu>

                <AccessControl :codes="['permission:list']">
                    <UButton
                        icon="i-lucide-list-filter"
                        color="primary"
                        variant="outline"
                        @click="getPermissions"
                        :loading="listLoading"
                    >
                        {{ t("system-perms.permission.refresh") }}
                    </UButton>
                </AccessControl>
            </div>
        </div>

        <!-- 表格区域 -->
        <UTable
            :loading="listLoading"
            :data="permissions"
            :columns="columns"
            class="shrink-0"
            ref="table"
            selectable
            :expanded="expanded"
            :getSubRows="(row) => row.children"
            :ui="{
                base: 'table-fixed border-separate border-spacing-0',
                thead: '[&>tr]:bg-elevated/50 [&>tr]:after:content-none',
                tbody: '[&>tr]:last:[&>td]:border-b-0',
                th: 'py-2 first:rounded-l-lg last:rounded-r-lg border-y border-default first:border-l last:border-r',
                td: 'border-b border-default',
                tr: '[&:has(>td[colspan])]:hidden',
            }"
        />

        <!-- 统计信息 -->
        <div class="border-default mt-auto flex items-center justify-between gap-3 border-t pt-4">
            <div class="text-muted text-sm">
                {{ t("system-perms.permission.totalCount", { count: permissions.length }) }}
            </div>

            <div class="flex items-center gap-1.5">
                <UButton
                    size="xs"
                    color="gray"
                    variant="ghost"
                    :label="t('system-perms.permission.groupView')"
                    icon="i-lucide-layers"
                    @click="() => {}"
                />
            </div>
        </div>
    </div>
</template>
