<script setup lang="ts">
import type { Agent } from "@buildingai/service/consoleapi/ai-agent";

const props = defineProps<{
    agent?: Agent;
}>();
const emit = defineEmits<{
    (e: "update", config: Record<string, unknown>): void;
}>();

const config = reactive({
    allowOrigins: props.agent?.publishConfig?.allowOrigins || [],
    rateLimitPerMinute: props.agent?.publishConfig?.rateLimitPerMinute || 60,
    showBranding: props.agent?.publishConfig?.showBranding ?? true,
    allowDownloadHistory: props.agent?.publishConfig?.allowDownloadHistory ?? false,
});

const newOrigin = shallowRef("");

watch(
    () => config,
    (newConfig) => {
        emit("update", { ...newConfig });
    },
    { deep: true },
);

const addOrigin = () => {
    if (newOrigin.value.trim() && !config.allowOrigins.includes(newOrigin.value.trim())) {
        config.allowOrigins.push(newOrigin.value.trim());
        newOrigin.value = "";
    }
};

const removeOrigin = (index: number) => {
    config.allowOrigins.splice(index, 1);
};

const handleOriginKeydown = (event: KeyboardEvent) => {
    if (event.key === "Enter") {
        event.preventDefault();
        addOrigin();
    }
};
</script>

<template>
    <div class="cursor-no-drop space-y-6">
        <div>
            <h3 class="mb-2 text-lg font-medium">
                {{ $t("ai-agent.backend.publish.publishConfig") }}
            </h3>
            <p class="text-muted-foreground text-sm">
                {{ $t("ai-agent.backend.publish.publishConfigDesc") }}
            </p>
        </div>

        <div v-if="!agent?.isPublished" class="border-border rounded-lg border p-6 text-center">
            <UIcon name="i-lucide-lock" class="text-muted-foreground mx-auto mb-3 size-12" />
            <h4 class="mb-2 font-medium">{{ $t("ai-agent.backend.publish.unpublished") }}</h4>
            <p class="text-muted-foreground text-sm">
                {{ $t("ai-agent.backend.publish.unpublishedDesc4") }}
            </p>
        </div>

        <template v-else>
            <div class="space-y-4">
                <div class="space-y-2">
                    <label class="text-sm font-medium">
                        {{ $t("ai-agent.backend.publish.allowedDomains") }}
                    </label>
                    <p class="text-muted-foreground text-xs">
                        {{ $t("ai-agent.backend.publish.allowedDomainsDesc") }}
                    </p>

                    <div v-if="config.allowOrigins.length > 0" class="space-y-2">
                        <div
                            v-for="(origin, index) in config.allowOrigins"
                            :key="index"
                            class="flex items-center gap-2"
                        >
                            <UInput :value="origin" readonly class="flex-1" />
                            <UButton
                                icon="i-lucide-x"
                                variant="ghost"
                                size="sm"
                                @click="removeOrigin(index)"
                            />
                        </div>
                    </div>

                    <div class="flex gap-2">
                        <UInput
                            v-model="newOrigin"
                            placeholder="例如：https://example.com"
                            class="flex-1"
                            disabled
                            @keydown="handleOriginKeydown"
                        />
                        <UButton disabled @click="addOrigin">
                            {{ $t("console-common.add") }}
                        </UButton>
                    </div>
                </div>

                <div class="space-y-2">
                    <label class="text-sm font-medium">
                        {{ $t("ai-agent.backend.publish.rateLimit") }}
                    </label>
                    <p class="text-muted-foreground text-xs">
                        {{ $t("ai-agent.backend.publish.rateLimitDesc") }}
                    </p>
                    <UInput
                        v-model="config.rateLimitPerMinute"
                        type="number"
                        min="0"
                        max="1000"
                        placeholder="60"
                        class="w-32"
                        disabled
                    />
                </div>
            </div>

            <div class="space-y-4">
                <h4 class="font-medium">{{ $t("ai-agent.backend.publish.featureSettings") }}</h4>

                <div class="space-y-3">
                    <!-- 显示品牌信息 -->
                    <div class="flex items-center justify-between">
                        <div>
                            <div class="text-sm font-medium">
                                {{ $t("ai-agent.backend.publish.showBranding") }}
                            </div>
                            <div class="text-muted-foreground text-xs">
                                {{ $t("ai-agent.backend.publish.showBrandingDesc") }}
                            </div>
                        </div>
                        <USwitch v-model="config.showBranding" disabled />
                    </div>

                    <!-- 允许下载历史记录 -->
                    <div class="flex items-center justify-between">
                        <div>
                            <div class="text-sm font-medium">
                                {{ $t("ai-agent.backend.publish.allowDownloadHistory") }}
                            </div>
                            <div class="text-muted-foreground text-xs">
                                {{ $t("ai-agent.backend.publish.allowDownloadHistoryDesc") }}
                            </div>
                        </div>
                        <USwitch v-model="config.allowDownloadHistory" disabled />
                    </div>
                </div>
            </div>

            <!-- 配置预览 -->
            <div class="border-border rounded-lg border p-4">
                <h4 class="mb-3 font-medium">{{ $t("ai-agent.backend.publish.previewConfig") }}</h4>
                <pre class="text-muted-foreground overflow-auto text-xs">
                    {{ JSON.stringify(config, null, 2) }}
                </pre>
            </div>
        </template>
    </div>
</template>
