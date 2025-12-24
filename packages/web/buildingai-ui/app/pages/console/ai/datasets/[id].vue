<script setup lang="ts">
import { apiGetDatasetDetail } from "@buildingai/service/consoleapi/ai-datasets";
import type { NavigationMenuItem } from "@nuxt/ui";

const route = useRoute();
const router = useRouter();
const { t } = useI18n();
const isMobile = useMediaQuery("(max-width: 1380px)");
const { hasAccessByCodes } = useAccessControl();
const datasetId = computed(() => (route.params as Record<string, string>).id);
const collapsed = ref<boolean>(false);

const { data: dataset } = await useAsyncData(`dataset-detail-${datasetId.value}`, () =>
    apiGetDatasetDetail(datasetId.value as string),
);

provide("datasets", dataset);

// 分段模式映射
const segmentModeMap = {
    normal: t("ai-datasets.backend.create.segment.general"),
    hierarchical: t("ai-datasets.backend.create.segment.hierarchical"),
} as const;

// 检索模式映射
const retrievalModeMap = {
    vector: t("ai-datasets.backend.retrieval.vector"),
    fullText: t("ai-datasets.backend.retrieval.fullText"),
    hybrid: t("ai-datasets.backend.retrieval.hybrid"),
} as const;

watch(isMobile, (newVal) => {
    if (newVal) {
        collapsed.value = true;
    } else {
        collapsed.value = false;
    }
});
</script>

<template>
    <div class="flex h-full min-h-0 w-full" v-if="dataset !== undefined">
        <div
            class="bg-muted flex h-full w-50 flex-none flex-col rounded-tr-xl rounded-br-xl p-4"
            :class="{ 'w-18!': collapsed }"
        >
            <div class="flex flex-col space-y-3">
                <div
                    class="flex items-center justify-between gap-2"
                    :class="{ 'flex-col!': collapsed }"
                >
                    <UButton
                        variant="soft"
                        color="neutral"
                        size="lg"
                        leading-icon="i-lucide-arrow-left"
                        @click="router.replace(useRoutePath('ai-datasets:list'))"
                    />

                    <div class="bg-primary-50 border-default flex rounded-lg border p-2">
                        <UIcon name="i-lucide-folder" class="text-primary size-5" />
                    </div>
                </div>

                <UTooltip :text="dataset?.name" :delay-duration="0" v-if="!collapsed">
                    <div class="text-foreground line-clamp-2 text-sm font-medium">
                        {{ dataset?.name }}
                    </div>
                </UTooltip>

                <div class="text-muted-foreground text-xs" v-if="!collapsed">
                    {{ dataset?.description }}
                </div>

                <div class="text-muted-foreground flex flex-col space-y-3 text-xs">
                    <div class="flex items-center justify-between font-medium" v-if="!collapsed">
                        <span> {{ t("ai-datasets.backend.create.stepThree.segmentMode") }}：</span>
                        {{ segmentModeMap[dataset?.indexingConfig?.documentMode || "normal"] }}
                    </div>

                    <div class="flex items-center justify-between font-medium" v-if="!collapsed">
                        <span>{{ t("ai-datasets.backend.common.retrievalMode") }}：</span>
                        {{ retrievalModeMap[dataset?.retrievalConfig?.retrievalMode || "vector"] }}
                    </div>

                    <div class="flex items-center justify-between font-medium" v-if="!collapsed">
                        <span>{{ t("ai-datasets.backend.dataset.table.storageSize") }}：</span>
                        {{ formatFileSize(dataset?.storageSize * 1) }}
                    </div>

                    <div
                        class="text-accent-foreground flex items-center justify-between font-medium"
                        v-if="!collapsed"
                    >
                        <span>{{ $t("ai-datasets.backend.menu.relatedApplications") }}：</span>
                        {{ dataset?.relatedAgentCount || 0 }}
                    </div>
                </div>
            </div>
            <USeparator class="my-3 flex" />
            <div class="flex h-full w-full flex-col justify-between">
                <UNavigationMenu
                    orientation="vertical"
                    :collapsed="collapsed"
                    :items="
                        [
                            hasAccessByCodes(['ai-datasets-documents:list'])
                                ? {
                                      label: $t('ai-datasets.backend.menu.documents'),
                                      icon: 'i-lucide-files',
                                      to: useRoutePath('ai-datasets-documents:list', {
                                          id: datasetId as string,
                                      }),
                                      active:
                                          route.path.includes(
                                              `/console/datasets/${datasetId}/segments`,
                                          ) ||
                                          route.path.includes(
                                              `/console/datasets/${datasetId}/documents`,
                                          ),
                                  }
                                : null,
                            hasAccessByCodes(['ai-datasets:retrieval-test'])
                                ? {
                                      label: $t('ai-datasets.backend.menu.retrieval'),
                                      icon: 'i-lucide-radar',
                                      to: useRoutePath('ai-datasets:retrieval-test', {
                                          id: datasetId as string,
                                      }),
                                  }
                                : null,
                            hasAccessByCodes(['ai-datasets-team-members:list'])
                                ? {
                                      label: $t('ai-datasets.backend.menu.members'),
                                      icon: 'i-lucide-users',
                                      to: useRoutePath('ai-datasets-team-members:list', {
                                          id: datasetId as string,
                                      }),
                                  }
                                : null,
                            hasAccessByCodes(['ai-datasets:update'])
                                ? {
                                      label: $t('ai-datasets.backend.menu.settings'),
                                      icon: 'i-lucide-settings-2',
                                      to: useRoutePath('ai-datasets:update', {
                                          id: datasetId as string,
                                      }),
                                  }
                                : null,
                        ].filter(Boolean) as NavigationMenuItem[]
                    "
                    class="data-[orientation=vertical]:w-full"
                    :ui="{
                        list: 'space-y-1',
                        link: collapsed ? 'p-2.5' : 'p-2 pl-3',
                        linkLeadingIcon: collapsed ? 'size-5' : 'size-4',
                    }"
                />

                <div
                    class="mt-auto flex items-center justify-center"
                    :class="{ 'justify-between!': !collapsed }"
                >
                    <UButton
                        data-sidebar="trigger"
                        variant="ghost"
                        color="neutral"
                        size="xs"
                        :ui="{ base: 'py-2' }"
                        @click="collapsed = !collapsed"
                    >
                        <template v-if="!collapsed">
                            <UIcon name="i-lucide-panel-right" class="size-5" />
                        </template>
                        <template v-else>
                            <UIcon name="i-lucide-panel-left" class="size-5" />
                        </template>
                        <span class="sr-only">侧边栏切换</span>
                    </UButton>
                </div>
            </div>
        </div>
        <!-- <USeparator orientation="vertical" /> -->
        <!-- 内容区域 -->
        <NuxtPage />
    </div>

    <div v-else class="flex h-[calc(100vh-6rem)] items-center justify-center text-center">
        <div class="max-w-md">
            <h1 class="text-error mb-4 text-6xl font-extrabold">403</h1>
            <p class="mb-2 text-xl font-semibold text-gray-800">
                {{ $t("ai-datasets.backend.permission.title") }}
            </p>
            <p class="text-muted-foreground mb-6">
                {{ $t("ai-datasets.backend.permission.description") }}
            </p>

            <UButton to="/" color="primary" size="lg" icon="i-heroicons-arrow-left">
                {{ $t("ai-datasets.backend.permission.back") }}
            </UButton>
        </div>
    </div>
</template>
