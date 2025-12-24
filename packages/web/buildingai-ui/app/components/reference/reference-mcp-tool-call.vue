<script setup lang="ts">
import type { McpToolCall } from "@buildingai/service/consoleapi/mcp-server";

import { formatDuration } from "@//utils/helper";
import type { TimelineItem } from "#ui/types";

const { t } = useI18n();

interface Props {
    toolCalls?: McpToolCall[];
    messageId?: string;
}

withDefaults(defineProps<Props>(), {
    toolCalls: () => [],
    messageId: undefined,
});

/**
 * Generate tool call timeline items
 * @param item MCP tool call item
 * @returns Timeline item array
 */
const getTimelineItems = (item: McpToolCall): TimelineItem[] => {
    const items: TimelineItem[] = [];

    // If there is input parameter, show start call
    if (item?.input) {
        items.push({
            title: `${t("common.chat.toolCall.startCall")} ${item?.tool?.name}`,
            description: JSON.stringify(item.input),
            icon: "tabler:number-1",
        });
    }

    // If there is output result, show call completed
    if (item?.output) {
        items.push({
            title: `${t("common.chat.toolCall.finishedCall")} ${item?.tool?.name}`,
            description: JSON.stringify(item.output),
            icon: "tabler:number-2",
        });
    }

    return items;
};
</script>

<template>
    <div
        v-if="toolCalls && toolCalls.length > 0"
        class="bg-muted mb-2 flex flex-col gap-1.5 rounded-lg p-2"
    >
        <UCollapsible
            :unmountOnHide="false"
            class="group"
            v-for="(item, index) in toolCalls"
            :key="index"
        >
            <div
                class="flex cursor-pointer flex-row items-center justify-between text-xs select-none"
            >
                <div class="flex flex-wrap items-center gap-2">
                    <UIcon
                        v-if="!item?.output && !item?.error"
                        name="i-lucide-loader-2"
                        class="animate-spin"
                    />
                    <svg
                        class="size-4"
                        width="195"
                        height="195"
                        viewBox="0 0 195 195"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                    >
                        <path
                            d="M25 97.8528L92.8823 29.9706C102.255 20.598 117.451 20.598 126.823 29.9706V29.9706C136.196 39.3431 136.196 54.5391 126.823 63.9117L75.5581 115.177"
                            stroke="currentColor"
                            stroke-width="12"
                            stroke-linecap="round"
                        />
                        <path
                            d="M76.2653 114.47L126.823 63.9117C136.196 54.5391 151.392 54.5391 160.765 63.9117L161.118 64.2652C170.491 73.6378 170.491 88.8338 161.118 98.2063L99.7248 159.6C96.6006 162.724 96.6006 167.789 99.7248 170.913L112.331 183.52"
                            stroke="currentColor"
                            stroke-width="12"
                            stroke-linecap="round"
                        />
                        <path
                            d="M109.853 46.9411L59.6482 97.1457C50.2757 106.518 50.2757 121.714 59.6482 131.087V131.087C69.0208 140.459 84.2168 140.459 93.5894 131.087L143.794 80.8822"
                            stroke="currentColor"
                            stroke-width="12"
                            stroke-linecap="round"
                        />
                    </svg>
                    <div>
                        {{ !item.input && !item.output ? t("common.chat.toolCall.start") : "" }}
                        {{ item.input && !item.output ? t("common.chat.toolCall.calling") : "" }}
                        {{ t("common.chat.toolCall.from") }}
                    </div>
                    <div name="tools" class="bg-primary/15 text-primary rounded px-2 py-1 text-xs">
                        {{ item?.mcpServer?.name }}
                    </div>
                    <div class="text-md">{{ t("common.chat.toolCall.call") }}</div>
                    <div name="tools" class="bg-primary/15 text-primary rounded px-2 py-1 text-xs">
                        {{ item?.tool?.name }}
                    </div>
                    <div>
                        {{ item.input && item.output ? t("common.chat.toolCall.finished") : "" }}
                    </div>
                    <div v-if="item.duration" class="bg-secondary rounded px-2 py-1 text-xs">
                        {{ t("common.chat.toolCall.duration") }}{{ formatDuration(item.duration) }}
                    </div>
                </div>
                <UIcon
                    name="i-lucide-chevron-down"
                    class="rotate-270 transition-transform duration-200 group-data-[state=open]:rotate-360"
                />
            </div>

            <template #content>
                <div v-if="item && item?.tool" class="bg-background mt-3 rounded p-3">
                    <div class="text-foreground text-md mb-3 font-medium">
                        {{ item?.tool?.name }} {{ t("common.reference.callDetails") }}
                    </div>
                    <UTimeline
                        size="xs"
                        :default-value="getTimelineItems(item).length"
                        :items="getTimelineItems(item)"
                        :ui="{ item: 'w-[calc(100%-36px)]' }"
                    />
                </div>
            </template>
        </UCollapsible>
    </div>
</template>
