<script setup lang="ts">
import { formatDuration } from "@//utils/helper";

const { t } = useI18n();

interface ReasoningData {
    /** Reasoning content */
    content: string;
    /** Start time */
    startTime?: number;
    /** End time */
    endTime?: number;
    /** Duration */
    duration?: number;
}

interface Props {
    /** Reasoning data */
    reasoning?: ReasoningData;
    /** Message ID */
    messageId?: string;
    /** Whether currently thinking */
    isThinking?: boolean;
    /** Whether to open by default */
    defaultOpen?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
    reasoning: undefined,
    messageId: undefined,
    isThinking: false,
    defaultOpen: false,
});

/**
 * Calculate thinking duration
 */
const thinkingDuration = computed(() => {
    if (props.reasoning?.duration) {
        return formatDuration(props.reasoning.duration);
    }

    if (props.reasoning?.startTime && props.reasoning?.endTime) {
        const duration = props.reasoning.endTime - props.reasoning.startTime;
        return formatDuration(duration);
    }

    return null;
});
</script>

<template>
    <div v-if="reasoning?.content || isThinking" class="bg-muted mb-2 rounded-lg p-2">
        <UCollapsible :unmountOnHide="false" class="group" :default-open="defaultOpen">
            <div class="flex cursor-pointer flex-row items-center gap-2 p-1 text-xs select-none">
                <UIcon name="i-lucide-atom" class="text-primary size-4" />

                <div class="text-sm font-medium">
                    {{
                        isThinking
                            ? t("common.chat.reasoning.thinking")
                            : t("common.chat.reasoning.completed")
                    }}
                </div>

                <div v-if="thinkingDuration" class="text-sm font-medium">
                    ({{ t("common.chat.reasoning.duration") }}{{ thinkingDuration }})
                </div>

                <UIcon
                    name="i-lucide-chevron-down"
                    class="size-4 rotate-270 transition-transform duration-200 group-data-[state=open]:rotate-360"
                />
            </div>

            <template #content>
                <div
                    v-if="reasoning?.content"
                    class="text-muted-foreground rounded p-2 text-sm whitespace-pre-wrap"
                >
                    {{ reasoning.content }}
                </div>
            </template>
        </UCollapsible>
    </div>
</template>
