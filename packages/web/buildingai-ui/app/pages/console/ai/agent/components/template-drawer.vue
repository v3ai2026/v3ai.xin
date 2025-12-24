<script setup lang="ts">
import type { AgentTemplateConfig } from "@buildingai/service/consoleapi/ai-agent";
import {
    apiGetAgentTemplateCategories,
    apiGetAgentTemplates,
    apiGetRecommendedTemplates,
} from "@buildingai/service/consoleapi/ai-agent";

const TemplateCreateModal = defineAsyncComponent(() => import("./template-create-modal.vue"));

const emit = defineEmits<{
    (e: "close", refresh?: boolean): void;
}>();

const { t } = useI18n();
const overlay = useOverlay();

const templates = shallowRef<AgentTemplateConfig[]>([]);
const recommendedTemplates = shallowRef<AgentTemplateConfig[]>([]);
const searchKeyword = shallowRef("");
const selectedCategory = shallowRef("all");
const categories = shallowRef<string[]>([]);

const isOpen = shallowRef(true);

const { lockFn: loadTemplates, isLock: templatesLoading } = useLockFn(async () => {
    try {
        const [templatesData, categoriesData, recommendedData] = await Promise.all([
            apiGetAgentTemplates(),
            apiGetAgentTemplateCategories(),
            apiGetRecommendedTemplates(),
        ]);

        templates.value = templatesData;
        categories.value = categoriesData;
        recommendedTemplates.value = recommendedData;
    } catch (error: unknown) {
        console.error(error);
    }
});

const filteredTemplates = computed(() => {
    let filtered: AgentTemplateConfig[];

    if (selectedCategory.value === "recommended") {
        filtered = recommendedTemplates.value;
    } else {
        filtered = templates.value;
    }

    if (searchKeyword.value.trim()) {
        filtered = filtered.filter(
            (t) =>
                t.name.toLowerCase().includes(searchKeyword.value.toLowerCase()) ||
                t.description?.toLowerCase().includes(searchKeyword.value.toLowerCase()),
        );
    }

    if (selectedCategory.value !== "recommended" && selectedCategory.value !== "all") {
        filtered = filtered.filter((t) => t?.categories === selectedCategory.value);
    }

    return filtered;
});

const selectTemplate = async (template: AgentTemplateConfig) => {
    const modal = overlay.create(TemplateCreateModal);

    const instance = modal.open({ template });
    const shouldRefresh = await instance.result;
    if (shouldRefresh) {
        emit("close", true);
        isOpen.value = false;
    }
};

const handleClose = () => {
    emit("close");
    isOpen.value = false;
};

onMounted(() => loadTemplates());
</script>

<template>
    <div>
        <UDrawer
            v-model:open="isOpen"
            :set-background-color-on-scale="false"
            direction="right"
            should-scale-background
            :handle-only="true"
            class="bg-muted w-full max-w-[85%]"
            @close="handleClose"
        >
            <template #content>
                <div class="flex h-full w-full flex-col">
                    <div class="px-6 py-4">
                        <div class="relative flex items-center justify-between gap-4">
                            <h2 class="text-lg font-medium">
                                {{ t("ai-agent.backend.template.applyFromTemplate") }}
                            </h2>
                            <div
                                class="absolute top-1/2 right-1/2 translate-x-1/2 -translate-y-1/2"
                            >
                                <UInput
                                    v-model="searchKeyword"
                                    :placeholder="t('ai-agent.backend.template.searchPlaceholder')"
                                    icon="i-lucide-search"
                                    size="lg"
                                    :ui="{ base: 'w-sm' }"
                                />
                            </div>
                            <UButton
                                color="neutral"
                                variant="ghost"
                                icon="i-lucide-x"
                                size="sm"
                                @click="handleClose"
                            />
                        </div>
                    </div>

                    <div class="flex justify-center px-6 pt-6 pb-2">
                        <div class="flex gap-4 overflow-x-auto">
                            <UButton
                                :color="selectedCategory === 'all' ? 'primary' : 'neutral'"
                                :variant="selectedCategory === 'all' ? 'solid' : 'soft'"
                                size="sm"
                                @click="selectedCategory = 'all'"
                            >
                                {{ t("ai-agent.backend.template.all") }}
                            </UButton>
                            <UButton
                                v-for="category in categories"
                                :key="category"
                                :color="selectedCategory === category ? 'primary' : 'neutral'"
                                :variant="selectedCategory === category ? 'solid' : 'soft'"
                                size="sm"
                                @click="selectedCategory = category"
                            >
                                {{ category }}
                            </UButton>
                        </div>
                    </div>

                    <div class="flex-1 overflow-hidden">
                        <div class="h-full overflow-y-auto py-6 pr-6 pl-4">
                            <div
                                v-if="templatesLoading"
                                class="flex items-center justify-center py-12"
                            >
                                <UIcon name="i-lucide-loader-2" class="h-8 w-8 animate-spin" />
                            </div>

                            <div
                                v-else-if="filteredTemplates.length === 0"
                                class="py-12 text-center"
                            >
                                <UIcon
                                    name="i-lucide-package"
                                    class="text-muted-foreground mx-auto h-12 w-12"
                                />
                                <p class="text-muted-foreground mt-2">
                                    {{
                                        searchKeyword
                                            ? t("ai-agent.backend.template.noMatchingTemplates")
                                            : t("ai-agent.backend.template.noAvailableTemplates")
                                    }}
                                </p>
                            </div>

                            <div v-else class="space-y-6">
                                <div
                                    v-if="
                                        selectedCategory === 'all' &&
                                        !searchKeyword &&
                                        recommendedTemplates.length > 0
                                    "
                                >
                                    <h3 class="text-muted-foreground mb-4 text-sm font-medium">
                                        {{ t("ai-agent.backend.template.recommendedTemplates") }}
                                    </h3>
                                    <div
                                        class="grid gap-5 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5"
                                    >
                                        <div
                                            v-for="template in recommendedTemplates"
                                            :key="template.id"
                                            class="border-default bg-background hover:border-primary group relative rounded-lg border p-4 shadow-xs transition-all"
                                        >
                                            <div class="flex items-start gap-3">
                                                <NuxtImg
                                                    :src="template.avatar"
                                                    class="size-12 flex-none rounded-lg"
                                                />
                                                <div
                                                    class="flex flex-col items-start justify-around"
                                                >
                                                    <div class="flex items-center gap-2">
                                                        <h4 class="font-medium">
                                                            {{ template.name }}
                                                        </h4>
                                                        <UBadge color="primary" size="sm">
                                                            {{
                                                                t(
                                                                    "ai-agent.backend.template.recommended",
                                                                )
                                                            }}
                                                        </UBadge>
                                                    </div>
                                                    <p class="text-muted-foreground mt-1 text-xs">
                                                        {{
                                                            template.categories ||
                                                            t("ai-agent.backend.template.general")
                                                        }}
                                                    </p>
                                                </div>
                                            </div>
                                            <p
                                                class="text-muted-foreground mt-2 line-clamp-3 text-sm"
                                            >
                                                {{ template.description }}
                                            </p>
                                            <!-- 悬浮按钮 -->
                                            <div
                                                class="card-shadow absolute inset-x-0 bottom-0 flex justify-center opacity-0 transition-opacity group-hover:opacity-100"
                                            >
                                                <UButton
                                                    color="primary"
                                                    size="sm"
                                                    class="w-full justify-center text-center"
                                                    icon="i-lucide-plus"
                                                    @click="selectTemplate(template)"
                                                >
                                                    {{ t("ai-agent.backend.template.useTemplate") }}
                                                </UButton>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <!-- 主模板区域 -->
                                <div>
                                    <h3 class="text-muted-foreground mb-4 text-sm font-medium">
                                        {{ t("ai-agent.backend.template.allTemplates") }}
                                    </h3>
                                    <div
                                        class="grid gap-5 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5"
                                    >
                                        <div
                                            v-for="template in filteredTemplates"
                                            :key="template.id"
                                            class="border-default bg-background hover:border-primary group relative rounded-lg border p-4 shadow-xs transition-all"
                                        >
                                            <div class="flex items-start gap-3">
                                                <NuxtImg
                                                    :src="template.avatar"
                                                    class="size-12 flex-none rounded-lg"
                                                />
                                                <div
                                                    class="flex flex-col items-start justify-around"
                                                >
                                                    <div class="flex items-center gap-2">
                                                        <h4 class="font-medium">
                                                            {{ template.name }}
                                                        </h4>
                                                        <UBadge
                                                            v-if="template.isRecommended"
                                                            color="primary"
                                                            size="sm"
                                                        >
                                                            {{
                                                                t(
                                                                    "ai-agent.backend.template.recommended",
                                                                )
                                                            }}
                                                        </UBadge>
                                                    </div>
                                                    <p class="text-muted-foreground mt-1 text-xs">
                                                        {{
                                                            template.categories ||
                                                            t("ai-agent.backend.template.general")
                                                        }}
                                                    </p>
                                                </div>
                                            </div>
                                            <p
                                                class="text-muted-foreground mt-2 line-clamp-3 text-sm"
                                            >
                                                {{ template.description }}
                                            </p>
                                            <!-- 悬浮按钮 -->
                                            <div
                                                class="card-shadow absolute inset-x-0 bottom-0 flex justify-center opacity-0 transition-opacity group-hover:opacity-100"
                                            >
                                                <UButton
                                                    color="primary"
                                                    size="sm"
                                                    class="w-full justify-center text-center"
                                                    icon="i-lucide-plus"
                                                    @click="selectTemplate(template)"
                                                >
                                                    {{ t("ai-agent.backend.template.useTemplate") }}
                                                </UButton>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </template>
        </UDrawer>
    </div>
</template>

<style scoped>
.card-shadow {
    padding: 20px 8px 8px 8px;
    height: 60px;
    border-radius: 0 0 12px 12px;
    background: linear-gradient(
        to bottom,
        transparent 0,
        var(--color-background) 20px,
        var(--color-background) 100%
    );
}
</style>
