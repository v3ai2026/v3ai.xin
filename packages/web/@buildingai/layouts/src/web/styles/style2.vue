<script setup lang="ts">
import { ROUTES } from "@buildingai/constants/web";

import type { NavigationConfig } from "../../../../../buildingai-ui/app/components/console/page-link-picker/layout";

const MobileMenuButton = defineAsyncComponent(() => import("../components/mobile-menu-button.vue"));
const MobileNavigation = defineAsyncComponent(() => import("../components/mobile-navigation.vue"));
const UserProfile = defineAsyncComponent(() => import("../components/user-profile.vue"));
const SiteLogo = defineAsyncComponent(() => import("../components/web-site-logo.vue"));

defineProps<{
    navigationConfig: NavigationConfig;
    hasPreview?: boolean;
}>();

const userStore = useUserStore();
const locationPathname = window.location.pathname;
const mobileMenuOpen = shallowRef(false);
</script>

<template>
    <div class="bg-muted/50 flex h-full w-full flex-col">
        <!-- 顶部导航栏 -->
        <header class="relative hidden w-full sm:block">
            <div class="flex w-full items-center justify-between p-4">
                <SiteLogo layout="mixture" />

                <!-- 中间浮动导航菜单（桌面端） -->
                <ul
                    class="border-border/50 bg-background/60 fixed top-4 left-1/2 z-50 hidden -translate-x-1/2 items-center gap-6 rounded-full border px-8 py-2 backdrop-blur-sm sm:flex"
                    :class="{ '!left-inherit !static !translate-x-0': hasPreview }"
                >
                    <li
                        v-for="item in navigationConfig.items"
                        :key="item.id"
                        class="hover:text-primary transition-colors duration-200"
                    >
                        <NuxtLink
                            :to="item.link?.path || '/'"
                            :target="item.link?.path?.startsWith('http') ? '_blank' : '_self'"
                            class="flex items-center justify-center gap-1 text-sm font-medium"
                            :class="{
                                'text-primary':
                                    locationPathname === item.link?.path ||
                                    item.link?.path === useRoute().path ||
                                    item.link?.path === useRoute().meta.activePath,
                            }"
                        >
                            <Icon v-if="item.icon" :name="item.icon" size="16" />
                            <span>{{ item.title }}</span>
                        </NuxtLink>
                    </li>
                </ul>

                <!-- 右侧操作区域（桌面端） -->
                <div class="hidden items-center gap-3 sm:flex">
                    <!-- 主题切换 -->
                    <BdThemeToggle />

                    <!-- 用户头像 -->
                    <UserProfile
                        :collapsed="false"
                        :content="{
                            side: 'bottom',
                            align: 'center',
                            sideOffset: 20,
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
        <MobileMenuButton v-model="mobileMenuOpen" />
        <!-- 移动端导航菜单 -->
        <MobileNavigation v-model="mobileMenuOpen" :navigation-config="navigationConfig" />
    </div>
</template>
