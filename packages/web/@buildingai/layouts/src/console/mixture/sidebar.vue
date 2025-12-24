<script setup lang="ts">
import { computed } from "vue";
import { useRoute } from "vue-router";

import { buildSidebarItems, type TransformedMenuItem } from "../../menu-helper";

const props = defineProps<{
    /** 是否折叠侧边栏 */
    collapsed?: boolean;
}>();
const route = useRoute();

// 使用计算属性
const currentTopLevelMenu = computed<TransformedMenuItem[]>(() => {
    const topLevelMenus = buildSidebarItems(route.path);

    return (
        topLevelMenus.find((item) => {
            return route.path.startsWith(item.matchPath);
        })?.children ?? []
    );
});
</script>

<template>
    <aside
        v-if="currentTopLevelMenu.length"
        class="h-screen flex-col border-r border-solid p-2 transition-all duration-300"
        :class="{ 'w-16': collapsed, 'w-46': !collapsed }"
    >
        <div class="flex flex-grow flex-col overflow-y-auto py-4">
            <div
                :style="{
                    '--ui-text-muted': 'var(--color-accent-foreground)',
                    '--ui-text-dimmed': 'var(--color-accent-foreground)',
                }"
            >
                <UNavigationMenu
                    :collapsed="props.collapsed"
                    orientation="vertical"
                    :items="currentTopLevelMenu"
                    :ui="{
                        list: 'navbar-menu',
                        link: collapsed ? 'justify-center py-3' : 'justify-start',
                    }"
                />
            </div>
        </div>
    </aside>
</template>
