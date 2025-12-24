<script setup lang="ts">
import { ROUTES } from "@buildingai/constants/web";

import type { NavigationConfig } from "../../../../../buildingai-ui/app/components/console/page-link-picker/layout";

const MobileMenuButton = defineAsyncComponent(() => import("../components/mobile-menu-button.vue"));
const MobileNavigation = defineAsyncComponent(() => import("../components/mobile-navigation.vue"));
const UserProfile = defineAsyncComponent(() => import("../components/user-profile.vue"));
const SiteLogo = defineAsyncComponent(() => import("../components/web-site-logo.vue"));

const props = defineProps<{
    navigationConfig: NavigationConfig;
}>();

const userStore = useUserStore();
const locationPathname = window.location.pathname;
const mobileMenuOpen = shallowRef(false);
</script>

<template>
    <div class="bg-muted/50 flex h-full w-full flex-col">
        <!-- 顶部导航栏 -->
        <header class="sticky top-0 z-50 hidden p-4 sm:block">
            <div
                class="border-box relative h-[var(--navbar-height)] w-full items-center justify-between rounded-lg border border-transparent px-2 py-1.5 shadow-[0px_5px_18px_rgba(204,_204,_204,_0.2)] backdrop-blur-sm transition-[box-shadow_background-color_border-color] duration-300 motion-reduce:transition-none sm:grid lg:grid-cols-[1fr_auto_1fr] lg:rounded-2xl lg:py-[0.4375rem] lg:pr-[0.4375rem] dark:shadow-[0px_5px_18px_rgba(204,_204,_204,_0.1)]"
            >
                <!-- Logo 和品牌名称 -->
                <SiteLogo layout="mixture" />

                <!-- 桌面端导航菜单 -->
                <ul
                    class="text-brand-neutrals-700 dark:text-brand-neutrals-200 col-start-2 hidden gap-2 px-2 font-medium sm:flex xl:gap-4"
                >
                    <li v-for="item in props.navigationConfig.items" :key="item.id">
                        <!-- 普通菜单项 -->
                        <NuxtLink
                            :to="item.link?.path || '/'"
                            :target="item.link?.path?.startsWith('http') ? '_blank' : '_self'"
                            class="flex items-center gap-1 rounded-md px-2 py-1 transition-colors duration-300 motion-reduce:transition-none"
                            :class="{
                                'bg-primary text-white':
                                    locationPathname === item.link?.path ||
                                    item.link?.path === useRoute().path ||
                                    item.link?.path === useRoute().meta.activePath,
                            }"
                        >
                            <Icon v-if="item.icon" :name="item.icon" class="mr-1 inline-block" />
                            <span class="text-sm font-medium">{{ item.title }}</span>
                        </NuxtLink>
                    </li>
                </ul>

                <!-- 右侧操作区域 -->
                <div class="col-start-3 hidden w-full items-center justify-end gap-3 sm:flex">
                    <!-- 主题切换 -->
                    <BdThemeToggle />

                    <!-- 用户头像菜单 -->
                    <UserProfile
                        size="md"
                        :collapsed="false"
                        :content="{
                            side: 'bottom',
                            align: 'center',
                            sideOffset: 20,
                        }"
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
        <MobileNavigation
            v-model="mobileMenuOpen"
            :navigation-config="navigationConfig"
            :show-workspace-button="false"
        />
    </div>
</template>
