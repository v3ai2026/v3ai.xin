<script lang="ts" setup>
import type { Dataset } from "@buildingai/service/consoleapi/ai-datasets";

import type { DropdownMenuItem } from "#ui/types";

const props = defineProps<{
    dataset: Dataset;
}>();
const emit = defineEmits<{
    (e: "delete", dataset: Dataset): void;
    (e: "settings", dataset: Dataset): void;
    (e: "retry", dataset: Dataset): void;
}>();

const router = useRouter();
const { t } = useI18n();
const { hasAccessByCodes } = useAccessControl();

// 检索模式标签
const retrievalModeLabels = {
    vector: { value: t("ai-datasets.backend.retrieval.vector"), color: "primary" },
    fullText: { value: t("ai-datasets.backend.retrieval.fullText"), color: "success" },
    hybrid: { value: t("ai-datasets.backend.retrieval.hybrid"), color: "warning" },
} as const;
type RetrievalMode = keyof typeof retrievalModeLabels;

const handleViewDetail = () => {
    router.push(useRoutePath("ai-datasets-documents:list", { id: props.dataset.id }));
};

const menuItems: DropdownMenuItem[] = [
    hasAccessByCodes(["ai-datasets:update"])
        ? {
              label: t("ai-datasets.backend.menu.settings"),
              color: "primary",
              onSelect: () => emit("settings", props.dataset),
          }
        : null,
    hasAccessByCodes(["ai-datasets:delete"])
        ? {
              label: t("console-common.delete"),
              color: "error",
              onSelect: () => emit("delete", props.dataset),
          }
        : null,
    hasAccessByCodes(["ai-datasets:retry"])
        ? {
              label: t("ai-datasets.backend.dataset.retry.title"),
              color: "warning",
              onSelect: () => emit("retry", props.dataset),
          }
        : null,
].filter(Boolean) as DropdownMenuItem[];
</script>

<template>
    <div
        class="group border-default relative cursor-pointer rounded-lg border p-4 transition-all duration-200 hover:shadow-lg"
        @click="handleViewDetail"
    >
        <div
            class="absolute right-3 bottom-3 z-10 opacity-0 transition-opacity duration-200 group-hover:opacity-100"
            @click.stop
        >
            <UDropdownMenu :items="menuItems" :popper="{ placement: 'bottom-end' }">
                <UButton
                    icon="i-heroicons-ellipsis-vertical"
                    size="xs"
                    color="neutral"
                    variant="ghost"
                    class="opacity-70 hover:opacity-100"
                    @click.stop
                />
            </UDropdownMenu>
        </div>

        <div class="mb-3 flex items-start gap-3">
            <div
                class="border-default bg-primary-50 dark:bg-primary-600! flex size-10 flex-none items-center justify-center rounded-lg border"
            >
                <UIcon
                    name="i-lucide-folder"
                    class="text-primary-500 dark:text-primary-50 h-6 w-6"
                />
            </div>
            <div class="flex min-w-0 flex-1 flex-col">
                <h3 class="text-foreground truncate text-sm font-medium">
                    {{ dataset.name }}
                </h3>

                <div class="text-muted-foreground mt-1 text-xs">
                    {{ dataset.documentCount }} {{ t("ai-datasets.backend.menu.documents") }} ·
                    {{ dataset.chunkCount }} {{ t("ai-datasets.backend.menu.segments") }} · 0
                    {{ t("ai-datasets.backend.menu.relatedApplications") }}
                </div>
            </div>
        </div>

        <div class="text-muted-foreground mb-4 h-10 pr-8 text-xs">
            <p v-if="dataset.description" class="line-clamp-2 overflow-hidden">
                {{ dataset.description }}
            </p>
            <p v-else class="line-clamp-2 overflow-hidden">
                useful for when you want to answer queries about the {{ dataset.name }}
            </p>
        </div>

        <div class="text-muted-foreground mt-1 flex gap-6 text-xs">
            <UTooltip :text="t('ai-datasets.backend.dataset.retrievalMode')" :delay-duration="0">
                <div class="flex items-center">
                    <UChip
                        :color="retrievalModeLabels[dataset.retrievalMode as RetrievalMode].color"
                        size="sm"
                    />
                    <span class="ml-3 text-xs">
                        {{ retrievalModeLabels[dataset.retrievalMode as RetrievalMode].value }}
                    </span>
                </div>
            </UTooltip>

            <UTooltip
                :text="t('ai-datasets.backend.dataset.table.storageSize')"
                :delay-duration="0"
            >
                <div class="flex items-center">
                    <UChip color="neutral" size="sm" />
                    <span class="ml-3 text-xs">
                        {{ t("ai-datasets.backend.dataset.table.storageSize") }}：
                        {{ formatFileSize(dataset.storageSize * 1) }}
                    </span>
                </div>
            </UTooltip>
        </div>
    </div>
</template>
