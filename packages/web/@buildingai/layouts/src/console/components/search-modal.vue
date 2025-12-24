<script setup lang="ts">
import { useColorMode } from "@vueuse/core";
import { computed, ref } from "vue";
import { useRouter } from "vue-router";

import { buildSearchItems, type SearchMenuItem } from "../../menu-helper";

// Theme type definition
interface ThemeOption {
    id: "light" | "dark" | "auto";
    label: string;
    icon: string;
}

const { t } = useI18n();
const router = useRouter();
const { store } = useColorMode();
const controlsStore = useControlsStore();

// Global search modal visibility - using global state
defineShortcuts({
    o: () => controlsStore.toggleGlobalSearch(),
});

// Search query
const searchQuery = ref("");

// Theme options
const themeOptions = computed<ThemeOption[]>(() => [
    {
        id: "auto",
        label: t("common.theme.system"),
        icon: "i-heroicons-computer-desktop-20-solid",
    },
    {
        id: "light",
        label: t("common.theme.light"),
        icon: "i-heroicons-sun-20-solid",
    },
    {
        id: "dark",
        label: t("common.theme.dark"),
        icon: "i-heroicons-moon-20-solid",
    },
]);

/**
 * Convert menu data to searchable tool list
 * @description Transforms menu data into a searchable list of tools
 */
const menuTools = computed<SearchMenuItem[]>(() => {
    return buildSearchItems();
});

/**
 * All searchable tools list
 * @description Complete list of all available searchable tools
 */
const allTools = computed(() => {
    return menuTools.value;
});

/**
 * Filtered tools list based on search query
 * @description Filters tools by matching name or path with search query
 */
const filteredTools = computed(() => {
    if (!searchQuery.value) return allTools.value;

    const query = searchQuery.value.toLowerCase().trim();

    return allTools.value.filter(
        (tool) =>
            t(tool.name).toLowerCase().includes(query) ||
            (tool.parentName && tool.parentName.toLowerCase().includes(query)) ||
            (tool.path && tool.path.toLowerCase().includes(query)),
    );
});

/**
 * Grouped search results
 * @description Organizes filtered results into groups by type
 */
const groupedResults = computed(() => {
    const menus = filteredTools.value.filter((tool) => tool.type === "menu");

    return {
        menus,
    };
});

/**
 * Check if there are search results
 * @description Determines whether search results are available
 */
const hasSearchResults = computed(() => {
    return searchQuery.value.trim() === "" || filteredTools.value.length > 0;
});

/**
 * Handle search operation
 * @description Processes search action and navigates if single result
 */
const handleSearch = () => {
    // If only one result, navigate directly to that tool
    if (filteredTools.value.length === 1 && filteredTools.value[0]?.path) {
        // Use optional chaining to ensure type safety
        const firstTool = filteredTools.value[0];
        if (firstTool) {
            handleItemClick(firstTool);
        }
    }
};

/**
 * Handle tool item click
 * @description Processes click on a tool item and navigates to its path
 * @param tool The clicked tool item
 */
const handleItemClick = (tool: SearchMenuItem) => {
    if (tool.path) {
        router.push(tool.path);
    }
    searchQuery.value = "";
    controlsStore.toggleGlobalSearch();
};

/**
 * Handle theme change
 * @description Processes theme mode change and saves to localStorage
 * @param mode Theme mode
 */
const handleThemeChange = (mode: "light" | "dark" | "auto") => {
    store.value = mode;
    // Save to localStorage
    localStorage.setItem("nuxt-ui-color-mode", mode);
    controlsStore.toggleGlobalSearch();
};

// Remove window event listener logic
</script>

<template>
    <UModal
        v-model:open="controlsStore.globalSearchVisible"
        :title="t('common.search')"
        :description="t('console-common.searchPlaceholder')"
        :ui="{ content: 'z-999' }"
    >
        <template #header>
            <span class="sr-only">{{ t("common.search") }}</span>
        </template>
        <template #content>
            <div class="py-2">
                <!-- Search input box -->
                <div
                    class="border-default relative flex items-center gap-2 border-b border-solid px-2 pb-2"
                >
                    <UInput
                        v-model="searchQuery"
                        :placeholder="t('console-common.searchPlaceholder')"
                        icon="i-heroicons-magnifying-glass-20-solid"
                        class="w-full"
                        variant="none"
                        autofocus
                        @keydown.esc="controlsStore.toggleGlobalSearch()"
                        @keydown.enter="handleSearch"
                    >
                    </UInput>
                    <UButton
                        color="neutral"
                        variant="ghost"
                        size="sm"
                        icon="i-lucide-x"
                        aria-label="Close search"
                        @click="controlsStore.toggleGlobalSearch()"
                    />
                </div>

                <BdScrollArea class="h-90" type="auto">
                    <!-- Tools list -->
                    <div
                        class="px-2 pt-4"
                        v-if="hasSearchResults && groupedResults.menus.length > 0"
                    >
                        <div class="text-foreground mb-2 pl-2 text-xs font-medium">
                            {{
                                searchQuery
                                    ? t("console-common.searchResult")
                                    : t("console-common.menu")
                            }}
                        </div>

                        <div
                            v-for="tool in groupedResults.menus"
                            :key="tool.id"
                            class="hover:bg-muted flex cursor-pointer items-center justify-between rounded-md p-3 transition-colors"
                            @click="handleItemClick(tool)"
                        >
                            <div class="flex items-center">
                                <div
                                    class="bg-primary text-background flex h-8 w-8 items-center justify-center rounded-md"
                                    :class="tool.iconClass"
                                >
                                    <UIcon :name="tool.icon" class="text-lg" />
                                </div>
                                <div class="ml-3 text-xs">
                                    <div>{{ t(tool.name) }}</div>
                                    <div
                                        v-if="tool.parentName"
                                        class="text-muted-foreground mt-0.5 text-xs"
                                    >
                                        {{ tool.parentName }}
                                    </div>
                                </div>
                            </div>
                            <div class="bg-secondary rounded-md px-2 py-1 text-xs">
                                {{ t("console-common.menu") }}
                            </div>
                        </div>
                    </div>

                    <!-- No search results -->
                    <div
                        class="flex h-46 items-center justify-center px-4"
                        v-if="searchQuery && !hasSearchResults"
                    >
                        <div class="text-muted-foreground text-center text-sm">
                            {{ t("console-common.searchNoResult", { query: searchQuery }) }}
                        </div>
                    </div>

                    <div class="border-default mt-4 border-t border-solid px-2 pt-4">
                        <div class="text-foreground mb-2 pl-2 text-xs font-medium">
                            {{ t("common.theme.theme") }}
                        </div>
                        <div class="flex flex-col gap-2 text-xs">
                            <div
                                v-for="option in themeOptions"
                                :key="option.id"
                                class="hover:bg-muted flex cursor-pointer items-center gap-2 rounded-md px-3 py-1.5 transition-all duration-150"
                                :class="[
                                    store === option.id
                                        ? 'bg-secondary text-primary'
                                        : 'text-foreground-lighter',
                                ]"
                                @click="handleThemeChange(option.id)"
                            >
                                <UIcon :name="option.icon" class="text-lg" />
                                <div>{{ option.label }}</div>
                            </div>
                        </div>
                    </div>
                </BdScrollArea>
            </div>
        </template>
    </UModal>
</template>
