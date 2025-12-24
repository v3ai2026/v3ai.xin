<script setup lang="ts">
import type { Agent } from "@buildingai/service/consoleapi/ai-agent";

const props = defineProps<{
    agent?: Agent;
}>();

const publishUrl = computed(() => {
    if (!props.agent?.publishToken) return "";
    const baseUrl = window.location.origin;
    return `${baseUrl}/public/agent/shared/${props.agent.publishToken}`;
});

const isPublished = computed(() => props.agent?.isPublished || false);

const openLink = (url: string) => {
    window.open(url, "_blank");
};
</script>

<template>
    <div class="space-y-4">
        <div class="flex items-center justify-between">
            <div class="flex items-center gap-3">
                <UIcon
                    :name="isPublished ? 'i-lucide-globe' : 'i-lucide-globe-lock'"
                    :class="isPublished ? 'text-success' : 'text-muted-foreground'"
                    class="size-5"
                />
                <div>
                    <h3 class="font-medium">
                        {{
                            isPublished
                                ? $t("ai-agent.backend.publish.published")
                                : $t("ai-agent.backend.publish.unpublished")
                        }}
                    </h3>
                    <p class="text-muted-foreground text-sm">
                        {{
                            isPublished
                                ? $t("ai-agent.backend.publish.publishedDesc")
                                : $t("ai-agent.backend.publish.unpublishedDesc")
                        }}
                    </p>
                </div>
            </div>
            <UBadge :color="isPublished ? 'success' : 'neutral'" variant="soft">
                {{
                    isPublished
                        ? $t("ai-agent.backend.publish.published")
                        : $t("ai-agent.backend.publish.unpublished")
                }}
            </UBadge>
        </div>

        <div v-if="isPublished" class="space-y-3">
            <div class="flex flex-col gap-4">
                <div class="space-y-2">
                    <UFormField
                        :label="$t('ai-agent.backend.publish.publicAccessLink')"
                        :ui="{ container: 'flex items-center gap-2' }"
                    >
                        <UInput
                            :value="publishUrl"
                            readonly
                            class="flex-1"
                            :placeholder="
                                $t('ai-agent.backend.publish.publicAccessLinkPlaceholder')
                            "
                        />
                        <BdButtonCopy
                            v-if="publishUrl"
                            :content="publishUrl"
                            variant="outline"
                            :copiedText="$t('console-common.messages.copySuccess')"
                            :default-text="$t('console-common.copy')"
                        />
                        <UButton
                            v-if="publishUrl"
                            icon="i-lucide-external-link"
                            variant="outline"
                            @click="openLink(publishUrl)"
                        />
                    </UFormField>
                </div>

                <div class="space-y-2">
                    <UFormField
                        :label="$t('ai-agent.backend.publish.apiKey')"
                        :ui="{ container: 'flex items-center gap-2' }"
                    >
                        <UInput
                            :value="agent?.apiKey ? '••••••••••••••••' : ''"
                            readonly
                            class="flex-1"
                            :placeholder="$t('ai-agent.backend.publish.apiKeyPlaceholder')"
                        />
                        <BdButtonCopy
                            v-if="agent?.apiKey"
                            :content="agent.apiKey || ''"
                            variant="outline"
                            :copiedText="$t('console-common.messages.copySuccess')"
                            :default-text="$t('console-common.copy')"
                        />
                    </UFormField>
                </div>
            </div>
        </div>
    </div>
</template>
