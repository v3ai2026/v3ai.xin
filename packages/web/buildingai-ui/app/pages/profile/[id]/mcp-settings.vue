<script setup lang="ts">
import type { McpServerInfo } from "@buildingai/service/webapi/mcp-server";
import {
    apiDeleteMcpServer,
    apiGetMcpServerList,
    apiUpdateMcpServerVisible,
} from "@buildingai/service/webapi/mcp-server";

const McpServerEdit = defineAsyncComponent(() => import("../components/mcp-server-edit.vue"));
const McpServerCard = defineAsyncComponent(() => import("../components/web-mcp-card.vue"));
const McpServerDetail = defineAsyncComponent(() => import("../components/mcp-server-detail.vue"));

const toast = useMessage();
const { t } = useI18n();
const overlay = useOverlay();

const searchForm = shallowReactive({
    name: "",
    type: "system" as "system" | "user",
});

const state = shallowReactive({
    isJsonImport: false,
    selectMcpServer: new Set<string>(),
    isSystemMcp: false,
    updateIds: [] as string[],
    systemList: [] as McpServerInfo[],
});

const { paging, getLists } = usePaging({
    fetchFun: apiGetMcpServerList,
    params: searchForm,
});

const handleDeleteProvider = async (mcpServer: McpServerInfo): Promise<void> => {
    if (!mcpServer.id) return;

    try {
        await useModal({
            title: t("ai-mcp.backend.deleteTitle"),
            description: t("ai-mcp.backend.deleteMessage"),
            color: "error",
        });

        await apiDeleteMcpServer(mcpServer.id);
        toast.success(t("ai-mcp.backend.deleteSuccess"));

        state.selectMcpServer.clear();
        getLists();
    } catch (error) {
        console.error("Delete MCP server failed:", error);
        toast.error(t("common.message.deleteFailed"));
    }
};

const mountEditModal = async (serverId: string = "", isJsonImportMode: boolean = false) => {
    const modal = overlay.create(McpServerEdit);

    const instance = modal.open({
        id: serverId,
        isView: false,
        isJsonImport: isJsonImportMode,
        isSystemMcp: state.isSystemMcp,
        onUpdateIds: (ids: string[]) => {
            state.updateIds = ids;
        },
    });
    const shouldRefresh = await instance.result;
    if (shouldRefresh) {
        getLists();
    }
};

const handleViewModels = async (serverId: string) => {
    const modal = overlay.create(McpServerDetail);
    const instance = modal.open({
        id: serverId,
        isView: true,
        isSystemMcp: state.isSystemMcp,
    });
    const shouldRefresh = await instance.result;
    if (shouldRefresh) {
        getLists();
    }
};

const handleAddMcpServer = (): void => {
    mountEditModal();
};

const handleImportMcpServer = (): void => {
    mountEditModal("", true);
};

const handleEditProvider = (provider: McpServerInfo): void => {
    mountEditModal(provider.id);
};

const handleToggleVisible = async (providerId: string, isVisible: boolean): Promise<void> => {
    try {
        await apiUpdateMcpServerVisible(providerId, { status: isVisible });
        toast.success(
            isVisible
                ? t("ai-mcp.backend.form.isActiveEnabled")
                : t("ai-mcp.backend.form.isActiveDisabled"),
        );

        getLists();
    } catch (error) {
        console.error("Toggle MCP server visibility failed:", error);
    }
};

const handleSearchChange = useDebounceFn((): void => {
    state.systemList = [];
    getLists();
}, 500);

definePageMeta({
    title: "menu.mcpServerSetting",
    inSystem: true,
    inLinkSelector: true,
});

onMounted(() => getLists());
</script>

<template>
    <div class="provider-list-container">
        <div
            class="bg-background sticky top-0 z-50 flex flex-wrap items-center justify-between gap-4 pb-4"
        >
            <UTabs
                v-model="searchForm.type"
                color="primary"
                :content="false"
                :items="[
                    {
                        label: t('ai-mcp.backend.search.system'),
                        value: 'system',
                    },
                    {
                        label: t('ai-mcp.backend.userMcp'),
                        value: 'user',
                    },
                ]"
                @update:modelValue="getLists"
            />
            <!-- Search area -->
            <div>
                <UInput
                    v-model="searchForm.name"
                    class="w-50"
                    :placeholder="t('ai-mcp.backend.search.placeholder')"
                    @change="getLists"
                    @update:model-value="handleSearchChange"
                />
            </div>
        </div>

        <!-- Card grid -->
        <template v-if="!paging.loading && paging.items.length > 0">
            <div class="grid grid-cols-1 gap-6 py-2 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3">
                <div v-if="searchForm.type === 'user'" class="rounded-lg border border-dashed p-4">
                    <div class="flex flex-col">
                        <h3 class="text-muted-foreground pb-2 pl-2 text-xs font-bold">
                            {{ t("ai-mcp.backend.addTitle") }}
                        </h3>
                        <div
                            class="text-primary hover:bg-primary-50 flex cursor-pointer items-center rounded-lg px-2 py-2 text-sm"
                            @click="handleAddMcpServer"
                        >
                            <UIcon name="i-lucide-file-plus-2" class="mr-2 size-4" />
                            <span>{{ t("ai-mcp.backend.quickCreateTitle") }}</span>
                        </div>
                        <div
                            class="text-primary hover:bg-primary-50 flex cursor-pointer items-center rounded-lg px-2 py-2 text-sm"
                            @click="handleImportMcpServer"
                        >
                            <UIcon name="i-lucide-file-json-2" class="mr-2 size-4" />
                            <span>{{ t("ai-mcp.backend.importTitle") }}</span>
                        </div>
                    </div>
                </div>
                <McpServerCard
                    v-for="mcpServer in paging.items"
                    :key="mcpServer.id"
                    :mcpServer="mcpServer"
                    :selected="state.selectMcpServer.has(mcpServer.id as string)"
                    :update-ids="state.updateIds"
                    @delete="handleDeleteProvider"
                    @edit="handleEditProvider"
                    @view-models="handleViewModels"
                    @toggle-visible="handleToggleVisible"
                />
            </div>
        </template>

        <!-- Loading state -->
        <div v-else-if="paging.loading" class="flex h-[50vh] items-center justify-center">
            <div class="flex items-center gap-3">
                <UIcon name="i-lucide-loader-2" class="text-primary-500 h-6 w-6 animate-spin" />
                <span class="text-accent-foreground">{{ $t("common.loading") }}</span>
            </div>
        </div>

        <!-- Empty state -->
        <div v-else class="flex h-[50vh] flex-col items-center justify-center">
            <UIcon name="i-lucide-building" class="mb-4 h-16 w-16 text-gray-400" />
            <h3 class="text-secondary-foreground mb-2 text-lg font-medium">
                {{ $t("ai-mcp.backend.emptyState") }}
            </h3>
            <p class="text-accent-foreground">
                {{ $t("ai-mcp.backend.emptyStateDescription") }}
            </p>
            <UButtonGroup orientation="horizontal" class="mt-4">
                <UButton
                    v-if="searchForm.type !== 'system'"
                    icon="i-heroicons-plus"
                    color="primary"
                    @click="handleAddMcpServer"
                >
                    {{ $t("ai-mcp.backend.quickCreateTitle") }}
                </UButton>
                <UButton
                    v-if="searchForm.type !== 'system'"
                    icon="i-lucide-file-json-2"
                    color="primary"
                    variant="subtle"
                    @click="handleImportMcpServer"
                >
                    {{ $t("ai-mcp.backend.importTitle") }}
                </UButton>
            </UButtonGroup>
        </div>

        <!-- Pagination -->
        <div
            v-if="paging.total > 0"
            class="bg-background sticky bottom-0 z-50 flex items-center justify-between gap-3 py-4"
        >
            <div class="text-muted text-sm">
                {{ state.selectMcpServer.size }} {{ $t("console-common.selected") }}
            </div>

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
