<script setup lang="ts">
import type { NavigationConfig } from "../../../../../buildingai-ui/app/components/console/page-link-picker/layout";
import { useNavigationMenu } from "../hooks/use-navigation-menu";

const WebSiteLogo = defineAsyncComponent(() => import("./web-site-logo.vue"));
const UserProfile = defineAsyncComponent(() => import("./user-profile.vue"));

const props = withDefaults(
    defineProps<{
        /** 导航配置 */
        navigationConfig: NavigationConfig;
        /** 是否显示移动端菜单 */
        modelValue: boolean;
        /** 是否显示工作台按钮 */
        showWorkspaceButton?: boolean;
        /** 工作台按钮链接 */
        workspaceUrl?: string;
        /** 工作台按钮文本 */
        workspaceText?: string;
    }>(),
    {
        showWorkspaceButton: true,
        workspaceUrl: "/console",
        workspaceText: "我的工作台",
    },
);

const emit = defineEmits<{
    "update:modelValue": [value: boolean];
}>();

const isOpen = useVModel(props, "modelValue", emit);
const userStore = useUserStore();
const { navigationItems, linkItems } = useNavigationMenu(toRef(props, "navigationConfig"));

const handleMenuClick = () => {
    isOpen.value = false;
};
</script>

<template>
    <!-- 移动端侧边滑出菜单 -->
    <USlideover v-model:open="isOpen">
        <template #content>
            <div class="border-border/50 flex items-center justify-between border-b p-4">
                <div class="flex items-center gap-3">
                    <WebSiteLogo layout="mixture" />
                </div>
                <UButton
                    color="neutral"
                    variant="ghost"
                    size="sm"
                    icon="i-heroicons-x-mark"
                    square
                    padded
                    @click="isOpen = false"
                />
            </div>

            <div class="flex flex-1 flex-col overflow-y-auto p-2">
                <UNavigationMenu
                    :collapsed="false"
                    orientation="vertical"
                    :items="navigationItems"
                    :ui="{
                        list: 'navbar-menu',
                        link: 'justify-start hover:bg-secondary dark:hover:bg-surface-800 p-2 px-3 leading-6 rounded-lg',
                        linkLeadingIcon: 'size-4',
                    }"
                    @click="handleMenuClick"
                >
                    <template #item-trailing="{ item }">
                        <UIcon
                            v-if="item.children?.length"
                            name="i-lucide-chevron-right"
                            class="iconify iconify--lucide size-4 shrink-0 transform transition-transform duration-200 group-data-[state=open]:rotate-90"
                        />
                    </template>
                </UNavigationMenu>

                <!-- 底部链接菜单 -->
                <ClientOnly>
                    <UNavigationMenu
                        v-if="userStore.userInfo?.permissions"
                        orientation="vertical"
                        :items="linkItems"
                        class="mt-auto w-full"
                        :ui="{
                            list: 'navbar-other',
                            link: 'justify-start hover:bg-secondary dark:hover:bg-surface-800 p-2 px-3 leading-6 rounded-lg',
                            linkLeadingIcon: 'size-4',
                        }"
                    />
                </ClientOnly>
            </div>

            <div class="p-3">
                <UserProfile size="sm">
                    <div
                        class="flex items-center justify-between gap-1 rounded-lg px-2 py-2"
                        v-ripple
                    >
                        <div class="flex flex-1 items-center gap-2">
                            <UChip color="success" inset>
                                <UAvatar
                                    :src="userStore.userInfo?.avatar"
                                    :alt="userStore.userInfo?.nickname"
                                    :icon="userStore.userInfo?.nickname ? 'tabler:user' : undefined"
                                    size="lg"
                                    :ui="{ root: 'rounded-full' }"
                                />
                            </UChip>

                            <div class="width120 flex flex-col truncate text-sm font-medium">
                                <span class="truncate text-sm font-medium">
                                    {{ userStore.userInfo?.nickname }}
                                </span>
                                <span class="text-secondary-foreground truncate text-xs">
                                    {{ userStore.userInfo?.email || userStore.userInfo?.phone }}
                                </span>
                            </div>
                        </div>

                        <div>
                            <UButton
                                icon="i-lucide-chevrons-up-down"
                                color="neutral"
                                variant="link"
                                :ui="{ leadingIcon: 'size-4' }"
                            />
                        </div>
                    </div>
                </UserProfile>
            </div>
        </template>
    </USlideover>
</template>
