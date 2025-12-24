<script setup lang="ts">
import type { AgentTemplateConfig } from "@buildingai/service/consoleapi/ai-agent";
import { apiCreateAgentFromTemplate } from "@buildingai/service/consoleapi/ai-agent";
import { object, string } from "yup";

const { t } = useI18n();
const toast = useMessage();
const router = useRouter();

const props = defineProps<{
    /** 选中的模板 */
    template: AgentTemplateConfig;
}>();

const emits = defineEmits<{
    (e: "close", refresh?: boolean): void;
}>();

const formData = shallowReactive({
    name: "",
    description: "",
    avatar: "",
});

const schema = object({
    description: string().required(t("ai-agent.backend.create.descriptionPlaceholder")),
    name: string().required(t("ai-agent.backend.create.namePlaceholder")),
});

const { lockFn: submitForm, isLock } = useLockFn(async () => {
    try {
        const res = await apiCreateAgentFromTemplate({
            templateId: props.template.id,
            name: formData.name,
            description: formData.description,
            avatar: formData.avatar,
        });

        emits("close", true);
        toast.success(t("ai-agent.backend.template.create.success"));
        router.push(useRoutePath("ai-agent:detail", { id: res.id }));
    } catch (error) {
        console.error(t("ai-agent.backend.template.create.failed"), error);
    }
});

onMounted(() => {
    if (props.template) {
        formData.avatar = props.template.avatar || "";
        formData.name = props.template.name;
        formData.description = props.template.description || "";
    }
});
</script>

<template>
    <BdModal
        :title="t('ai-agent.backend.template.create.title', { name: template?.name })"
        :description="t('ai-agent.backend.template.create.description')"
        :ui="{ content: 'max-w-lg' }"
        @close="emits('close')"
    >
        <UForm :schema="schema" :state="formData" class="space-y-4" @submit="submitForm">
            <div class="flex flex-col gap-4">
                <UFormField :label="$t('ai-agent.backend.create.avatar')" name="avatar">
                    <BdUploader
                        v-model="formData.avatar"
                        class="h-24 w-24"
                        :text="$t('ai-agent.backend.create.avatarUpload')"
                        icon="i-lucide-upload"
                        accept=".jpg,.png,.jpeg,.gif,.webp"
                        :maxCount="1"
                        :single="true"
                        :multiple="false"
                    />
                    <template #hint> {{ $t("ai-agent.backend.create.avatarDefault") }} </template>
                </UFormField>

                <UFormField :label="$t('ai-agent.backend.create.name')" name="name" required>
                    <UInput
                        v-model="formData.name"
                        :placeholder="$t('ai-agent.backend.create.namePlaceholder')"
                        :ui="{ root: 'w-full' }"
                    />
                </UFormField>

                <UFormField
                    :label="$t('ai-agent.backend.create.description')"
                    name="description"
                    required
                >
                    <UTextarea
                        v-model="formData.description"
                        :placeholder="$t('ai-agent.backend.create.descriptionPlaceholder')"
                        :rows="6"
                        :ui="{ root: 'w-full' }"
                    />
                </UFormField>
            </div>

            <div class="mt-6 flex justify-end gap-2">
                <UButton color="neutral" variant="soft" size="lg" @click="emits('close')">
                    {{ $t("console-common.cancel") }}
                </UButton>
                <UButton color="primary" size="lg" :loading="isLock" type="submit">
                    {{ $t("console-common.create") }}
                </UButton>
            </div>
        </UForm>
    </BdModal>
</template>
