<script setup lang="ts">
import type { AiProviderInfo } from "@buildingai/service/consoleapi/ai-provider";
import { apiGetAiProviderList } from "@buildingai/service/consoleapi/ai-provider";

const ModelList = defineAsyncComponent(() => import("./components/model-list.vue"));

const props = defineProps<{
    providerId: string;
}>();

const emits = defineEmits<{
    (e: "close", refresh?: boolean): void;
}>();

const { t } = useI18n();
const isOpen = shallowRef<boolean>(true);
const providers = shallowRef<AiProviderInfo[]>([]);
const activeProvider = shallowRef<AiProviderInfo | null>(null);

const { lockFn: getLists, isLock: loading } = useLockFn(async () => {
    try {
        const data = await apiGetAiProviderList();
        providers.value = data;
        if (props.providerId) {
            activeProvider.value =
                providers.value.find((provider) => provider.id === props.providerId) || null;
        }
        if (providers.value.length > 0 && !activeProvider.value) {
            activeProvider.value = providers.value[0] || null;
        }
    } catch (error) {
        console.error("获取供应商列表失败:", error);
    }
});

const selectProvider = (provider: AiProviderInfo) => {
    activeProvider.value = provider;
};

const handleClose = () => {
    isOpen.value = false;
    emits("close", true);
};

onMounted(() => getLists());

defineShortcuts({
    escape: () => handleClose(),
});
</script>

<template>
    <USlideover
        v-model:open="isOpen"
        class="h-screen w-full"
        side="bottom"
        :transition="true"
        :overlay="false"
        :close="false"
        :ui="{
            content: ' backdrop-blur-md !bottom-0 !shadow-[none] border-none bg-background/60',
            body: '!p-0',
        }"
    >
        <template #body>
            <div class="bg-background absolute top-0 right-0 h-full w-1/2"></div>
            <div class="mx-auto flex h-full max-w-5xl flex-1">
                <div class="w-60 border-r border-gray-100 pr-6 dark:border-gray-800">
                    <h1 class="mx-2.5 my-8 text-lg font-bold">
                        {{ t("ai-provider.backend.providerSettings") }}
                    </h1>

                    <div v-if="loading" class="space-y-2">
                        <USkeleton class="h-13 w-[215px]" />
                        <USkeleton class="h-13 w-[215px]" />
                        <USkeleton class="h-13 w-[215px]" />
                        <USkeleton class="h-13 w-[215px]" />
                        <USkeleton class="h-13 w-[215px]" />
                        <USkeleton class="h-13 w-[215px]" />
                        <USkeleton class="h-13 w-[215px]" />
                        <USkeleton class="h-13 w-[215px]" />
                        <USkeleton class="h-13 w-[215px]" />
                        <USkeleton class="h-13 w-[215px]" />
                        <USkeleton class="h-13 w-[215px]" />
                        <USkeleton class="h-13 w-[215px]" />
                        <USkeleton class="h-13 w-[215px]" />
                    </div>

                    <ul v-else-if="providers.length > 0" class="space-y-2">
                        <li
                            v-for="provider in providers"
                            :key="provider.id"
                            class="cursor-pointer"
                            @click="selectProvider(provider)"
                        >
                            <div
                                class="flex items-center gap-3 rounded-md px-3 py-2 transition-colors"
                                :class="{
                                    'bg-muted-foreground/20': activeProvider?.id === provider.id,
                                    'hover:bg-muted-foreground/20':
                                        activeProvider?.id !== provider.id,
                                }"
                            >
                                <div class="flex-none">
                                    <UAvatar
                                        :src="provider.iconUrl"
                                        :alt="provider.name"
                                        :ui="{
                                            root: 'rounded bg-transparent size-8',
                                            fallback: 'text-inverted',
                                        }"
                                        :class="[provider.iconUrl ? '' : 'bg-primary']"
                                    />
                                </div>

                                <div class="flex min-w-0 flex-1 flex-col">
                                    <span class="text-foreground truncate text-sm font-medium">
                                        {{ provider.name }}
                                    </span>
                                    <span class="text-accent-foreground truncate text-xs">
                                        {{ provider.provider }}
                                    </span>
                                </div>

                                <div class="flex-none">
                                    <div
                                        class="h-2 w-2 rounded-full"
                                        :class="{
                                            'bg-green-500': provider.isActive,
                                            'bg-gray-400': !provider.isActive,
                                        }"
                                    />
                                </div>
                            </div>
                        </li>
                    </ul>
                </div>

                <!-- 内容区域 -->
                <div class="bg-background relative flex flex-1 flex-col">
                    <div class="absolute top-6 right-[-60px] flex flex-col items-center gap-1">
                        <UButton
                            icon="i-lucide-x"
                            variant="soft"
                            color="neutral"
                            size="sm"
                            @click="handleClose"
                        />
                        <div class="text-accent-foreground text-xs">ESC</div>
                    </div>
                    <BdScrollArea class="flex-1">
                        <ModelList :provider="activeProvider as AiProviderInfo" class="pt-6" />
                    </BdScrollArea>
                </div>
            </div>
        </template>
    </USlideover>
</template>
