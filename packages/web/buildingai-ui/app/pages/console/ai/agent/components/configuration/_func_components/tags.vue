<script setup lang="ts">
import type { Agent } from "@buildingai/service/consoleapi/ai-agent";

const props = defineProps<{
    modelValue: string[];
}>();

const emit = defineEmits<{
    (e: "update:modelValue", value: string[]): void;
}>();

const tags = useVModel(props, "modelValue", emit);
const agents = inject<Agent>("agents");
</script>

<template>
    <div class="bg-muted flex items-center justify-between rounded-lg p-3">
        <div class="flex flex-col gap-1">
            <span class="text-foreground text-sm font-medium">
                {{ $t("ai-agent.backend.configuration.tags") }}
            </span>
            <span class="text-muted-foreground text-xs">
                {{ $t("ai-agent.backend.configuration.tagsDesc") }}
            </span>
        </div>
        <TagCreate v-model="tags" type="app">
            <template #trigger>
                <UButton color="neutral" variant="ghost">
                    <UIcon name="i-lucide-tag" class="size-4" />
                    <span>{{ agents?.tags?.length }} {{ $t("common.tag.tags") }}</span>
                    <UIcon name="i-lucide-chevron-down" class="size-4" />
                </UButton>
            </template>
        </TagCreate>
    </div>
</template>
