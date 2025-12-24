<script setup lang="ts">
import type { McpServerInfo } from "@buildingai/service/webapi/mcp-server";
import { apiCheckMcpServerConnect } from "@buildingai/service/webapi/mcp-server";

interface ProviderCardProps {
    mcpServer: McpServerInfo;
    selected?: boolean;
    updateIds?: string[];
}

interface ProviderCardEmits {
    (e: "select", mcpServer: McpServerInfo, selected: boolean | "indeterminate"): void;
    (e: "delete", mcpServer: McpServerInfo): void;
    (e: "edit", mcpServer: McpServerInfo): void;
    (e: "view-models", mcpServerId: string): void;
    (e: "remove-system", mcpServerId: string): void;
    (e: "toggle-visible", mcpServerId: string, isActive: boolean): void;
}

const props = withDefaults(defineProps<ProviderCardProps>(), {
    selected: false,
});

const emit = defineEmits<ProviderCardEmits>();
const { t } = useI18n();

const connectable = ref<boolean | "">("");
const connectableError = ref<string | undefined>("");

const handleCheckConnect = async () => {
    const res = await apiCheckMcpServerConnect(props.mcpServer.id);
    connectable.value = res.connectable;
    connectableError.value = res.error;
};

const connectableType = computed(() => {
    return connectable.value === "" ? props.mcpServer.connectable : connectable.value;
});

const connectableErrorInfo = computed(() => {
    return connectable.value === "" ? props.mcpServer.connectError : connectableError.value;
});
function _getMcpServerStatusInfo(isActive: boolean) {
    if (isActive) {
        return {
            label: t("console-common.disabled"),
            color: "error" as const,
            icon: "i-lucide-x-circle",
        };
    } else {
        return {
            label: t("console-common.enabled"),
            color: "success" as const,
            icon: "i-lucide-check-circle",
        };
    }
}

const dropdownActions = computed(() => {
    const items = [];

    if (props.mcpServer.type === "user") {
        items.push({
            label: t("console-common.edit"),
            icon: "i-lucide-edit",
            onSelect: () => emit("edit", props.mcpServer),
        });
    }

    if (props.mcpServer.type === "user") {
        if (items.length > 0) {
            items.push({
                type: "separator" as const,
                label: "",
                onSelect: () => {},
            });
        }
        items.push({
            label: t("console-common.delete"),
            icon: "i-lucide-trash-2",
            color: "error" as const,
            onSelect: () => emit("delete", props.mcpServer),
        });
    }

    return items;
});

function handleCardClick() {
    emit("view-models", props.mcpServer.id);
}

function handleSelect(selected: boolean | "indeterminate") {
    if (typeof selected === "boolean") {
        emit("select", props.mcpServer, selected);
    }
}

onMounted(() => {
    if (props.updateIds?.includes(props.mcpServer.id)) {
        handleCheckConnect();
        props.updateIds?.splice(props.updateIds.indexOf(props.mcpServer.id), 1);
    }
});
</script>

<template>
    <BdCard
        class="flex flex-col overflow-hidden"
        show-actions
        variant="outlined"
        :selected="selected"
        :actions="dropdownActions"
        @select="handleSelect"
    >
        <template #icon="{ groupHoverClass, selectedClass }">
            <div class="flex items-center gap-4">
                <UChip :color="connectableType ? 'success' : 'error'" position="top-right">
                    <UAvatar
                        :src="mcpServer.icon"
                        :alt="mcpServer.name"
                        size="3xl"
                        :ui="{ root: 'rounded-lg', fallback: 'text-inverted' }"
                        :class="[
                            groupHoverClass,
                            selectedClass,
                            mcpServer.icon ? '' : 'bg-primary',
                        ]"
                    />
                </UChip>
                <div>
                    <div class="flex items-center gap-2">
                        <h3
                            class="text-secondary-foreground flex items-center text-base font-semibold"
                        >
                            <UTooltip :text="mcpServer.name" :delay="0">
                                <span class="line-clamp-1">
                                    {{ mcpServer.alias || mcpServer.name }}
                                </span>
                            </UTooltip>
                        </h3>
                    </div>
                    <a
                        class="text-muted-foreground line-clamp-1 text-xs"
                        target="_blank"
                        rel="noopener noreferrer"
                    >
                        @ {{ mcpServer.providerName }}
                    </a>
                </div>
            </div>
        </template>

        <template #description>
            <UTooltip
                :disabled="!mcpServer.description"
                :text="mcpServer.description"
                :ui="{
                    content: 'max-w-100 !whitespace-pre-wrap leading-relaxed h-fit p-2',
                }"
                :delay-duration="0"
            >
                <template #content>
                    <div class="max-w-100">
                        {{ mcpServer.description }}
                    </div>
                </template>
                <h4 v-if="mcpServer.description" class="text-muted-foreground line-clamp-2 text-xs">
                    {{ mcpServer.description }}
                </h4>
                <h4 v-else class="text-muted-foreground line-clamp-2 text-xs">
                    {{ t("ai-mcp.backend.noDescription") }}
                </h4>
            </UTooltip>
            <UTooltip :text="connectableErrorInfo" :delay-duration="0">
                <div v-if="connectableErrorInfo" class="flex flex-row items-center gap-1.5">
                    <UIcon name="tabler:plug-connected-x" size="16" class="text-red-500" />
                    <h4 class="line-clamp-2 text-xs text-red-500">
                        {{ connectableErrorInfo }}
                    </h4>
                </div>
            </UTooltip>
        </template>

        <template #footer>
            <div class="flex items-center justify-between gap-2">
                <USwitch
                    :model-value="!mcpServer.isDisabled"
                    @update:model-value="(val) => emit('toggle-visible', mcpServer.id, !val)"
                    size="md"
                />

                <div class="flex items-center gap-1">
                    <UButton icon="i-lucide-eye" variant="ghost" size="sm" @click="handleCardClick">
                        {{ t("console-common.check") }}
                    </UButton>
                </div>
            </div>
        </template>
    </BdCard>
</template>
