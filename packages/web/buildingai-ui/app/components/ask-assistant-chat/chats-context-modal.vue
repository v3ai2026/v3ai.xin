<script setup lang="ts">
import type { AiMessage } from "@buildingai/service/models/message";

const props = defineProps<{
    context?: AiMessage[];
}>();

const emits = defineEmits<{
    (e: "close"): void;
}>();

const { t } = useI18n();
const context = computed(() => props.context || []);

const getRoleLabel = (role: string) => {
    if (role === "system") return t("common.chat.context.system");
    if (role === "user") return t("common.chat.context.user");
    return t("common.chat.context.assistant");
};
</script>

<template>
    <BdModal
        :title="t('common.chat.context.title')"
        :description="t('common.chat.context.description')"
        :ui="{ content: 'max-w-xl overflow-y-auto' }"
        @close="emits('close')"
    >
        <BdScrollArea class="h-[50vh]">
            <div class="space-y-4">
                <div
                    v-for="(item, index) in context"
                    :key="index"
                    class="border-default border-b pb-4 last:border-b-0"
                >
                    <div class="flex items-start gap-3">
                        <div class="flex-none">
                            <div
                                class="flex h-8 w-8 items-center justify-center rounded-full text-xs font-medium"
                                :class="{
                                    'bg-blue-100 text-blue-800': item.role === 'system',
                                    'bg-green-100 text-green-800': item.role === 'user',
                                    'bg-purple-100 text-purple-800': item.role === 'assistant',
                                }"
                            >
                                {{
                                    item.role === "system" ? "S" : item.role === "user" ? "U" : "A"
                                }}
                            </div>
                        </div>
                        <div class="min-w-0 flex-1">
                            <div class="mb-2 flex items-center gap-2">
                                <span class="text-foreground text-sm font-medium">
                                    {{ getRoleLabel(item.role) }}
                                </span>
                                <span class="text-muted-foreground text-xs">
                                    {{ index + 1 }}
                                </span>
                            </div>
                            <div
                                class="text-accent-foreground text-sm wrap-break-word whitespace-pre-wrap"
                            >
                                {{ item.content }}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </BdScrollArea>
    </BdModal>
</template>
