<script setup lang="ts">
import type { McpServerInfo, ToolsItem } from "@buildingai/service/webapi/mcp-server";
import {
    apiCheckMcpServerConnect,
    apiGetMcpServerDetail,
    apiGetSystemMcpServerDetail,
} from "@buildingai/service/webapi/mcp-server";

const props = defineProps<{
    id?: string | null;
    isView?: boolean;
    isJsonImport?: boolean;
    isSystemMcp?: boolean;
}>();
const emits = defineEmits<{
    (e: "close", refresh?: boolean): void;
}>();

const mcpServerId = computed(() => props.id || (route.query.id as string) || null);
const { t } = useI18n();
const toast = useMessage();
const route = useRoute();

const state = shallowReactive({
    reconnecting: false,
    formData: {
        mcpServerId: "",
        name: "",
        description: "",
        icon: "",
        type: "user" as "user" | "system",
        providerName: "",
        url: "",
        sortOrder: 0,
        isDisabled: false,
        creatorId: "",
        connectError: "",
        connectable: false,
        tools: [] as ToolsItem[],
        isShow: false,
        isAssociated: false,
        communicationType: "",
    } as McpServerInfo,
});

const { lockFn: fetchDetail, isLock: detailLoading } = useLockFn(async () => {
    try {
        let data: McpServerInfo;

        if (props.isSystemMcp) {
            data = await apiGetSystemMcpServerDetail(mcpServerId.value as string);
        } else {
            data = await apiGetMcpServerDetail(mcpServerId.value as string);
        }
        Object.assign(state.formData, data);
    } catch (error) {
        console.error("获取供应商详情失败:", error);
    }
});

const { lockFn: handleReconnect, isLock: reconnectLoading } = useLockFn(async () => {
    try {
        const res = await apiCheckMcpServerConnect(mcpServerId.value as string);
        if (res.connectable) {
            toast.success(res.message);
            fetchDetail();
            state.reconnecting = true;
        } else {
            toast.error(res.message);
        }
    } catch (error) {
        console.error("重新链接失败:", error);
    }
});

// 转换通信类型显示
const communicationTypeText = computed(() => {
    if (!state.formData.communicationType) {
        return "";
    }
    if (state.formData.communicationType.includes("-")) {
        return state.formData.communicationType.replace("-", " ").toUpperCase();
    }
    return state.formData.communicationType?.toUpperCase();
});

onMounted(async () => mcpServerId.value && (await fetchDetail()));
</script>

<template>
    <BdModal
        :title="t('ai-mcp.backend.detailTitle')"
        :description="t('ai-mcp.backend.detailTitle')"
        :ui="{
            content: 'max-w-2xl overflow-y-auto h-fit',
        }"
        @close="emits('close', state.reconnecting)"
    >
        <div v-if="detailLoading" class="flex items-center justify-center" style="height: 400px">
            <UIcon name="i-lucide-loader-2" class="size-8 animate-spin" />
        </div>
        <div v-else class="max-h-180">
            <div class="flex justify-between pb-4">
                <div class="flex items-center gap-4">
                    <UAvatar
                        :src="state.formData.icon"
                        :alt="state.formData.name"
                        size="3xl"
                        :ui="{ root: 'rounded-lg' }"
                    />
                    <div>
                        <h3
                            class="text-secondary-foreground flex items-center text-base font-semibold"
                        >
                            <UTooltip :text="state.formData.name" :delay="0">
                                <span class="line-clamp-1">
                                    {{ state.formData.name }}
                                </span>
                            </UTooltip>
                        </h3>
                        <UBadge :color="state.formData.type === 'user' ? 'info' : 'primary'">{{
                            state.formData.type === "user"
                                ? t("ai-mcp.frontend.detail.custom")
                                : t("ai-mcp.frontend.detail.system")
                        }}</UBadge>
                    </div>
                </div>
                <UButton
                    v-if="!state.formData.connectable && state.formData.type === 'user'"
                    class="h-fit"
                    :loading="reconnectLoading"
                    icon="tabler:reload"
                    :ui="{ leadingIcon: 'size-4' }"
                    variant="soft"
                    size="md"
                    color="error"
                    @click="handleReconnect()"
                >
                    {{ t("ai-mcp.backend.detail.reconnect") }}
                </UButton>
            </div>
            <div class="bg-muted rounded-lg p-4 pb-4">
                <p class="text-muted-foreground text-xs">
                    {{ state.formData.description || t("ai-mcp.frontend.detail.noDescription") }}
                </p>
            </div>

            <div class="grid grid-cols-1 gap-x-6 gap-y-4 py-4 pb-4 md:grid-cols-2">
                <div v-if="state.formData.type === 'user'">
                    <div class="text-muted-foreground text-sm">
                        {{ t("ai-mcp.frontend.detail.url") }}
                    </div>
                    <UTooltip
                        :text="state.formData.url"
                        :ui="{
                            content:
                                'max-w-100 !whitespace-pre-wrap break-all leading-relaxed h-fit p-2',
                        }"
                        :delay-duration="0"
                    >
                        <template #content>
                            <div class="max-w-100">
                                {{ state.formData.url }}
                            </div>
                        </template>
                        <div class="text-secondary-foreground mt-1 truncate font-medium">
                            {{ state.formData.url }}
                        </div>
                    </UTooltip>
                </div>
                <div v-if="!props.isSystemMcp">
                    <div class="text-muted-foreground text-sm">
                        {{ t("ai-mcp.frontend.detail.status") }}
                    </div>
                    <div class="text-secondary-foreground mt-1 font-medium">
                        <UBadge :color="!state.formData.isDisabled ? 'success' : 'warning'">{{
                            !state.formData.isDisabled
                                ? t("ai-mcp.frontend.detail.enabled")
                                : t("ai-mcp.frontend.detail.disabled")
                        }}</UBadge>
                    </div>
                </div>
                <div>
                    <div class="text-muted-foreground text-sm">
                        {{ t("ai-mcp.frontend.detail.sortOrder") }}
                    </div>
                    <div class="text-secondary-foreground mt-1 font-medium">
                        {{ state.formData.sortOrder }}
                    </div>
                </div>
                <div>
                    <div class="text-muted-foreground text-sm">
                        {{ t("ai-mcp.backend.detail.connectStatus") }}
                    </div>
                    <div class="text-secondary-foreground mt-1 font-medium">
                        <UBadge :color="state.formData.connectable ? 'success' : 'error'">{{
                            state.formData.connectable
                                ? t("ai-mcp.backend.detail.connectSuccess")
                                : t("ai-mcp.backend.detail.connectFailed")
                        }}</UBadge>
                    </div>
                </div>

                <div>
                    <div class="text-muted-foreground text-sm">
                        {{ t("ai-mcp.backend.detail.communicationType") }}
                    </div>
                    <div class="text-secondary-foreground mt-1 font-medium">
                        <UBadge color="neutral" variant="soft">
                            {{ communicationTypeText }}
                        </UBadge>
                    </div>
                </div>

                <div>
                    <div class="text-muted-foreground text-sm">
                        {{ t("ai-mcp.backend.detail.connectError") }}
                    </div>
                    <div
                        v-if="state.formData.connectError"
                        class="text-error mt-1 text-sm font-medium"
                    >
                        {{ state.formData.connectError }}
                    </div>
                    <div v-else class="mt-1 text-sm font-medium">-</div>
                </div>
            </div>

            <div v-if="state.formData.tools && state.formData.tools.length > 0" class="pb-4">
                <h4 class="text-secondary-foreground mb-2 text-base font-medium">
                    {{ t("ai-mcp.backend.detail.tools") }}
                </h4>
                <div class="max-h-80 space-y-2 overflow-y-auto">
                    <div
                        v-for="(tool, index) in state.formData.tools"
                        :key="index"
                        class="border-muted rounded-lg border p-4"
                    >
                        <div class="text-secondary-foreground font-medium">{{ tool.name }}</div>
                        <div class="text-muted-foreground mt-1 text-sm">
                            {{ tool.description }}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </BdModal>
</template>
