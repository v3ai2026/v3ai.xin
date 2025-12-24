<script setup lang="ts">
import { ROUTES } from "@buildingai/constants/web";

import type { NavigationMenuItem } from "#ui/types";

import type { NavigationConfig } from "../../../../../buildingai-ui/app/components/console/page-link-picker/layout";

const MobileMenuButton = defineAsyncComponent(() => import("../components/mobile-menu-button.vue"));
const MobileNavigation = defineAsyncComponent(() => import("../components/mobile-navigation.vue"));
const UserProfile = defineAsyncComponent(() => import("../components/user-profile.vue"));
const SiteLogo = defineAsyncComponent(() => import("../components/web-site-logo.vue"));

const props = defineProps<{
    navigationConfig: NavigationConfig;
}>();

const userStore = useUserStore();

// 移动端菜单状态
const mobileMenuOpen = shallowRef(false);

/**
 * 将 NavigationConfig 转换为 NavigationMenuItem 格式
 */
const navigationItems = computed((): NavigationMenuItem[] => {
    return props.navigationConfig.items.map((item: NavigationMenuItem) => ({
        label: item.title,
        icon: item.icon,
        badge: item.badge,
        // to: toAbsolutePath(item.link?.path || "/"),
        to: item.link?.path || "/",
        active:
            useRoute().path === item.link?.path ||
            useRoute().path.startsWith(item.link?.path + "/") ||
            useRoute().meta.activePath === item.link?.path,
        // target: item.link?.path?.startsWith("http") ? "_blank" : undefined,
        children: item.children?.map((child: NavigationMenuItem) => ({
            label: child.title,
            description: `前往 ${child.title}`,
            icon: child.icon,
            to: child?.link?.path || "/",
            // to: toAbsolutePath(child?.link?.path || "/"),
            // target: child?.link?.path?.startsWith("http") ? "_blank" : undefined,
        })),
    }));
});
</script>

<template>
    <div class="bg-muted/50 flex h-full w-full flex-col">
        <!-- 使用 Nuxt UI NavigationMenu 的现代导航 -->
        <header class="hidden px-4 py-2 sm:block">
            <div class="flex items-center justify-between">
                <!-- 左侧 Logo -->
                <SiteLogo layout="mixture" />

                <!-- 桌面端导航菜单 -->
                <div class="hidden md:flex md:flex-1 md:justify-center">
                    <UNavigationMenu
                        :items="navigationItems"
                        orientation="horizontal"
                        variant="pill"
                        color="primary"
                    />
                </div>

                <!-- 右侧操作区 -->
                <div class="hidden items-center gap-3 md:flex">
                    <!-- 主题切换 -->
                    <BdThemeToggle />

                    <!-- 用户头像 -->
                    <UserProfile
                        :collapsed="false"
                        :content="{
                            side: 'bottom',
                            align: 'center',
                        }"
                        size="md"
                    >
                        <template #default>
                            <UAvatar :src="userStore.userInfo?.avatar" size="md" />
                        </template>
                    </UserProfile>

                    <!-- 工作台按钮 -->
                    <NuxtLink v-if="userStore.userInfo?.permissions" :to="ROUTES.CONSOLE">
                        <UButton :ui="{ base: 'rounded-full' }" color="primary">
                            {{ $t("layouts.menu.workspace") }}
                        </UButton>
                    </NuxtLink>
                </div>
            </div>
        </header>

        <!-- 主要内容区域 -->
        <main class="bg-background shadow-default h-full flex-1 overflow-hidden rounded-t-xl">
            <slot />
        </main>

        <!-- 移动端菜单按钮 -->
        <MobileMenuButton v-model="mobileMenuOpen" :show-user-profile="false" />
        <!-- 移动端导航菜单 -->
        <MobileNavigation v-model="mobileMenuOpen" :navigation-config="navigationConfig" />
    </div>
</template>
