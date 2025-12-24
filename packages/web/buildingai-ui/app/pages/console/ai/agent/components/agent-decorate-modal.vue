<script setup lang="ts">
import type { AgentDecorateConfig } from "@buildingai/service/consoleapi/ai-agent";
import {
    apiConsoleGetAgentDecorate,
    apiConsoleSetAgentDecorate,
} from "@buildingai/service/consoleapi/ai-agent";

const emit = defineEmits<{
    (e: "close"): void;
}>();

const { t } = useI18n();
const toast = useMessage();

const formData = shallowReactive<AgentDecorateConfig>({
    enabled: false,
    title: "",
    description: "",
    link: {
        name: "",
        path: "",
        query: {},
    },
    heroImageUrl: "",
    overlayTitle: "",
    overlayDescription: "",
    overlayIconUrl: "",
});

const getData = async () => {
    try {
        const data = await apiConsoleGetAgentDecorate();
        useFormData(formData, data);
    } catch (err) {
        console.error("获取装修设置失败:", err);
    }
};

const { lockFn: submitForm, isLock } = useLockFn(async () => {
    try {
        await apiConsoleSetAgentDecorate(formData);
        emit("close");
        toast.success(t("console-common.messages.success"));
    } catch {
        toast.error(t("console-common.messages.failed"));
    }
});

onMounted(() => getData());
</script>

<template>
    <BdModal :title="t('ai-agent.frontend.square.square')" @close="emit('close')">
        <div class="grid grid-cols-1 gap-2">
            <UFormField :label="t('console-common.enabled')">
                <USwitch v-model="formData.enabled" />
            </UFormField>

            <UFormField :label="t('console-common.title')">
                <UInput
                    v-model="formData.title"
                    :ui="{ root: 'w-full' }"
                    :placeholder="t('console-common.placeholder.title')"
                />
            </UFormField>

            <UFormField :label="t('console-common.description')">
                <UTextarea
                    v-model="formData.description"
                    :ui="{ root: 'w-full' }"
                    :placeholder="t('console-common.placeholder.description')"
                />
            </UFormField>

            <UFormField :label="t('console-common.link')">
                <div class="w-full">
                    <LinkPicker v-model="formData.link" size="md" :ui="{ root: 'w-full' }" />
                </div>
            </UFormField>

            <UFormField :label="t('ai-agent.frontend.square.heroImageUrl')">
                <BdUploader
                    v-model="formData.heroImageUrl"
                    class="h-24 w-24"
                    icon="i-lucide-upload"
                    accept=".jpg,.png,.jpeg,.gif,.webp"
                    :maxCount="1"
                    :single="true"
                    :multiple="false"
                />
                <template #hint>
                    <span class="text-muted-foreground text-xs">
                        {{ t("ai-agent.frontend.square.heroImageUrlHint") }}
                    </span>
                </template>
            </UFormField>

            <UFormField :label="t('ai-agent.frontend.square.overlayTitle')">
                <UInput
                    v-model="formData.overlayTitle"
                    :ui="{ root: 'w-full' }"
                    :placeholder="t('ai-agent.frontend.square.placeholder.overlayTitle')"
                />
            </UFormField>

            <UFormField :label="t('ai-agent.frontend.square.overlayDescription')">
                <UTextarea
                    v-model="formData.overlayDescription"
                    :ui="{ root: 'w-full' }"
                    :placeholder="t('ai-agent.frontend.square.placeholder.overlayDescription')"
                />
            </UFormField>

            <UFormField :label="t('ai-agent.frontend.square.overlayIconUrl')">
                <BdUploader
                    v-model="formData.overlayIconUrl"
                    class="h-24 w-24"
                    icon="i-lucide-upload"
                    accept=".jpg,.png,.jpeg,.gif,.webp"
                    :maxCount="1"
                    :single="true"
                    :multiple="false"
                />
            </UFormField>
        </div>

        <div class="flex w-full items-center justify-end gap-2">
            <UButton :disabled="isLock" variant="ghost" @click="emit('close')">
                {{ t("console-common.cancel") }}
            </UButton>
            <UButton :loading="isLock" color="primary" @click="submitForm">
                {{ t("console-common.save") }}
            </UButton>
        </div>
    </BdModal>
</template>
