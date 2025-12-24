<script lang="ts" setup>
import type { Dataset, QueryDatasetParams } from "@buildingai/service/consoleapi/ai-datasets";
import {
    apiDeleteDataset,
    apiGetDatasetList,
    apiRetryDataset,
} from "@buildingai/service/consoleapi/ai-datasets";

import DatasetCard from "./components/dataset-card.vue";

const router = useRouter();
const toast = useMessage();
const { t } = useI18n();

const searchForm = reactive<QueryDatasetParams>({
    keyword: "",
    showAll: false,
    page: 1,
    pageSize: 15,
});

const loading = shallowRef(false);
const hasMore = shallowRef(true);
const datasets = shallowRef<Dataset[]>([]);

const getLists = async () => {
    if (loading.value) return;

    loading.value = true;
    searchForm.page = 1;

    try {
        const res = await apiGetDatasetList(searchForm);

        datasets.value = res.items || [];
        hasMore.value = res.totalPages > searchForm.page;
    } catch (error) {
        console.error("获取数据失败:", error);
        hasMore.value = false;
    } finally {
        loading.value = false;
    }
};

const loadMore = async () => {
    if (loading.value || !hasMore.value) return;

    loading.value = true;
    if (searchForm.page) {
        searchForm.page++;
    }

    try {
        const res = await apiGetDatasetList(searchForm);

        if (res.items && res.items.length > 0) {
            datasets.value.push(...res.items);
            if (searchForm.page) {
                searchForm.page = searchForm.page + 1;
                hasMore.value = res.totalPages > searchForm.page;
            }
        } else {
            hasMore.value = false;
        }
    } catch (error) {
        if (searchForm.page) {
            searchForm.page--;
        }
        console.error("加载更多数据失败:", error);
    } finally {
        loading.value = false;
    }
};

const handleDelete = async (dataset: Dataset) => {
    try {
        await useModal({
            title: t("ai-datasets.backend.list.delete.title"),
            description: t("ai-datasets.backend.list.delete.desc"),
            color: "error",
        });

        await apiDeleteDataset(dataset.id);

        const originalPage = searchForm.page;
        searchForm.page = 1;
        searchForm.pageSize = datasets.value.length;
        await getLists();

        searchForm.page = originalPage;
        searchForm.pageSize = 15;
        toast.success(t("common.message.deleteSuccess"));
    } catch (error) {
        console.error("删除失败:", error);
    }
};

const handleDatasetSettings = (dataset: Dataset) => {
    router.push(useRoutePath("ai-datasets:update", { id: dataset.id }));
};

const handleCreateDataset = () => {
    router.push(useRoutePath("ai-datasets:create"));
};

const handleRetryDataset = async (dataset: Dataset) => {
    try {
        await useModal({
            title: t("ai-datasets.backend.dataset.retry.title"),
            description: t("ai-datasets.backend.dataset.retry.desc"),
            color: "warning",
        });
        const { success } = await apiRetryDataset(dataset.id);
        if (success) {
            toast.success(t("ai-datasets.backend.dataset.retry.success"));
        } else {
            toast.error(t("ai-datasets.backend.dataset.retry.failed"));
        }
    } catch (_error) {
        toast.error(t("ai-datasets.backend.dataset.retry.failed"));
    }
};

onMounted(() => getLists());
</script>

<template>
    <div class="flex w-full flex-col items-center justify-center">
        <div
            class="bg-background sticky top-0 z-10 flex w-full flex-wrap justify-between gap-4 pb-2"
        >
            <UInput
                v-model="searchForm.keyword"
                :placeholder="$t('ai-datasets.backend.dataset.searchPlaceholder')"
                class="w-80"
                @change="getLists"
            />

            <UCheckbox
                v-model="searchForm.showAll"
                :label="$t('ai-datasets.backend.dataset.allDatasets')"
                @change="getLists"
            />
        </div>

        <BdScrollArea class="h-[calc(100vh-9rem)] min-h-0 w-full">
            <BdInfiniteScroll
                :loading="loading"
                :has-more="hasMore"
                :threshold="200"
                :loading-text="$t('common.loading')"
                :no-more-text="searchForm.page !== 1 ? $t('common.noMoreData') : ' '"
                @load-more="loadMore"
            >
                <div
                    class="grid grid-cols-1 gap-6 pt-2 pb-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
                >
                    <AccessControl :codes="['ai-datasets:create']">
                        <div
                            class="group border-default relative cursor-pointer rounded-lg border border-dashed p-4 transition-all duration-200 hover:shadow-lg"
                            @click="handleCreateDataset"
                        >
                            <div
                                class="group-hover:text-primary text-foreground mb-3 flex items-center gap-3"
                            >
                                <div
                                    class="border-default flex size-10 flex-none items-center justify-center rounded-lg border border-dashed"
                                >
                                    <UIcon name="i-lucide-plus" class="h-6 w-6" />
                                </div>

                                <h3 class="truncate text-sm font-medium">
                                    {{ $t("ai-datasets.backend.dataset.create.title") }}
                                </h3>
                            </div>

                            <div class="text-muted-foreground mb-6 pr-8 text-xs">
                                <p class="line-clamp-2 overflow-hidden">
                                    {{ $t("ai-datasets.backend.dataset.create.desc") }}
                                </p>
                            </div>
                        </div>
                    </AccessControl>

                    <DatasetCard
                        v-for="dataset in datasets"
                        :key="dataset.id"
                        :dataset="dataset"
                        @delete="handleDelete"
                        @settings="handleDatasetSettings"
                        @retry="handleRetryDataset"
                    />
                </div>
            </BdInfiniteScroll>
        </BdScrollArea>
    </div>
</template>
