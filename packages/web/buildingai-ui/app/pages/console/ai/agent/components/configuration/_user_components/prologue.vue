<script setup lang="ts">
const props = defineProps<{
    modelValue: string;
}>();

const emit = defineEmits<{
    (e: "update:modelValue", value: string): void;
}>();

const content = useVModel(props, "modelValue", emit);
</script>

<template>
    <div class="bg-muted rounded-lg p-3">
        <div class="text-foreground mb-2 flex items-center gap-1 text-sm font-medium">
            {{ $t("ai-agent.backend.configuration.prologue") }}
            <UTooltip :delay-duration="0" :ui="{ content: 'w-xs h-auto' }">
                <UIcon name="i-lucide-circle-help" />
                <template #content>
                    <div class="text-background py-1 text-xs">
                        {{ $t("ai-agent.backend.configuration.prologueDesc") }}
                    </div>
                </template>
            </UTooltip>
        </div>

        <div class="grid h-auto w-full">
            <BdEditor v-model="content" outputFormat="markdown" custom-class="!h-auto min-h-50" />
        </div>
    </div>
</template>
