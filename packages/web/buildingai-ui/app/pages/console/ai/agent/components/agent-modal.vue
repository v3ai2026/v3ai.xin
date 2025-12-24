<script setup lang="ts">
import type { UpdateAgentConfigParams } from "@buildingai/service/consoleapi/ai-agent";
import {
    apiCreateAgent,
    apiGetAgentDetail,
    apiUpdateAgentConfig,
} from "@buildingai/service/consoleapi/ai-agent";
import { object, string } from "yup";

import { usePluginSlots } from "@//utils/plugins.utils";

const props = defineProps<{
    /** 智能体ID，如果为null则为创建模式 */
    id: string | null;
}>();

const emits = defineEmits<{
    (e: "close", v?: boolean): void;
}>();

const { t } = useI18n();
const toast = useMessage();
const router = useRouter();

const formData = shallowRef<UpdateAgentConfigParams>({
    name: "",
    description: "",
    avatar: "",
    createMode: "direct",
    thirdPartyIntegration: {},
});

const createModes = computed(() => {
    const modes = [
        {
            value: "direct",
            label: t("ai-agent.backend.create.modes.direct"),
            icon: "i-lucide-zap",
        },
    ];

    const pluginModes = usePluginSlots("agent:create:modes").value.map((slot) => ({
        value: slot.meta?.value,
        label: t(slot.meta?.label as string),
        icon: slot.meta?.icon,
    }));

    return [...modes, ...pluginModes];
});

const schema = object({
    name: string().required(t("ai-agent.backend.create.namePlaceholder")),
    description: string().required(t("ai-agent.backend.create.descriptionPlaceholder")),
});

const { lockFn: fetchDetail, isLock: detailLoading } = useLockFn(async () => {
    try {
        const {
            createdAt: _createdAt,
            userCount: _userCount,
            updatedAt: _updatedAt,
            id: _id,
            ...data
        } = await apiGetAgentDetail(props.id as string);
        formData.value = data as UpdateAgentConfigParams;
    } catch (error) {
        console.error("获取智能体详情失败:", error);
    }
});

const { lockFn: submitForm, isLock } = useLockFn(async () => {
    try {
        if (props.id) {
            if (formData.value.avatar === undefined) {
                formData.value.avatar = null;
            }
            await apiUpdateAgentConfig(props.id, {
                name: formData.value.name,
                description: formData.value.description,
                avatar: formData.value.avatar,
            });
            refreshNuxtData(`agent-detail-${props.id}`);
            toast.success(t("common.message.updateSuccess"));
        } else {
            const res = await apiCreateAgent({
                name: formData.value.name,
                description: formData.value.description,
                avatar: formData.value.avatar,
                createMode: formData.value.createMode,
                thirdPartyIntegration: formData.value.thirdPartyIntegration,
            });
            router.push(useRoutePath("ai-agent:detail", { id: res.id }));
            toast.success(t("common.message.createSuccess"));
        }
        emits("close", true);
    } catch (error) {
        console.error(`${props.id ? "更新" : "创建"}智能体失败:`, error);
    }
});

onMounted(async () => {
    if (props.id) fetchDetail();
});
</script>

<template>
    <BdModal
        :title="
            props.id ? $t('ai-agent.backend.create.editTitle') : $t('ai-agent.backend.create.title')
        "
        :description="
            props.id ? $t('ai-agent.backend.create.editDesc') : $t('ai-agent.backend.create.desc')
        "
        :ui="{ content: 'max-w-lg' }"
        @close="emits('close', false)"
    >
        <div v-if="detailLoading" class="flex items-center justify-center" style="height: 420px">
            <UIcon name="i-lucide-loader-2" class="size-8 animate-spin" />
        </div>

        <UForm v-else :schema="schema" :state="formData" class="space-y-4" @submit="submitForm">
            <div class="flex flex-col gap-4">
                <UFormField
                    v-if="!props.id && createModes.length != 1"
                    :label="$t('ai-agent.backend.create.mode')"
                    name="createMode"
                >
                    <div class="grid grid-cols-3 gap-4">
                        <div
                            v-for="mode in createModes"
                            :key="mode.value as string"
                            class="group hover:border-primary/50 relative cursor-pointer rounded-lg border-2 px-4 py-3 text-center transition-colors"
                            :class="{
                                'border-primary bg-primary/5': formData.createMode === mode.value,
                                'border-gray-200 bg-white': formData.createMode !== mode.value,
                            }"
                            @click="formData.createMode = mode.value as string"
                        >
                            <div
                                v-if="formData.createMode === mode.value"
                                class="bg-primary absolute -top-1 -right-1 flex h-6 w-6 items-center justify-center rounded-full text-white"
                            >
                                <UIcon name="i-lucide-check" class="h-3 w-3" />
                            </div>

                            <div class="mb-2 flex justify-center">
                                <div
                                    class="flex h-12 w-12 items-center justify-center overflow-hidden rounded-lg"
                                    :class="{
                                        'bg-primary text-white': formData.createMode === mode.value,
                                        'bg-gray-100 text-gray-600':
                                            formData.createMode !== mode.value,
                                    }"
                                >
                                    <UIcon
                                        v-if="
                                            mode.icon &&
                                            typeof mode.icon === 'string' &&
                                            !mode.icon.includes('.')
                                        "
                                        :name="mode.icon"
                                        class="h-6 w-6"
                                    />
                                    <component
                                        v-else-if="mode.icon"
                                        :is="mode.icon"
                                        :src="mode.icon as string"
                                        :alt="mode.label"
                                        filled
                                        :fontControlled="false"
                                        class="size-8 object-contain"
                                    />
                                </div>
                            </div>

                            <div class="text-foreground font-medium">{{ mode.label }}</div>
                        </div>
                    </div>
                </UFormField>

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
                <UButton color="neutral" variant="soft" size="lg" @click="emits('close', false)">
                    {{ $t("console-common.cancel") }}
                </UButton>
                <UButton color="primary" size="lg" :loading="isLock" type="submit">
                    {{ props.id ? $t("console-common.update") : $t("console-common.create") }}
                </UButton>
            </div>
        </UForm>
    </BdModal>
</template>
