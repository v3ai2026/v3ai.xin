<script setup lang="ts">
import { computed, nextTick, onBeforeUnmount, onMounted, ref } from "vue";
import { useRoute } from "vue-router";

import { buildTopNavItems, type TransformedMenuItem } from "../../menu-helper";

const ButtonFullScreen = defineAsyncComponent(() => import("../components/button-full-screen.vue"));
const ButtonReload = defineAsyncComponent(() => import("../components/button-reload.vue"));
const SiteLogo = defineAsyncComponent(() => import("../components/site-logo.vue"));
const UserMenu = defineAsyncComponent(() => import("../components/user-menu.vue"));
const ButtonSearch = defineAsyncComponent(() => import("../components/button-search-input.vue"));

// const _props = defineProps<{
//     /** 是否折叠侧边栏 */
//     collapsed?: boolean;
// }>();

// const _emit = defineEmits<{
//     /** 折叠状态变化事件 */
//     (e: "toggle"): void;
// }>();

const route = useRoute();
// 菜单滚动相关
const menuContainer = ref<HTMLElement | null>(null);
const scrollPosition = ref(0);
const showLeftArrow = ref(false);
const showRightArrow = ref(false);

// 获取一级菜单项
const menuItems = computed<TransformedMenuItem[]>(() => buildTopNavItems());
const activeMenuIndex = computed(() =>
    menuItems.value.findIndex((item) => route.path.startsWith(item.matchPath)),
);

// 检查是否需要显示箭头
const checkArrows = useDebounceFn(() => {
    if (!menuContainer.value) return;
    const { scrollLeft, scrollWidth, clientWidth } = menuContainer.value;
    showLeftArrow.value = scrollLeft > 0;
    showRightArrow.value = scrollLeft + clientWidth < scrollWidth;
}, 100);

// 滚动菜单
function scrollMenu(direction: "left" | "right") {
    if (!menuContainer.value) return;

    const { clientWidth } = menuContainer.value;
    // 使用可视区域宽度的一半作为滚动距离，提供更好的用户体验
    const scrollAmount = clientWidth / 2;

    const currentScroll = menuContainer.value.scrollLeft;
    const targetPosition =
        direction === "left"
            ? Math.max(0, currentScroll - scrollAmount) // 不允许滚动到负值
            : currentScroll + scrollAmount;

    menuContainer.value.scrollTo({
        left: targetPosition,
        behavior: "smooth",
    });

    // 更新滚动位置（实际滚动是异步的，所以使用当前计算的目标位置）
    scrollPosition.value = targetPosition;
}

// 监听容器滚动
function handleScroll() {
    if (!menuContainer.value) return;
    scrollPosition.value = menuContainer.value.scrollLeft;
    checkArrows();
}

// 确保初始加载和窗口调整时检查箭头状态
onMounted(() => {
    nextTick(() => checkArrows());
    window.addEventListener("resize", checkArrows);
});

onBeforeUnmount(() => {
    window.removeEventListener("resize", checkArrows);
});
</script>

<template>
    <div
        class="bg-background flex h-[55px] w-full items-center justify-between border-b border-solid px-4"
    >
        <div class="flex items-center gap-2">
            <SiteLogo layout="mixture" class="mr-4 shrink-0" />

            <div class="ml-6 flex items-center gap-1">
                <!-- 侧边栏折叠按钮 -->
                <!-- <UTooltip :text="collapsed ? '展开菜单' : '收起菜单'" :delay-duration="0">
                    <UButton
                        data-sidebar="trigger"
                        variant="ghost"
                        size="sm"
                        color="neutral"
                        :ui="{ base: 'py-2' }"
                        @click="emit('toggle')"
                    >
                        <template v-if="!collapsed">
                            <UIcon name="i-lucide-panel-left-close" class="size-4" />
                        </template>
                        <template v-else>
                            <UIcon name="i-lucide-panel-left-open" class="size-4" />
                        </template>
                        <span class="sr-only">侧边栏切换</span>
                    </UButton>
                </UTooltip> -->

                <!-- 页面刷新按钮 -->
                <ButtonReload />
            </div>
        </div>

        <!-- 导航菜单 -->
        <div class="menu-wrapper relative flex h-full flex-1 items-center overflow-hidden">
            <!-- 左箭头 -->
            <UButton
                v-if="showLeftArrow"
                icon="i-heroicons-chevron-left"
                :ui="{ base: 'rounded-full absolute left-0 z-10' }"
                size="xs"
                @click="scrollMenu('left')"
            />

            <!-- 菜单容器 -->
            <div ref="menuContainer" class="menu-container" @scroll="handleScroll">
                <div class="flex h-full gap-1">
                    <div
                        v-for="(item, index) in menuItems"
                        :key="item.label"
                        class="flex shrink-0 cursor-pointer items-center px-2"
                    >
                        <UButton
                            :to="item.to"
                            :icon="item.icon"
                            :variant="activeMenuIndex === index ? 'soft' : 'ghost'"
                            :color="activeMenuIndex === index ? 'primary' : 'neutral'"
                        >
                            {{ item.label }}
                        </UButton>
                    </div>
                </div>
            </div>

            <!-- 右箭头 -->
            <UButton
                v-if="showRightArrow"
                icon="i-heroicons-chevron-right"
                :ui="{ base: 'rounded-full absolute right-0 z-10' }"
                size="xs"
                @click="scrollMenu('right')"
            />
        </div>

        <div class="ml-4 flex items-center gap-3">
            <!-- 搜索 -->
            <ButtonSearch class="w-50" />

            <!-- 全屏按钮 -->
            <ButtonFullScreen />

            <!-- 用户菜单 -->
            <UserMenu mode="mixture" />
        </div>
    </div>
</template>

<style scoped>
.menu-container {
    position: relative;
    height: 100%;
    /* margin: 0 20px; */
    overflow-x: auto;
    scrollbar-width: none;
    -ms-overflow-style: none;
}

.menu-container::-webkit-scrollbar {
    display: none;
}
</style>
