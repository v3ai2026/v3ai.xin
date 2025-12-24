<script setup lang="ts">
import type { UpdateAgentConfigParams } from "@buildingai/service/consoleapi/ai-agent";
import { useI18n } from "vue-i18n";

const props = defineProps<{
    modelValue: UpdateAgentConfigParams;
}>();

const emit = defineEmits<{
    (e: "update:modelValue", value: UpdateAgentConfigParams): void;
}>();

const state = useVModel(props, "modelValue", emit);
const { t } = useI18n();
</script>
<template>
    <div class="bg-muted flex items-center justify-between rounded-lg p-3">
        <div class="flex flex-col gap-1">
            <div class="text-foreground flex items-center gap-1 text-sm font-medium">
                {{ t("ai-agent.backend.configuration.dialogueConsumption") }}
                <UTooltip :delay-duration="0" :ui="{ content: 'w-xs h-auto' }">
                    <UIcon name="i-lucide-circle-help" />
                    <template #content>
                        <div class="text-background text-xs">
                            <div class="mb-2">
                                {{ t("ai-agent.backend.configuration.billingDescription") }}
                            </div>
                            <div class="space-y-1">
                                <div>
                                    1.
                                    {{
                                        t("ai-agent.backend.configuration.billingSquareConsumption")
                                    }}
                                </div>
                                <div>
                                    2.
                                    {{
                                        t("ai-agent.backend.configuration.billingShareConsumption")
                                    }}
                                </div>
                            </div>
                        </div>
                    </template>
                </UTooltip>
            </div>
        </div>
        <UInput
            type="number"
            v-model="state.billingConfig!.price"
            min="0"
            :ui="{ base: 'pr-24' }"
            @blur="if (state.billingConfig!.price < 0) state.billingConfig!.price = 0;"
        >
            <template #trailing>
                <div class="text-muted-foreground flex items-center justify-center gap-1">
                    <span>{{ t("ai-provider.backend.model.form.power") }}</span>
                    <span>/</span>
                    <span>{{ t("ai-agent.backend.dashboard.times") }}</span>
                </div>
            </template>
        </UInput>
    </div>
</template>
