<script setup lang="ts">
import type { AutoQuestionsConfig } from "@buildingai/service/consoleapi/ai-agent";

const props = defineProps<{
    modelValue: AutoQuestionsConfig;
}>();

const emit = defineEmits<{
    (e: "update:modelValue", value: AutoQuestionsConfig): void;
}>();

const suggest = useVModel(props, "modelValue", emit);
</script>

<template>
    <div class="bg-muted rounded-lg p-3">
        <div class="flex items-center justify-between">
            <div class="flex flex-col gap-1">
                <span class="text-foreground text-sm font-medium">
                    {{ $t("ai-agent.backend.configuration.suggest") }}
                </span>
                <span class="text-muted-foreground text-xs">
                    {{ $t("ai-agent.backend.configuration.suggestDesc") }}
                </span>
            </div>

            <USwitch v-model="suggest.enabled" />
        </div>

        <div class="mt-4 space-y-2" v-if="suggest.enabled">
            <UCheckbox
                v-model="suggest.customRuleEnabled"
                :label="$t('ai-agent.backend.configuration.suggestCustomRule')"
            />
            <UTextarea
                v-if="suggest.customRuleEnabled"
                v-model="suggest.customRule"
                :rows="3"
                :ui="{ root: 'w-full' }"
            />
        </div>
    </div>
</template>
