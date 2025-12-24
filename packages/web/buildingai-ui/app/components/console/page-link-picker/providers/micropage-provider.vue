<script lang="ts" setup>
import type { MicropageFormData } from "@buildingai/service/consoleapi/decorate";
import { apiGetMicropageList } from "@buildingai/service/consoleapi/decorate";
import { computed, onMounted, ref } from "vue";
import { useI18n } from "vue-i18n";

import { type LinkItem, LinkType } from "../layout.d";

const { t } = useI18n();

const props = withDefaults(
    defineProps<{
        /** 搜索查询 */
        searchQuery?: string;
        /** 当前选中的链接 */
        selected?: LinkItem | null;
    }>(),
    {
        searchQuery: "",
        selected: null,
    },
);

// 组件事件
const emit = defineEmits<{
    (e: "select", link: LinkItem): void;
}>();

// 响应式状态
const micropages = ref<LinkItem[]>([]);

// 计算属性
const filteredPages = computed(() => {
    if (!props.searchQuery) return micropages.value;

    const query = props.searchQuery.toLowerCase();
    return micropages.value.filter(
        (page) =>
            page.name?.toLowerCase().includes(query) || page.path?.toLowerCase().includes(query),
    );
});

/**
 * 加载微页面列表
 */
const { lockFn: getMicropages, isLock: isLoading } = useLockFn(async () => {
    try {
        const data = await apiGetMicropageList();

        const pages: LinkItem[] = data.map((micropage: MicropageFormData) => ({
            type: LinkType.MICROPAGE,
            name: micropage.name,
            path: `/micropage/${micropage.id}`,
            query: {},
        }));

        // 按名称排序
        pages.sort((a: LinkItem, b: LinkItem) => {
            const nameA = a.name || "";
            const nameB = b.name || "";
            return nameA.localeCompare(nameB);
        });

        micropages.value = pages;
    } catch (error) {
        console.error(t("console-common.loadingFailed"), error);
        micropages.value = [];
    }
});

/**
 * 选择页面
 */
const selectPage = (page: LinkItem) => {
    emit("select", page);
};

/**
 * 检查是否为选中状态
 */
const isSelected = (page: LinkItem) => {
    return props.selected?.path === page.path && props.selected?.type === LinkType.MICROPAGE;
};

// 组件挂载时加载数据
onMounted(() => getMicropages());
</script>

<template>
    <div class="micropage-provider flex h-full flex-col">
        <!-- 加载状态 -->
        <div v-if="isLoading" class="flex flex-none flex-wrap gap-3 p-6">
            <USkeleton class="h-18 w-44 rounded-xl" v-for="i in 6" :key="i" />
        </div>

        <!-- 空状态 -->
        <div v-else-if="filteredPages.length === 0" class="flex flex-1 items-center justify-center">
            <div class="mx-auto max-w-sm text-center">
                <UIcon
                    name="i-heroicons-document-text"
                    class="text-muted-foreground/50 mx-auto mb-4 h-16 w-16"
                />
                <h3 class="text-foreground mb-2 text-lg font-semibold">
                    {{
                        searchQuery
                            ? t("console-common.linkPicker.emptyState.noMatchingPages")
                            : t("console-common.linkPicker.emptyState.noMicropages")
                    }}
                </h3>
                <p class="text-muted-foreground text-sm">
                    {{
                        searchQuery
                            ? t("console-common.linkPicker.emptyState.tryOtherKeywords")
                            : t("console-common.linkPicker.emptyState.contactAdmin")
                    }}
                </p>
            </div>
        </div>

        <!-- 微页面列表 -->
        <div v-else class="flex-1 overflow-y-auto p-6">
            <div class="flex flex-wrap gap-3">
                <div
                    v-for="page in filteredPages"
                    :key="page.path"
                    :class="[
                        'group relative flex cursor-pointer items-center gap-4 rounded-xl px-4 py-3 transition-all duration-200',
                        isSelected(page)
                            ? 'bg-primary/5 shadow-sm'
                            : 'bg-accent hover:bg-primary/5',
                    ]"
                    @click="selectPage(page)"
                >
                    <!-- 页面图标 -->
                    <!-- <div class="flex-none">
                        <div
                            :class="[
                                'flex h-12 w-12 items-center justify-center rounded-lg transition-colors',
                                isSelected(page)
                                    ? 'bg-primary/10 text-primary'
                                    : 'bg-accent text-muted-foreground group-hover:bg-primary/10 group-hover:text-primary',
                            ]"
                        >
                            <UIcon name="i-heroicons-document-text" class="h-6 w-6" />
                        </div>
                    </div> -->

                    <!-- 页面信息 -->
                    <div class="min-w-0 flex-1">
                        <div
                            class="text-foreground mb-1 flex items-center truncate text-base font-semibold"
                        >
                            {{ page.name }}
                        </div>
                        <!-- <p class="text-muted-foreground w-40 truncate text-sm">
                            {{ page.path }}
                        </p> -->
                    </div>

                    <!-- 选中标识 -->
                    <div v-if="isSelected(page)" class="absolute top-0 right-0 flex-none">
                        <div
                            class="bg-primary flex size-3 items-center justify-center rounded-full"
                        ></div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
