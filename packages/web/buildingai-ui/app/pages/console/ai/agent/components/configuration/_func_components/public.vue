<script setup lang="ts">
const props = defineProps<{
    modelValue: boolean;
}>();

const emit = defineEmits<{
    (e: "update:modelValue", value: boolean): void;
}>();

const isPublic = useVModel(props, "modelValue", emit);
</script>

<template>
    <div class="bg-muted flex items-center justify-between rounded-lg p-3">
        <div class="flex flex-col gap-1">
            <span class="text-foreground text-sm font-medium">
                {{ $t("ai-agent.backend.configuration.public") }}
            </span>
            <span class="text-muted-foreground text-xs">
                {{ $t("ai-agent.backend.configuration.publicDesc") }}
            </span>
        </div>
        <USwitch v-model="isPublic" />
    </div>
</template>
