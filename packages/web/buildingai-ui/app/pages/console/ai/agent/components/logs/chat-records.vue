<script lang="ts" setup>
import type {
    AgentChatRecord,
    QueryAgentChatRecordParams,
} from "@buildingai/service/consoleapi/ai-agent";
import { apiGetAgentChatRecordList } from "@buildingai/service/consoleapi/ai-agent";
import { useDebounceFn } from "@vueuse/core";

import type { TableColumn, TableRow } from "#ui/types";

import AgentChatRecordDrawer from "./chat-record-modal.vue";

const UButton = resolveComponent("UButton");
const UBadge = resolveComponent("UBadge");
const UDropdownMenu = resolveComponent("UDropdownMenu");
const UIcon = resolveComponent("UIcon");
const UInput = resolveComponent("UInput");
const TimeDisplay = resolveComponent("TimeDisplay");

const props = defineProps<{
    agentId: string;
}>();

const table = useTemplateRef("table");
const { t } = useI18n();
const overlay = useOverlay();

const searchForm = shallowReactive<QueryAgentChatRecordParams>({
    agentId: props.agentId,
    keyword: "",
});

// 列ID到中文名称的映射
const columnLabels = computed(() => ({
    select: t("console-common.select"),
    title: t("ai-agent.backend.logs.dialogTitle"),
    user: t("ai-agent.backend.logs.user"),
    messageCount: t("ai-agent.backend.logs.messageCount"),
    totalTokens: t("ai-agent.backend.logs.totalTokens"),
    consumedPower: t("ai-agent.backend.logs.consumedPower"),
    updatedAt: t("ai-agent.backend.logs.updatedAt"),
}));

// 分页查询对话记录
const { paging, getLists } = usePaging<AgentChatRecord>({
    fetchFun: apiGetAgentChatRecordList,
    params: searchForm,
});

// 定义表格列
const columns: TableColumn<AgentChatRecord>[] = [
    {
        accessorKey: "title",
        header: () => h("p", { class: "" }, `${columnLabels.value.title}`),
        cell: ({ row }) => {
            return h("div", { class: "flex items-center gap-3" }, [
                h(UIcon, {
                    name: "i-lucide-message-circle",
                    class: "text-primary size-5",
                }),
                h("div", { class: "flex-1 grid" }, [
                    h(
                        "p",
                        {
                            class: "font-medium text-highlighted truncate",
                            title: row.original.title,
                        },
                        row.original.title,
                    ),
                ]),
            ]);
        },
    },
    {
        accessorKey: "user",
        header: () => h("p", { class: "" }, `${columnLabels.value.user}`),
        cell: ({ row }) => {
            const user = row.original.user;
            if (!user)
                return h(
                    "span",
                    { class: "text-muted-foreground" },
                    row.original.anonymousIdentifier,
                );

            return h("div", { class: "flex items-center gap-3" }, [
                // 用户头像
                user.avatar
                    ? h("img", {
                          src: user.avatar,
                          alt: user.nickname || user.username,
                          class: "w-8 h-8 rounded-full object-cover flex-none",
                      })
                    : h(
                          "div",
                          {
                              class: "w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center flex-none",
                          },
                          [
                              h(
                                  "span",
                                  { class: "text-xs font-medium text-primary" },
                                  (user.nickname || user.username).charAt(0).toUpperCase(),
                              ),
                          ],
                      ),
                // 用户信息
                h("div", { class: "flex flex-col min-w-0" }, [
                    h(
                        "span",
                        {
                            class: "text-sm font-medium truncate",
                            title: user.nickname || user.username,
                        },
                        user.nickname || user.username,
                    ),
                ]),
            ]);
        },
    },
    {
        accessorKey: "messageCount",
        header: () => h("p", { class: "whitespace-nowrap" }, `${columnLabels.value.messageCount}`),
        cell: ({ row }) => {
            const messageCount = row.getValue("messageCount") as number;
            return h(UBadge, { color: "primary", variant: "subtle" }, () =>
                messageCount.toString(),
            );
        },
    },
    {
        accessorKey: "totalTokens",
        header: () => h("p", { class: "whitespace-nowrap" }, `${columnLabels.value.totalTokens}`),
        cell: ({ row }) => {
            const totalTokens = row.original.totalTokens || 0;
            return h(
                "span",
                { class: "text-sm text-primary" },
                `${formatCompactNumber(totalTokens)}`,
            );
        },
    },
    {
        accessorKey: "consumedPower",
        header: () => h("p", { class: "whitespace-nowrap" }, `${columnLabels.value.consumedPower}`),
        cell: ({ row }) => {
            const consumedPower = row.original.consumedPower || 0;
            return h(
                "span",
                { class: "text-sm text-orange-600 font-medium" },
                `${formatCompactNumber(consumedPower)}`,
            );
        },
    },
    {
        accessorKey: "updatedAt",
        header: ({ column }) => {
            const isSorted = column.getIsSorted();

            return h(UButton, {
                color: "neutral",
                variant: "ghost",
                label: columnLabels.value.updatedAt,
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
            const updatedAt = row.getValue("updatedAt") as string;
            return h(TimeDisplay, {
                datetime: updatedAt,
                mode: "datetime",
            });
        },
    },
];

// 监听搜索条件变化，自动重新获取数据
watch(
    () => searchForm.keyword,
    () => {
        useDebounceFn(() => {
            paging.page = 1;
            getLists();
        }, 300)();
    },
    { deep: true },
);

// 点击表格行显示对话记录详情
const handleRowClick = (row: TableRow<AgentChatRecord>) => {
    const modal = overlay.create(AgentChatRecordDrawer);

    modal.open({
        open: true,
        recordId: row.original.id,
        agentId: props.agentId,
    });
};

// 监听 agentId 变化，重新获取数据
watch(
    () => props.agentId,
    (newAgentId) => {
        searchForm.agentId = newAgentId;
        paging.page = 1;
        getLists();
    },
);

// 初始化
onMounted(() => getLists());
</script>

<template>
    <div class="flex h-full w-full flex-col">
        <!-- 搜索区域 -->
        <div class="flex h-full flex-1 flex-col">
            <div class="flex w-full justify-between gap-4 py-4 backdrop-blur-sm">
                <div class="flex items-center gap-2">
                    <UInput
                        v-model="searchForm.keyword"
                        :placeholder="t('ai-agent.backend.logs.dialogSearchPlaceholder')"
                        class="w-80"
                        icon="i-lucide-search"
                    />
                </div>

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

                    <UButton
                        :label="t('console-common.refresh')"
                        color="neutral"
                        variant="outline"
                        leading-icon="i-lucide-refresh-cw"
                        @click="getLists"
                    />
                </div>
            </div>

            <!-- 表格区域 -->
            <div class="flex h-full flex-1 flex-col">
                <div class="table h-full">
                    <UTable
                        :loading="paging.loading"
                        :data="paging.items"
                        :columns="columns"
                        class="h-full"
                        ref="table"
                        sticky
                        selectable
                        :ui="{
                            base: 'table-fixed border-separate border-spacing-0',
                            thead: '[&>tr]:bg-elevated/50 [&>tr]:after:content-none',
                            tbody: '[&>tr]:last:[&>td]:border-b-0',
                            th: 'py-2 first:rounded-l-lg last:rounded-r-lg border-y border-default first:border-l last:border-r',
                            td: 'border-b border-default',
                            tr: 'hover:bg-elevated/50 cursor-pointer',
                        }"
                        :onSelect="handleRowClick"
                    />
                </div>
            </div>

            <!-- 分页 -->
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
    </div>
</template>
