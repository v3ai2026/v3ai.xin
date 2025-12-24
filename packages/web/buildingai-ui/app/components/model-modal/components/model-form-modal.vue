<script setup lang="ts">
import {
    apiCreateAiModel,
    apiGetAiModelDetail,
    apiUpdateAiModel,
} from "@buildingai/service/consoleapi/ai-model";
import type {
    CreateAiModelRequest,
    UpdateAiModelRequest,
} from "@buildingai/service/consoleapi/ai-provider";

const AiModelForm = defineAsyncComponent(() => import("./model-form.vue"));

const props = defineProps<{
    /** 模型ID，null 表示创建 */
    id: string | null;
    /** 供应商信息 */
    provider?: {
        id?: string;
        name?: string;
        iconUrl?: string;
    };
}>();

const emits = defineEmits<{
    (e: "close", v?: boolean): void;
}>();

const { t } = useI18n();
const toast = useMessage();

const initialData = shallowRef<Record<string, unknown>>({});

const { lockFn: fetchDetail, isLock: detailLoading } = useLockFn(async () => {
    if (!props.id) return;
    try {
        const data = await apiGetAiModelDetail(props.id);
        initialData.value = { ...data };
    } catch (error) {
        console.error("获取模型详情失败:", error);
    }
});

const { lockFn: submitForm } = useLockFn(
    async (formData: CreateAiModelRequest | UpdateAiModelRequest) => {
        try {
            if (props.id) {
                await apiUpdateAiModel(props.id, formData as UpdateAiModelRequest);
                toast.success(t("console-common.messages.success"));
            } else {
                await apiCreateAiModel({
                    ...(formData as CreateAiModelRequest),
                    providerId: props.provider?.id as string,
                });
                toast.success(t("console-common.messages.success"));
            }
            emits("close", true);
        } catch (error) {
            console.error("提交模型失败:", error);
        }
    },
);

onMounted(() => {
    if (props.id) fetchDetail();
});
</script>

<template>
    <BdModal
        :title="
            props.id
                ? $t('ai-provider.backend.model.editTitle')
                : $t('ai-provider.backend.model.addTitle')
        "
        :ui="{ content: 'max-w-2xl' }"
        @close="emits('close', false)"
    >
        <template #title>
            <div>
                <h3 class="text-lg font-semibold">
                    {{
                        props.id
                            ? $t("ai-provider.backend.model.editTitle")
                            : $t("ai-provider.backend.model.addTitle")
                    }}
                </h3>
                <div class="text-muted-foreground flex items-center gap-2 text-sm">
                    <div v-if="provider?.iconUrl" class="flex-none">
                        <NuxtImg
                            :src="provider.iconUrl"
                            :alt="provider.name"
                            class="h-4 w-4 rounded object-cover"
                        />
                    </div>
                    <div v-else class="flex-none">
                        <UIcon name="i-lucide-building-office" class="h-4 w-4" />
                    </div>
                    <span>{{ provider?.name }}</span>
                </div>
            </div>
        </template>
        <div v-if="detailLoading" class="flex items-center justify-center py-24">
            <UIcon name="i-lucide-loader-2" class="size-8 animate-spin" />
        </div>

        <AiModelForm
            v-else
            :is-edit="!!props.id"
            :id="props.id || ''"
            :initial-data="initialData"
            @submit-success="submitForm"
            @cancel="emits('close', false)"
        />
    </BdModal>
</template>
