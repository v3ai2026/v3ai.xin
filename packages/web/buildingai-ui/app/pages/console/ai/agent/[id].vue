<script setup lang="ts">
import { apiGetAgentDetail } from "@buildingai/service/consoleapi/ai-agent";
import type { NavigationMenuItem } from "@nuxt/ui";

const AgentModal = defineAsyncComponent(() => import("./components/agent-modal.vue"));

const route = useRoute();
const router = useRouter();
const { t } = useI18n();
const overlay = useOverlay();
const { hasAccessByCodes } = useAccessControl();
const isMobile = useMediaQuery("(max-width: 1380px)");
const collapsed = shallowRef<boolean>(false);
const agentId = computed(() => (route.params as Record<string, string>).id);

const { data: agent, refresh: refreshAgent } = await useAsyncData(
    `agent-detail-${agentId.value}`,
    () => apiGetAgentDetail(agentId.value as string),
);

provide("agents", agent);

const mountAgentModal = async (id: string) => {
    const modal = overlay.create(AgentModal);

    const instance = modal.open({ id: id });
    const shouldRefresh = await instance.result;
    if (shouldRefresh) refreshAgent();
};

const handleEdit = () => {
    mountAgentModal(agentId.value as string);
};

const navigationItems = computed(() => {
    return [
        hasAccessByCodes(["ai-agent:detail"])
            ? {
                  label: t("ai-agent.backend.menu.arrange"),
                  icon: "i-lucide-radar",
                  to: useRoutePath("ai-agent:detail", {
                      id: agentId.value as string,
                  }),
              }
            : null,
        hasAccessByCodes(["ai-agent:publish"])
            ? {
                  label: t("ai-agent.backend.menu.publish"),
                  icon: "i-lucide-radio-tower",
                  to: useRoutePath("ai-agent:publish", {
                      id: agentId.value as string,
                  }),
              }
            : null,
        hasAccessByCodes(["ai-agent-chat-record:list"])
            ? {
                  label: t("ai-agent.backend.menu.chatRecord"),
                  icon: "i-lucide-file-text",
                  to: useRoutePath("ai-agent-chat-record:list", {
                      id: agentId.value as string,
                  }),
              }
            : null,
        hasAccessByCodes(["ai-agent:statistics"])
            ? {
                  label: t("ai-agent.backend.menu.statistics"),
                  icon: "i-lucide-pie-chart",
                  to: useRoutePath("ai-agent:statistics", {
                      id: agentId.value as string,
                  }),
              }
            : null,
    ].filter(Boolean) as NavigationMenuItem[];
});

watch(isMobile, (newVal) => {
    if (newVal) {
        collapsed.value = true;
    } else {
        collapsed.value = false;
    }
});
</script>

<template>
    <div class="flex h-full min-h-0 w-full">
        <div
            class="bg-muted flex h-full w-50 flex-none flex-col rounded-tr-xl rounded-br-xl p-2"
            :class="{ 'w-18!': collapsed }"
        >
            <div
                class="hover:bg-accent flex cursor-pointer flex-col space-y-3 rounded-lg p-2"
                @click="handleEdit"
            >
                <div
                    class="flex items-center justify-between gap-2"
                    :class="{ 'flex-col!': collapsed }"
                >
                    <UButton
                        variant="soft"
                        color="neutral"
                        size="lg"
                        leading-icon="i-lucide-arrow-left"
                        @click.stop="router.replace(useRoutePath('ai-agent:list'))"
                    />

                    <!-- 配置按钮 -->
                    <UButton
                        variant="link"
                        color="primary"
                        size="lg"
                        leading-icon="i-lucide-settings-2"
                    />
                </div>

                <UTooltip :text="agent?.name" :delay-duration="0" v-if="!collapsed">
                    <div class="text-foreground line-clamp-2 text-sm font-medium">
                        {{ agent?.name }}
                    </div>
                </UTooltip>

                <div class="text-muted-foreground text-xs" v-if="!collapsed">
                    {{ agent?.description }}
                </div>
            </div>
            <div class="px-2">
                <USeparator class="my-3 flex" />
            </div>
            <div class="flex h-full w-full flex-col justify-between p-2">
                <UNavigationMenu
                    orientation="vertical"
                    :collapsed="collapsed"
                    :items="navigationItems"
                    class="data-[orientation=vertical]:w-full"
                    :ui="{
                        list: 'space-y-1',
                        link: collapsed ? 'p-2.5' : 'p-2 pl-3',
                        linkLeadingIcon: collapsed ? 'size-5' : 'size-4',
                    }"
                />

                <div
                    class="mt-auto flex items-center justify-center"
                    :class="{ 'justify-between!': !collapsed }"
                >
                    <UButton
                        data-sidebar="trigger"
                        variant="ghost"
                        color="neutral"
                        size="xs"
                        :ui="{ base: 'py-2' }"
                        @click="collapsed = !collapsed"
                    >
                        <template v-if="!collapsed">
                            <UIcon name="i-lucide-panel-right" class="size-5" />
                        </template>
                        <template v-else>
                            <UIcon name="i-lucide-panel-left" class="size-5" />
                        </template>
                        <span class="sr-only">侧边栏切换</span>
                    </UButton>
                </div>
            </div>
        </div>
        <!-- 内容区域 -->
        <NuxtPage />
    </div>
</template>
